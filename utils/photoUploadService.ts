import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";

interface UploadQueueItem {
    uri: string;
    status: "pending" | "uploading" | "completed" | "failed";
    error?: string;
    retryCount: number;
    creationTime?: string;
    modificationTime?: string;
}

const UPLOAD_QUEUE_KEY = "PHOTO_UPLOAD_QUEUE";
const MAX_RETRIES = 3;

const showUploadNotification = async (message: string) => {
    console.log("[PhotoService] Showing notification:", message);
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Photo Upload",
                body: message,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null,
        });
    } catch (error) {
        console.error("[PhotoService] Error showing notification:", error);
    }
};

export const addToUploadQueue = async (
    uri: string,
    metadata?: { creationTime?: string; modificationTime?: string }
) => {
    console.log("[PhotoService] Adding to upload queue:", { uri, metadata });
    try {
        const queue = await getUploadQueue();
        const newItem: UploadQueueItem = {
            uri,
            status: "pending",
            retryCount: 0,
            creationTime: metadata?.creationTime,
            modificationTime: metadata?.modificationTime,
        };
        queue.push(newItem);
        await AsyncStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(queue));
        console.log("[PhotoService] Successfully added to queue");
        await showUploadNotification("Photo added to upload queue");
    } catch (error) {
        console.error("[PhotoService] Error adding to upload queue:", error);
        throw error;
    }
};

export const getUploadQueue = async (): Promise<UploadQueueItem[]> => {
    console.log("[PhotoService] Getting upload queue...");
    try {
        const queue = await AsyncStorage.getItem(UPLOAD_QUEUE_KEY);
        const parsedQueue = queue ? JSON.parse(queue) : [];
        console.log("[PhotoService] Queue length:", parsedQueue.length);
        return parsedQueue;
    } catch (error) {
        console.error("[PhotoService] Error getting upload queue:", error);
        return [];
    }
};

export const updateUploadStatus = async (
    uri: string,
    status: UploadQueueItem["status"],
    error?: string
) => {
    console.log("[PhotoService] Updating status:", { uri, status, error });
    try {
        const queue = await getUploadQueue();
        const item = queue.find((item) => item.uri === uri);
        if (item) {
            item.status = status;
            if (error) item.error = error;
            await AsyncStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(queue));
            console.log("[PhotoService] Status updated successfully");
        } else {
            console.warn("[PhotoService] Item not found in queue");
        }
    } catch (error) {
        console.error("[PhotoService] Error updating upload status:", error);
    }
};

export const processPhoto = async (item: UploadQueueItem): Promise<boolean> => {
    console.log("[PhotoService] Processing photo:", item.uri);
    try {
        const fileInfo = await FileSystem.getInfoAsync(item.uri);
        if (!fileInfo.exists) {
            throw new Error("File does not exist");
        }

        // Here you would implement your actual upload logic
        // For now, we'll simulate a successful upload
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Store the photo metadata
        const photoData = {
            uri: item.uri,
            creationTime: item.creationTime,
            modificationTime: item.modificationTime,
            uploadTime: new Date().toISOString(),
        };

        // Store the photo data in AsyncStorage
        const photos = await AsyncStorage.getItem("PHOTOS");
        const photoList = photos ? JSON.parse(photos) : [];
        photoList.push(photoData);
        await AsyncStorage.setItem("PHOTOS", JSON.stringify(photoList));

        await updateUploadStatus(item.uri, "completed");
        await showUploadNotification("Photo uploaded successfully");
        return true;
    } catch (error: unknown) {
        console.error("[PhotoService] Error processing photo:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
        await updateUploadStatus(item.uri, "failed", errorMessage);
        return false;
    }
};

export const processUploadQueue = async () => {
    console.log("[PhotoService] Processing upload queue...");
    try {
        const queue = await getUploadQueue();
        const pendingItems = queue.filter(
            (item) => item.status === "pending" || item.status === "failed"
        );
        console.log("[PhotoService] Pending items:", pendingItems.length);

        for (const item of pendingItems) {
            if (item.retryCount >= MAX_RETRIES) {
                console.log(
                    "[PhotoService] Max retries reached for:",
                    item.uri
                );
                continue;
            }

            try {
                await updateUploadStatus(item.uri, "uploading");
                const success = await processPhoto(item);
                if (!success) {
                    item.retryCount++;
                    await updateUploadStatus(
                        item.uri,
                        "failed",
                        "Upload failed"
                    );
                }
            } catch (error: unknown) {
                console.error("[PhotoService] Error processing item:", error);
                item.retryCount++;
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred";
                await updateUploadStatus(item.uri, "failed", errorMessage);
            }
        }

        // Clean up completed items
        const updatedQueue = queue.filter(
            (item) => item.status !== "completed"
        );
        await AsyncStorage.setItem(
            UPLOAD_QUEUE_KEY,
            JSON.stringify(updatedQueue)
        );
    } catch (error) {
        console.error("[PhotoService] Error processing queue:", error);
    }
};
