import AsyncStorage from "@react-native-async-storage/async-storage";
import { ServerPhoto } from "./serverPhotos";

const CACHE_KEY = "server_photos_cache";
const CACHE_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

interface CachedPhotos {
    timestamp: number;
    photos: ServerPhoto[];
}

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
