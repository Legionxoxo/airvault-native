import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export const useGalleryMonitor = (
    onNewPhotos?: (photos: MediaLibrary.Asset[]) => void
) => {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastNotificationTime = useRef<number>(0);
    const processingRef = useRef<boolean>(false);

    useEffect(() => {
        let subscription: MediaLibrary.Subscription | null = null;
        let lastCheckTime = new Date(0);

        const startMonitoring = async () => {
            try {
                // Request permissions
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== "granted") {
                    throw new Error("Media library permission not granted");
                }

                // Set up notification handler
                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowBanner: true,
                        shouldShowList: true,
                        shouldPlaySound: true,
                        shouldSetBadge: true,
                    }),
                });

                // Configure notification channel for Android
                if (Platform.OS === "android") {
                    await Notifications.setNotificationChannelAsync("gallery", {
                        name: "Gallery Updates",
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: "#FF231F7C",
                    });
                }

                // Subscribe to media library changes
                subscription = await MediaLibrary.addListener(async (event) => {
                    // Prevent concurrent processing
                    if (processingRef.current) return;
                    processingRef.current = true;

                    try {
                        // Get recent photos
                        const { assets } = await MediaLibrary.getAssetsAsync({
                            mediaType: ["photo"],
                            first: 100,
                            sortBy: ["creationTime"],
                        });

                        // Filter new photos
                        const newPhotos = assets.filter((asset) => {
                            const creationTime = new Date(asset.creationTime);
                            return creationTime > lastCheckTime;
                        });

                        if (newPhotos.length > 0) {
                            // Update last check time
                            lastCheckTime = new Date();

                            // Check if enough time has passed since last notification (at least 2 seconds)
                            const now = Date.now();
                            if (now - lastNotificationTime.current > 2000) {
                                // Show notification
                                await Notifications.scheduleNotificationAsync({
                                    content: {
                                        title: "New Photos Detected",
                                        body: `${newPhotos.length} new photo${
                                            newPhotos.length > 1 ? "s" : ""
                                        } found in your gallery`,
                                        data: { type: "new_photos" },
                                        sound: true,
                                        priority:
                                            Notifications
                                                .AndroidNotificationPriority
                                                .HIGH,
                                    },
                                    trigger: null,
                                });
                                lastNotificationTime.current = now;
                            }

                            // Call the callback if provided
                            if (onNewPhotos) {
                                onNewPhotos(newPhotos);
                            }
                        }
                    } catch (error) {
                        console.error("Error processing new photos:", error);
                        setError(
                            error instanceof Error
                                ? error.message
                                : "Failed to process new photos"
                        );
                    } finally {
                        processingRef.current = false;
                    }
                });

                setIsMonitoring(true);
                setError(null);
            } catch (error) {
                console.error("Error starting gallery monitoring:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to start gallery monitoring"
                );
            }
        };

        startMonitoring();

        // Cleanup
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [onNewPhotos]);

    return {
        isMonitoring,
        error,
    };
};
