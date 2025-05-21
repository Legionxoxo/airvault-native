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

    const loadPhotos = async () => {
        try {
            setLoading(true);
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.photo,
                first: 100,
                sortBy: [MediaLibrary.SortBy.creationTime],
            });

            setPhotos(media.assets);

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

            setPhotos((prev) => [...prev, ...media.assets]);

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
