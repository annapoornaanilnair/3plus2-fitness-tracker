/**
 * Service Layer Exports
 * 
 * Centralized export point for all business logic services.
 * Follow the Dependency Inversion Principle by depending on these services
 * rather than direct implementations.
 */

export { StorageService } from './StorageService';
export { SyncService } from './SyncService';
export { WorkoutService } from './WorkoutService';
export { BackgroundSyncService } from './BackgroundSyncService';

export type { StorageResult } from './StorageService';
export type { SyncStatus, SyncState } from './SyncService';
export type { WorkoutValidation } from './WorkoutService';
