import { MaterialIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import {
    Alert,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface FullScreenPhotoViewProps {
    photo: MediaLibrary.Asset | null;
    visible: boolean;
    onClose: () => void;
    onPhotoDeleted: () => void;
}

export default function FullScreenPhotoView({
    photo,
    visible,
    onClose,
    onPhotoDeleted
}: FullScreenPhotoViewProps) {
    const handleDelete = async () => {
        Alert.alert(
            "Delete Photo",
            "Are you sure you want to delete this photo?",
            // TODO: Implement share functionality
        );
    };

    const handleShare = () => {
        // TODO: Implement share functionality
        Alert.alert("Share", "Share functionality coming soon");
    };

    const handlePin = () => {
        // TODO: Implement pin functionality
        Alert.alert("Pin", "Pin functionality coming soon");
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black bg-opacity-90">
                {/* Header with back button */}
                <View className="flex-row items-center py-4 px-2 ">
                    <TouchableOpacity
                        onPress={onClose}
                        className="p-2"
                    >
                        <MaterialIcons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Image */}
                <View className="flex-1 justify-center items-center">
                    {photo && (
                        <Image
                            source={{ uri: photo.uri }}
                            className="w-full h-3/4"
                            resizeMode="contain"
                        />
                    )}
                </View>

                {/* Bottom options */}
                <View className="flex-row justify-around items-center p-6 bg-black bg-opacity-50">
                    <TouchableOpacity
                        className="items-center"
                        onPress={handleDelete}
                    >
                        <MaterialIcons name="delete" size={28} color="white" />
                        <Text className="text-white mt-1">Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="items-center"
                        onPress={handleShare}
                    >
                        <MaterialIcons name="share" size={28} color="white" />
                        <Text className="text-white mt-1">Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="items-center"
                        onPress={handlePin}
                    >
                        <MaterialIcons name="push-pin" size={28} color="white" />
                        <Text className="text-white mt-1">Pin</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
} 