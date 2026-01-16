/**
 * useSwipeGesture - Touch-based swipe gesture detection
 * 
 * Provides native-like swipe navigation for mobile devices
 * 
 * Responsibilities:
 * - Touch event handling
 * - Swipe direction detection
 * - Velocity calculation
 * - Gesture recognition
 * 
 * @follows Single Responsibility Principle
 */

import { useEffect, useRef, useState } from 'react';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface SwipeCallbacks {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
}

export interface SwipeConfig {
    minSwipeDistance?: number; // Minimum distance in pixels to trigger swipe
    maxSwipeTime?: number; // Maximum time in ms for swipe
    preventDefaultTouchMove?: boolean; // Prevent default touch behavior
}

const DEFAULT_CONFIG: Required<SwipeConfig> = {
    minSwipeDistance: 50,
    maxSwipeTime: 300,
    preventDefaultTouchMove: false
};

export const useSwipeGesture = (
    callbacks: SwipeCallbacks,
    config: SwipeConfig = {}
) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const [isSwiping, setIsSwiping] = useState(false);
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            touchStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
            setIsSwiping(false);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartRef.current) return;

            setIsSwiping(true);

            if (mergedConfig.preventDefaultTouchMove) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartRef.current) return;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchStartRef.current.x;
            const deltaY = touch.clientY - touchStartRef.current.y;
            const deltaTime = Date.now() - touchStartRef.current.time;

            // Reset state
            touchStartRef.current = null;
            setIsSwiping(false);

            // Check if swipe is valid
            if (deltaTime > mergedConfig.maxSwipeTime) {
                console.log('[useSwipeGesture] Swipe too slow');
                return;
            }

            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);

            // Determine swipe direction (prioritize horizontal vs vertical)
            if (absDeltaX > absDeltaY) {
                // Horizontal swipe
                if (absDeltaX < mergedConfig.minSwipeDistance) {
                    console.log('[useSwipeGesture] Horizontal swipe too short');
                    return;
                }

                if (deltaX > 0) {
                    console.log('[useSwipeGesture] Swipe RIGHT detected');
                    callbacks.onSwipeRight?.();
                } else {
                    console.log('[useSwipeGesture] Swipe LEFT detected');
                    callbacks.onSwipeLeft?.();
                }
            } else {
                // Vertical swipe
                if (absDeltaY < mergedConfig.minSwipeDistance) {
                    console.log('[useSwipeGesture] Vertical swipe too short');
                    return;
                }

                if (deltaY > 0) {
                    console.log('[useSwipeGesture] Swipe DOWN detected');
                    callbacks.onSwipeDown?.();
                } else {
                    console.log('[useSwipeGesture] Swipe UP detected');
                    callbacks.onSwipeUp?.();
                }
            }
        };

        // Attach listeners to document
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: !mergedConfig.preventDefaultTouchMove });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [callbacks, mergedConfig]);

    return { isSwiping };
};
