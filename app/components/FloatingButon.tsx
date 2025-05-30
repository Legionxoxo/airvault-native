import Plus from '@/assets/icons/plus.svg';
import { requestMediaLibraryPermission } from '@/utils/permission';
import handleUploadPhoto from '@/utils/uploadPhoto';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


interface FloatingActionButtonProps {
    onUploadSuccess?: () => void;
    onSelectModeToggle?: () => void;
    onCreateAlbum?: () => void;
}

const FloatingActionButton = ({ onUploadSuccess, onSelectModeToggle, onCreateAlbum }: FloatingActionButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingPhotos, setUploadingPhotos] = useState<Set<string>>(new Set());
    const [uploadedPhotos, setUploadedPhotos] = useState<Set<string>>(new Set());

    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            setShowMenu(true);
            Animated.timing(animation, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start(() => {
                setShowMenu(false);
            });
        }
    }, [isOpen]);

    const menuTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [40, 0],
    });

    const menuOpacity = animation;

    const handleUploadPhotos = async () => {
        try {
            const hasPermission = await requestMediaLibraryPermission();
            if (!hasPermission) return;

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: true,
                quality: 1,
            });

            if (!result.canceled) {
                setIsUploading(true);
                let successCount = 0;
                let hasError = false;

                // Upload each selected photo
                for (const asset of result.assets) {
                    const photoId = Date.now().toString(); // Generate a unique ID for each photo
                    try {
                        const response = await handleUploadPhoto(
                            asset.uri,
                            photoId,
                            setUploadingPhotos,
                            setUploadedPhotos
                        );

                        if (response?.success) {
                            successCount++;
                        } else {
                            hasError = true;
                        }
                    } catch (error) {
                        console.error('Error uploading photo:', error);
                        hasError = true;
                    }
                }

                if (successCount > 0 && !hasError) {
                    Alert.alert('Success', `Successfully uploaded ${successCount} photos`);
                    if (onUploadSuccess) onUploadSuccess();
                } else {
                    Alert.alert('Error', 'Failed to upload some or all photos. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error picking or uploading images:', error);
            Alert.alert('Error', 'Failed to upload photos. Please check your network connection and try again.');
        } finally {
            setIsUploading(false);
            setIsOpen(false);
        }
    };

    const handleCreateAlbum = () => {
        if (onCreateAlbum) onCreateAlbum();
        setIsOpen(false);
    };

    const handleSelectPhotos = () => {
        if (onSelectModeToggle) onSelectModeToggle();
        setIsOpen(false);
    };

    return (
        <View className="absolute bottom-6 right-6 font-roboto-500">
            {showMenu && (
                <View
                    className="absolute bottom-[60px] right-0 items-end"
                    pointerEvents={isOpen ? 'auto' : 'none'}
                >
                    <Animated.View
                        style={{
                            opacity: menuOpacity,
                            transform: [{ translateY: menuTranslate }],
                        }}
                    >
                        <View className="mb-2 flex-row items-center">
                            <View className="bg-white rounded-2xl px-4 py-3 mr-3 w-[110px]">
                                <Text className="font-medium text-sm text-center">
                                    {isUploading ? 'Uploading...' : 'Upload Photos'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                className="bg-white size-[48px] rounded-full justify-center items-center shadow-lg"
                                onPress={handleUploadPhotos}
                                disabled={isUploading}
                            >
                                <Feather name="upload" size={24} color={isUploading ? "#9CA3AF" : "#2678FF"} />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-2 flex-row items-center">
                            <View className="bg-white rounded-2xl px-4 py-3 mr-3 w-[110px]">
                                <Text className="font-medium text-sm text-center">Create Album</Text>
                            </View>
                            <TouchableOpacity
                                className="bg-white size-[48px] rounded-full justify-center items-center shadow-lg"
                                onPress={handleCreateAlbum}
                            >
                                <FontAwesome5 name="folder-plus" size={24} color="#2678FF" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-2 flex-row items-center">
                            <View className="bg-white rounded-2xl px-4 py-3 mr-3 w-[110px]">
                                <Text className="font-medium text-sm text-center">Select Photos</Text>
                            </View>
                            <TouchableOpacity
                                className="bg-white size-[48px] rounded-full justify-center items-center shadow-lg"
                                onPress={handleSelectPhotos}
                            >
                                <MaterialCommunityIcons
                                    name="checkbox-multiple-marked"
                                    size={24}
                                    color="#2678FF"
                                />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            )}

            <TouchableOpacity
                className="bg-primary size-[56px] rounded-full justify-center items-center shadow-lg"
                onPress={toggleMenu}
            >
                <Plus fill="white" />
            </TouchableOpacity>
        </View>
    );
};

export default FloatingActionButton;
