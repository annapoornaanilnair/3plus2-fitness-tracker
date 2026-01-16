/**
 * StorageService - Handles all localStorage/sessionStorage operations
 * 
 * Responsibilities:
 * - Safe read/write to browser storage with error handling
 * - Cache versioning and migration
 * - Quota management
 * - Data corruption recovery
 * 
 * @follows Single Responsibility Principle
 */

const CACHE_VERSION = '1.0.0';
const VERSION_KEY = 'cache_version';

export interface StorageResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

class StorageServiceClass {
    /**
     * Get user-specific key for localStorage
     */
    private getUserKey(userId: string, key: string): string {
        return `fitness_${userId}_${key}`;
    }

    /**
     * Safe localStorage read with error handling
     */
    read<T>(key: string, userId?: string): StorageResult<T> {
        try {
            const storageKey = userId ? this.getUserKey(userId, key) : key;
            const item = localStorage.getItem(storageKey);

            if (!item) {
                return { success: true, data: undefined };
            }

            const parsed = JSON.parse(item);
            return { success: true, data: parsed };
        } catch (error) {
            console.error(`[StorageService] Read error for key "${key}":`, error);

            // Attempt recovery by deleting corrupted key
            this.delete(key, userId);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown storage error'
            };
        }
    }

    /**
     * Safe localStorage write with quota handling
     */
    write<T>(key: string, data: T, userId?: string): StorageResult<void> {
        try {
            const storageKey = userId ? this.getUserKey(userId, key) : key;
            const serialized = JSON.stringify(data);

            localStorage.setItem(storageKey, serialized);

            return { success: true };
        } catch (error) {
            console.error(`[StorageService] Write error for key "${key}":`, error);

            // Handle quota exceeded
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.warn('[StorageService] Storage quota exceeded, attempting cleanup...');
                this.cleanup(userId);

                // Retry once after cleanup
                try {
                    const storageKey = userId ? this.getUserKey(userId, key) : key;
                    localStorage.setItem(storageKey, JSON.stringify(data));
                    return { success: true };
                } catch (retryError) {
                    return {
                        success: false,
                        error: 'Storage quota exceeded even after cleanup'
                    };
                }
            }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown storage error'
            };
        }
    }

    /**
     * Delete a key from localStorage
     */
    delete(key: string, userId?: string): void {
        try {
            const storageKey = userId ? this.getUserKey(userId, key) : key;
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error(`[StorageService] Delete error for key "${key}":`, error);
        }
    }

    /**
     * Clear all user-specific data
     */
    clearUserData(userId: string): void {
        try {
            const keysToRemove: string[] = [];
            const prefix = `fitness_${userId}_`;

            // Find all keys for this user
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(prefix)) {
                    keysToRemove.push(key);
                }
            }

            // Remove them
            keysToRemove.forEach(key => localStorage.removeItem(key));

            console.log(`[StorageService] Cleared ${keysToRemove.length} keys for user ${userId}`);
        } catch (error) {
            console.error('[StorageService] Error clearing user data:', error);
        }
    }

    /**
     * Clear ALL localStorage (use with caution)
     */
    clearAll(): void {
        try {
            localStorage.clear();
            sessionStorage.clear();
            console.log('[StorageService] Cleared all storage');
        } catch (error) {
            console.error('[StorageService] Error clearing all storage:', error);
        }
    }

    /**
     * Cleanup old/corrupted data to free up space
     */
    private cleanup(userId?: string): void {
        try {
            // Remove old cache versions
            const currentVersion = this.read<string>(VERSION_KEY);
            if (currentVersion.data !== CACHE_VERSION) {
                console.log('[StorageService] Cache version mismatch, clearing old data');
                if (userId) {
                    this.clearUserData(userId);
                }
                this.write(VERSION_KEY, CACHE_VERSION);
            }

            // Remove orphaned keys (keys without user prefix if userId exists)
            if (userId) {
                const orphanedKeys: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key?.startsWith('fitness_') && !key.startsWith(`fitness_${userId}_`)) {
                        orphanedKeys.push(key);
                    }
                }

                orphanedKeys.forEach(key => localStorage.removeItem(key));
                console.log(`[StorageService] Removed ${orphanedKeys.length} orphaned keys`);
            }
        } catch (error) {
            console.error('[StorageService] Cleanup error:', error);
        }
    }

    /**
     * Get storage usage statistics
     */
    getStorageInfo(): { used: number; available: number; percentage: number } {
        try {
            let used = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const item = localStorage.getItem(key);
                    used += (key.length + (item?.length || 0)) * 2; // 2 bytes per char
                }
            }

            const available = 5 * 1024 * 1024; // 5MB typical limit
            const percentage = (used / available) * 100;

            return { used, available, percentage };
        } catch (error) {
            console.error('[StorageService] Error getting storage info:', error);
            return { used: 0, available: 0, percentage: 0 };
        }
    }

    /**
     * Check if storage is available
     */
    isAvailable(): boolean {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }
}

// Singleton instance
export const StorageService = new StorageServiceClass();
