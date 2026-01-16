/**
 * BackgroundSyncService - Prevents data loss when app goes to background
 * 
 * Responsibilities:
 * - Page Visibility API monitoring
 * - beforeunload event handling
 * - Force sync on app background/close
 * - Network connectivity monitoring
 * 
 * @follows Single Responsibility Principle
 */

import { AppState } from '../types';
import { SyncService } from './SyncService';

type BackgroundSyncCallback = () => AppState | null;

class BackgroundSyncServiceClass {
    private userId: string | null = null;
    private getStateCallback: BackgroundSyncCallback | null = null;
    private isInitialized = false;

    /**
     * Initialize background sync listeners
     */
    initialize(userId: string, getState: BackgroundSyncCallback): void {
        if (this.isInitialized) {
            console.warn('[BackgroundSyncService] Already initialized');
            return;
        }

        console.log('[BackgroundSyncService] Initializing...');
        this.userId = userId;
        this.getStateCallback = getState;

        this.setupVisibilityListener();
        this.setupBeforeUnloadListener();
        this.setupNetworkListener();

        this.isInitialized = true;
    }

    /**
     * Clean up listeners
     */
    cleanup(): void {
        if (!this.isInitialized) return;

        console.log('[BackgroundSyncService] Cleaning up listeners');

        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);

        this.isInitialized = false;
        this.userId = null;
        this.getStateCallback = null;
    }

    /**
     * Setup Page Visibility API listener
     * Triggers sync when user switches tabs or minimizes app
     */
    private setupVisibilityListener(): void {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    /**
     * Handle visibility change event
     */
    private handleVisibilityChange = (): void => {
        if (document.hidden) {
            console.log('[BackgroundSyncService] App going to background, forcing sync...');
            this.forceSyncNow();
        } else {
            console.log('[BackgroundSyncService] App came to foreground');
            // Could trigger a fetch here to get latest data
        }
    };

    /**
     * Setup beforeunload listener
     * Triggers sync when user closes tab/browser
     */
    private setupBeforeUnloadListener(): void {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    /**
     * Handle beforeunload event
     */
    private handleBeforeUnload = (_event: BeforeUnloadEvent): void => {
        console.log('[BackgroundSyncService] Window closing, forcing sync...');

        // Force synchronous sync using sendBeacon if available
        const state = this.getStateCallback?.();
        if (state && this.userId) {
            this.forceSyncNow();

            // Show warning if there's unsaved data (optional)
            // event.preventDefault();
            // event.returnValue = '';
        }
    };

    /**
     * Setup network status listeners
     */
    private setupNetworkListener(): void {
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    /**
     * Handle online event - sync when connection restored
     */
    private handleOnline = (): void => {
        console.log('[BackgroundSyncService] Connection restored, syncing...');
        this.forceSyncNow();
    };

    /**
     * Handle offline event
     */
    private handleOffline = (): void => {
        console.log('[BackgroundSyncService] Connection lost, sync paused');
    };

    /**
     * Force immediate sync
     */
    private forceSyncNow(): void {
        if (!this.userId || !this.getStateCallback) {
            console.warn('[BackgroundSyncService] Cannot sync - missing userId or callback');
            return;
        }

        const state = this.getStateCallback();
        if (!state) {
            console.warn('[BackgroundSyncService] No state to sync');
            return;
        }

        // Use SyncService for the actual sync
        SyncService.forceSync(this.userId, state).catch(error => {
            console.error('[BackgroundSyncService] Force sync failed:', error);
        });
    }

    /**
     * Check if browser is online
     */
    isOnline(): boolean {
        return navigator.onLine;
    }

    /**
     * Get page visibility state
     */
    isVisible(): boolean {
        return !document.hidden;
    }
}

// Singleton instance
export const BackgroundSyncService = new BackgroundSyncServiceClass();
