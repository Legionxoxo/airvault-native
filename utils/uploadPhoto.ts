import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/env";

const UPLOADED_PHOTOS_KEY = "uploaded_photos";

// Get all uploaded photos from storage
const getUploadedPhotos = async (): Promise<Set<string>> => {
    try {
        const data = await AsyncStorage.getItem(UPLOADED_PHOTOS_KEY);
        return new Set(data ? JSON.parse(data) : []);
    } catch (error) {
        console.error("Error getting uploaded photos:", error);
        return new Set();
    }
};

// Add a photo to uploaded photos in storage
const addUploadedPhoto = async (photoId: string): Promise<void> => {
    try {
        const uploadedPhotos = await getUploadedPhotos();
        uploadedPhotos.add(photoId);
        await AsyncStorage.setItem(
            UPLOADED_PHOTOS_KEY,
            JSON.stringify([...uploadedPhotos])
        );
    } catch (error) {
        console.error("Error adding uploaded photo:", error);
    }
};

interface UploadResponse {
    success: boolean;
    msg?: string;
}

const handleUploadPhoto = async (
    photoUri: string,
    photoId: string,
    setUploadingPhotos: (callback: (prev: Set<string>) => Set<string>) => void,
    setUploadedPhotos: (callback: (prev: Set<string>) => Set<string>) => void
): Promise<UploadResponse> => {
    try {
        setUploadingPhotos((prev) => new Set([...prev, photoId]));

        const formData = new FormData();
        formData.append("file", {
            uri: photoUri,
            type: "image/jpeg",
            name: "photo.jpg",
        } as any);

        const response = await fetch(`${API_BASE_URL}/photos/upload`, {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const data = await response.json();

        if (data.success) {
            setUploadedPhotos((prev) => new Set([...prev, photoId]));
            // Add to persistent storage
            await addUploadedPhoto(photoId);
            return { success: true };
        } else {
            return { success: false, msg: data.msg };
        }
    } catch (error) {
        console.error("Error uploading photo:", error);
        return { success: false, msg: "Network error occurred" };
    } finally {
        setUploadingPhotos((prev) => {
            const newSet = new Set(prev);
            newSet.delete(photoId);
            return newSet;
        });
    }
};

export default handleUploadPhoto;
