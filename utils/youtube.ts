/**
 * Utility functions for YouTube URL validation and processing
 */

/**
 * Validates and extracts video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export const extractYouTubeVideoId = (url: string): string | null => {
    if (!url || typeof url !== 'string') {
        return null;
    }

    // Remove whitespace
    url = url.trim();

    // Regular expressions for different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/ // Just the video ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};

/**
 * Validates if a URL is a valid YouTube video URL
 */
export const isValidYouTubeUrl = (url: string): boolean => {
    return extractYouTubeVideoId(url) !== null;
};

/**
 * Converts any YouTube URL format to embed URL
 */
export const convertToEmbedUrl = (url: string): string | null => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
        return null;
    }
    return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Gets thumbnail URL for a YouTube video
 */
export const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
        return null;
    }
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Validates YouTube URL and returns formatted data
 */
export const validateYouTubeUrl = (url: string): {
    valid: boolean;
    embedUrl: string | null;
    thumbnailUrl: string | null;
    videoId: string | null;
    error?: string;
} => {
    const videoId = extractYouTubeVideoId(url);

    if (!videoId) {
        return {
            valid: false,
            embedUrl: null,
            thumbnailUrl: null,
            videoId: null,
            error: 'Invalid YouTube URL. Please provide a valid YouTube link.'
        };
    }

    return {
        valid: true,
        embedUrl: convertToEmbedUrl(url),
        thumbnailUrl: getYouTubeThumbnail(url),
        videoId,
    };
};
