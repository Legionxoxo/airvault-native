import AsyncStorage from "@react-native-async-storage/async-storage";
import { ServerPhoto } from "./serverPhotos";

const CACHE_KEY = "server_photos_cache";
const CACHE_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
const WINDOW_SIZE = 20; // Number of photos to keep in memory cache

interface CachedPhotos {
    timestamp: number;
    photos: ServerPhoto[];
}

// Track currently visible photos
let visiblePhotos: Set<string> = new Set();

export const getCachedPhotos = async (): Promise<ServerPhoto[] | null> => {
    try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        if (!cachedData) return null;

        const { timestamp, photos }: CachedPhotos = JSON.parse(cachedData);
        const now = Date.now();

        // Check if cache is still valid (less than 2 days old)
        if (now - timestamp < CACHE_DURATION) {
            return photos;
        }

        // Cache expired, remove it
        await AsyncStorage.removeItem(CACHE_KEY);
        return null;
    } catch (error) {
        console.error("Error reading photo cache:", error);
        return null;
    }
};

export const setCachedPhotos = async (photos: ServerPhoto[]): Promise<void> => {
    try {
        const cacheData: CachedPhotos = {
            timestamp: Date.now(),
            photos,
        };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error("Error setting photo cache:", error);
    }
};

export const clearPhotoCache = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.error("Error clearing photo cache:", error);
    }
};

// Update visible photos tracking
export const updateVisiblePhotos = (
    photos: ServerPhoto[],
    startIndex: number
) => {
    // Clear previous visible photos
    visiblePhotos.clear();

    // Add current window of photos
    const endIndex = Math.min(startIndex + WINDOW_SIZE, photos.length);
    console.log(
        `[PhotoCache] Loading window from index ${startIndex} to ${endIndex} (${
            endIndex - startIndex
        } photos)`
    );

    for (let i = startIndex; i < endIndex; i++) {
        const photo = photos[i];
        visiblePhotos.add(photo.id);
    }

    console.log(
        `[PhotoCache] Current window contains ${visiblePhotos.size} photos`
    );
};

// Check if a photo is in the current window
export const isPhotoVisible = (photoId: string): boolean => {
    return visiblePhotos.has(photoId);
};
