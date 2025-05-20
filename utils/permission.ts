// utils/mediaPermissions.ts
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
    try {
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Required",
                "You need to grant media library permissions to access or upload photos."
            );
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error requesting media library permissions:", error);
        Alert.alert("Error", "Failed to request media library permissions");
        return false;
    }
};
