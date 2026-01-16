/**
 * SyncService - Handles real-time synchronization with Supabase
 * 
 * Responsibilities:
 * - Real-time subscriptions to profile changes
 * - Conflict resolution with merge strategies
 * - Background sync orchestration
 * - Network status monitoring
 * 
 * @follows Single Responsibility Principle
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase/client';
import { AppState } from '../types';
import { StorageService } from './StorageService';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline';

export interface SyncState {
    status: SyncStatus;
    lastSyncTime: number;
    error?: string;
}

type SyncCallback = (remoteState: AppState) => void;
type StatusCallback = (status: SyncState) => void;

class SyncServiceClass {
    private channel: RealtimeChannel | null = null;
    private syncCallback: SyncCallback | null = null;
    private statusCallback: StatusCallback | null = null;
    private userId: string | null = null;
    private syncState: SyncState = {
        status: 'offline',
        lastSyncTime: 0
    };

    /**
     * Initialize real-time subscription for user's profile
     */
    subscribe(userId: string, onSync: SyncCallback, onStatusChange?: StatusCallback): void {
        console.log('[SyncService] Initializing subscription for user:', userId);

        this.userId = userId;
        this.syncCallback = onSync;
        this.statusCallback = onStatusChange || null;

        // Create new channel
        this.channel = supabase
            .channel(`profile_changes:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`
                },
                (payload) => {
                    console.log('[SyncService] Received update from server:', payload);
                    this.handleRemoteUpdate(payload.new as any);
                }
            )
            .subscribe((status) => {
                console.log('[SyncService] Subscription status:', status);

                if (status === 'SUBSCRIBED') {
                    this.updateStatus({ status: 'synced', lastSyncTime: Date.now() });
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    this.updateStatus({
                        status: 'error',
                        lastSyncTime: this.syncState.lastSyncTime,
                        error: `Subscription ${status.toLowerCase()}`
                    });
                }
            });
    }

    /**
     * Unsubscribe from real-time updates
     */
    unsubscribe(): void {
        if (this.channel) {
            console.log('[SyncService] Unsubscribing from channel');
            supabase.removeChannel(this.channel);
            this.channel = null;
            this.updateStatus({ status: 'offline', lastSyncTime: this.syncState.lastSyncTime });
        }
    }

    /**
     * Handle remote update from Supabase
     */
    private handleRemoteUpdate(remoteData: { app_data: AppState }): void {
        if (!this.syncCallback || !this.userId) return;

        try {
            const remoteState = remoteData.app_data;

            // Get local state for conflict resolution
            const localResult = StorageService.read<AppState>('app_data', this.userId);

            if (!localResult.success || !localResult.data) {
                // No local state, just use remote
                console.log('[SyncService] No local state, accepting remote update');
                this.syncCallback(remoteState);
                this.updateStatus({ status: 'synced', lastSyncTime: Date.now() });
                return;
            }

            const localState = localResult.data;

            // Conflict resolution: merge strategies
            const mergedState = this.mergeStates(localState, remoteState);

            console.log('[SyncService] Merged local and remote states');
            this.syncCallback(mergedState);
            this.updateStatus({ status: 'synced', lastSyncTime: Date.now() });
        } catch (error) {
            console.error('[SyncService] Error handling remote update:', error);
            this.updateStatus({
                status: 'error',
                lastSyncTime: this.syncState.lastSyncTime,
                error: error instanceof Error ? error.message : 'Merge failed'
            });
        }
    }

    /**
     * Merge local and remote states with conflict resolution
     * 
     * Strategy:
     * - Workout logs: Union of both sets (merge by date)
     * - Streak: Use remote (server is source of truth after validation)
     * - Profile: Use most recent by last_updated timestamp
     * - Current workout: Keep local (in-progress state)
     */
    private mergeStates(local: AppState, remote: AppState): AppState {
        // Merge workout logs (union by date, prefer remote for conflicts)
        const logMap = new Map<string, any>();

        local.workoutLogs?.forEach(log => {
            logMap.set(log.date, log);
        });

        remote.workoutLogs?.forEach(log => {
            const existing = logMap.get(log.date);
            if (!existing || new Date(remote.last_updated || '1970-01-01').getTime() > new Date(local.last_updated || '1970-01-01').getTime()) {
                logMap.set(log.date, log);
            }
        });

        const mergedLogs = Array.from(logMap.values()).sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Determine which profile to use
        const useRemoteProfile = !local.profile.last_updated ||
            new Date(remote.profile?.last_updated || 0) > new Date(local.profile.last_updated || 0);

        return {
            profile: useRemoteProfile ? remote.profile : local.profile,
            workoutLogs: mergedLogs,
            currentWorkout: local.currentWorkout || remote.currentWorkout,
            energyMode: remote.energyMode || local.energyMode || 'high',
            customExercises: [...(local.customExercises || []), ...(remote.customExercises || [])],
            last_updated: new Date().toISOString()
        };
    }

    /**
     * Push local state to Supabase
     */
    async push(userId: string, state: AppState): Promise<{ success: boolean; error?: string }> {
        try {
            this.updateStatus({ status: 'syncing', lastSyncTime: this.syncState.lastSyncTime });

            const { error } = await supabase
                .from('profiles')
                .update({ app_data: state })
                .eq('id', userId);

            if (error) throw error;

            console.log('[SyncService] Successfully pushed state to server');
            this.updateStatus({ status: 'synced', lastSyncTime: Date.now() });

            return { success: true };
        } catch (error) {
            console.error('[SyncService] Push error:', error);
            this.updateStatus({
                status: 'error',
                lastSyncTime: this.syncState.lastSyncTime,
                error: error instanceof Error ? error.message : 'Push failed'
            });

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Fetch latest state from Supabase
     */
    async fetch(userId: string): Promise<{ success: boolean; data?: AppState; error?: string }> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('app_data')
                .eq('id', userId)
                .single();

            if (error) throw error;

            return { success: true, data: data?.app_data };
        } catch (error) {
            console.error('[SyncService] Fetch error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Fetch failed'
            };
        }
    }

    /**
     * Force sync - useful for background/beforeunload events
     */
    async forceSync(userId: string, state: AppState): Promise<void> {
        console.log('[SyncService] Force sync triggered');
        await this.push(userId, state);
    }

    /**
     * Update sync status and notify callback
     */
    private updateStatus(newStatus: SyncState): void {
        this.syncState = newStatus;
        if (this.statusCallback) {
            this.statusCallback(newStatus);
        }
    }

    /**
     * Get current sync status
     */
    getStatus(): SyncState {
        return { ...this.syncState };
    }
}

// Singleton instance
export const SyncService = new SyncServiceClass();
