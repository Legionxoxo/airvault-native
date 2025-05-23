import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useMediaLibrary() {
    const [permissionStatus, setPermissionStatus] =
        useState<MediaLibrary.PermissionStatus | null>(null);
    const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        requestPermissionAndLoadPhotos();
    }, []);

    const requestPermissionAndLoadPhotos = async () => {
        try {
            setLoading(true);

            // Request media library permission
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setPermissionStatus(status);

            if (status === "granted") {
                await loadPhotos();
            } else {
                Alert.alert(
                    "Permission Required",
                    "This app needs access to your media library to display your photos.",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error("Error requesting permissions:", error);
            Alert.alert("Error", "Failed to request media library permissions");
        } finally {
            setLoading(false);
        }
    };

    const processPhotoAsset = async (
        asset: MediaLibrary.Asset
    ): Promise<MediaLibrary.Asset> => {
        // If we already have creation time, use it
        if (asset.creationTime) {
            return asset;
        }

        try {
            const info = await MediaLibrary.getAssetInfoAsync(asset);
            // Only use the info if it provides a valid creation time
            if (info.creationTime) {
                return {
                    ...asset,
                    creationTime: info.creationTime,
                    modificationTime:
                        info.modificationTime ||
                        asset.modificationTime ||
                        Date.now(),
                };
            }
        } catch (error) {
            // Silently handle the error - we'll use fallback values
        }

        // Use modification time as fallback, or current time if neither is available
        const fallbackTime = asset.modificationTime || Date.now();
        return {
            ...asset,
            creationTime: fallbackTime,
            modificationTime: fallbackTime,
        };
    };

    const loadPhotos = async () => {
        try {
            setLoading(true);
            // First get all albums
            const albums = await MediaLibrary.getAlbumsAsync();
            console.log(
                "Available albums:",
                albums.map((a) => a.title)
            );

            // Get photos from all albums
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.photo,
                first: 100,
                sortBy: [MediaLibrary.SortBy.creationTime],
            });

            console.log("Found photos:", media.assets.length);

            // Process photos in batches to avoid overwhelming the system
            const batchSize = 10;
            const assetsWithInfo: MediaLibrary.Asset[] = [];

            for (let i = 0; i < media.assets.length; i += batchSize) {
                const batch = media.assets.slice(i, i + batchSize);
                const batchResults = await Promise.all(
                    batch.map(processPhotoAsset)
                );
                assetsWithInfo.push(...batchResults);
            }

            setPhotos(assetsWithInfo);

            if (media.hasNextPage && media.endCursor) {
                loadMorePhotos(media.endCursor);
            }
        } catch (error) {
            console.error("Error loading photos:", error);
            Alert.alert("Error", "Failed to load photos from gallery");
        } finally {
            setLoading(false);
        }
    };

    const loadMorePhotos = async (after: string) => {
        try {
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.photo,
                first: 100,
                after,
                sortBy: [MediaLibrary.SortBy.creationTime],
            });

            // Process photos in batches
            const batchSize = 10;
            const assetsWithInfo: MediaLibrary.Asset[] = [];

            for (let i = 0; i < media.assets.length; i += batchSize) {
                const batch = media.assets.slice(i, i + batchSize);
                const batchResults = await Promise.all(
                    batch.map(processPhotoAsset)
                );
                assetsWithInfo.push(...batchResults);
            }

            setPhotos((prev) => [...prev, ...assetsWithInfo]);

            if (media.hasNextPage && media.endCursor) {
                loadMorePhotos(media.endCursor);
            }
        } catch (error) {
            console.error("Error loading more photos:", error);
        }
    };

    return {
        permissionStatus,
        photos,
        loading,
        requestPermissionAndLoadPhotos,
        loadMorePhotos,
    };
}
