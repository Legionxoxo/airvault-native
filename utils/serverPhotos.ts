import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { API_BASE_URL } from "../config/env";
import { getCachedPhotos, setCachedPhotos } from "./photoCache";

export interface ServerPhoto {
    id: string;
    url: string;
    thumbnailUrl: string;
    filename: string;
    uploadedAt: string;
    captureDate?: string; // Date when the photo was taken
}

export interface PhotoGroup {
    month: string;
    year: string;
    photos: (MediaLibrary.Asset | ServerPhoto)[];
}

export const fetchServerPhotos = async (
    folder_id?: string
): Promise<ServerPhoto[]> => {
    try {
        // Try to get photos from cache first
        const cachedPhotos = await getCachedPhotos();
        if (cachedPhotos) {
            return cachedPhotos;
        }

        // If no cache or cache expired, fetch from server
        const response = await fetch(`${API_BASE_URL}/photos/list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folder_id }),
        });

        const data = await response.json();
        if (data.success) {
            const photos = data.photos.map((photo: any) => ({
                id: photo.id,
                url: photo.photo_url,
                thumbnailUrl: photo.thumbnail_url,
                filename: photo.filename,
                uploadedAt: photo.uploaded_at,
                captureDate: photo.capture_date || photo.uploaded_at,
            }));

            // Cache the fetched photos
            await setCachedPhotos(photos);
            return photos;
        }
        return [];
    } catch (error) {
        console.error("Error fetching server photos:", error);
        return [];
    }
};

// Helper function to get month and year from a date string or timestamp
const getMonthYear = (
    dateValue: string | number
): { month: string; year: string } => {
    const date = new Date(dateValue);
    return {
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear().toString(),
    };
};

// Group photos by month
export const groupPhotosByMonth = (
    localPhotos: MediaLibrary.Asset[],
    serverPhotos: ServerPhoto[]
): PhotoGroup[] => {
    // Combine local and server photos
    const allPhotos = [
        ...localPhotos.map((photo) => ({
            ...photo,
            captureDate: photo.creationTime,
            uploadedAt: photo.creationTime, // Use creation time for local photos
        })),
        ...serverPhotos,
    ];

    // Group photos by month
    const groups = new Map<string, PhotoGroup>();

    allPhotos.forEach((photo) => {
        const date = photo.captureDate || photo.uploadedAt;
        const { month, year } = getMonthYear(date);
        const key = `${month}-${year}`;

        if (!groups.has(key)) {
            groups.set(key, { month, year, photos: [] });
        }
        groups.get(key)?.photos.push(photo);
    });

    // Sort groups by date (newest first)
    return Array.from(groups.values()).sort((a, b) => {
        const dateA = new Date(`${a.month} 1, ${a.year}`);
        const dateB = new Date(`${b.month} 1, ${b.year}`);
        return dateB.getTime() - dateA.getTime();
    });
};

export const downloadPhoto = async (
    photo: ServerPhoto
): Promise<MediaLibrary.Asset | null> => {
    try {
        // Download the file
        const downloadResult = await FileSystem.downloadAsync(
            photo.url,
            FileSystem.documentDirectory + photo.filename
        );

        if (downloadResult.status === 200) {
            // Save to media library
            const asset = await MediaLibrary.createAssetAsync(
                downloadResult.uri
            );
            return asset;
        }
        return null;
    } catch (error) {
        console.error("Error downloading photo:", error);
        return null;
    }
};
