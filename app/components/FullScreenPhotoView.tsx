import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ServerPhoto } from '../../utils/serverPhotos';

interface FullScreenPhotoViewProps {
    photo: MediaLibrary.Asset | ServerPhoto | null;
    visible: boolean;
    onClose: () => void;
    onPhotoDeleted: () => void;
    source?: 'cache' | 'server' | 'local';
}

export default function FullScreenPhotoView({
    photo,
    visible,
    onClose,
    onPhotoDeleted,
    source
}: FullScreenPhotoViewProps) {
    const [isLoading, setIsLoading] = React.useState(true);

    const handleDelete = async () => {
        if (!photo || !('uri' in photo)) return;

        Alert.alert(
            "Delete Photo",
            "Are you sure you want to delete this photo?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await MediaLibrary.deleteAssetsAsync([photo.id]);
                            onPhotoDeleted();
                            onClose();
                        } catch (error) {
                            console.error('Error deleting photo:', error);
                            Alert.alert('Error', 'Failed to delete photo');
                        }
                    }
                }
            ]
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

    const getImageUri = () => {
        if (!photo) return '';
        if ('url' in photo) {
            return photo.url; // Server photo
        }
        return photo.uri; // Local photo
    };

    const isLocalPhoto = (photo: MediaLibrary.Asset | ServerPhoto | null): photo is MediaLibrary.Asset => {
        return photo !== null && 'uri' in photo;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black bg-opacity-90">
                {/* Header with back button and source info */}
                <View className="flex-row items-center justify-between py-4 px-2">
                    <TouchableOpacity
                        onPress={onClose}
                        className="p-2"
                    >
                        <MaterialIcons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    {source && (
                        <Text className="text-white text-sm mr-4">
                            Source: {source}
                        </Text>
                    )}
                </View>

                {/* Image with loading indicator */}
                <View className="flex-1 justify-center items-center">
                    {photo && (
                        <View className="w-full h-3/4">
                            <Image
                                source={{ uri: getImageUri() }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="contain"
                                onLoadStart={() => setIsLoading(true)}
                                onLoadEnd={() => setIsLoading(false)}
                            />
                            {isLoading && (
                                <View className="absolute inset-0 justify-center items-center">
                                    <ActivityIndicator size="large" color="white" />
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Bottom options */}
                <View className="flex-row justify-around items-center py-4">
                    {isLocalPhoto(photo) && (
                        <TouchableOpacity
                            className="items-center"
                            onPress={handleDelete}
                        >
                            <MaterialIcons name="delete" size={28} color="white" />
                            <Text className="text-white mt-1">Delete</Text>
                        </TouchableOpacity>
                    )}

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