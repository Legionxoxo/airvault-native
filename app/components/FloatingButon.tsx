import Plus from '@/assets/icons/plus.svg';
import { requestMediaLibraryPermission } from '@/utils/permission';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
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
}

const FloatingActionButton = ({ onUploadSuccess }: FloatingActionButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

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
                const savedAssets = await Promise.all(
                    result.assets.map((asset) => MediaLibrary.createAssetAsync(asset.uri))
                );

                Alert.alert('Success', `Saved ${savedAssets.length} photos to your library`);

                if (onUploadSuccess) onUploadSuccess();
            }
        } catch (error) {
            console.error('Error picking or saving images:', error);
            Alert.alert('Error', 'Failed to upload photos');
        }

        setIsOpen(false);
    };

    const handleCreateAlbum = () => {
        console.log('Create Album clicked');
        Alert.alert('Create Album', 'Album creation functionality will be implemented here');
        setIsOpen(false);
    };

    const handleSelectPhotos = () => {
        console.log('Select Photos clicked');
        Alert.alert('Select Photos', 'Photo selection functionality will be implemented here');
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
                            <View className="bg-white  rounded-2xl px-4 py-3 mr-3 w-[110px]">
                                <Text
                                    className="font-medium text-nowrap overflow-hidden text-sm text-center"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    Upload Photos
                                </Text>
                            </View>
                            <TouchableOpacity
                                className="bg-white size-[48px] rounded-full justify-center items-center shadow-lg"
                                onPress={handleUploadPhotos}
                            >
                                <Feather name="upload" size={24} color="#2678FF" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-2 flex-row items-center">
                            <View className="bg-white rounded-2xl px-4 py-3 mr-3 w-[110px]">
                                <Text
                                    className="font-medium text-nowrap overflow-hidden text-sm text-center"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    Create Album
                                </Text>
                            </View>
                            <TouchableOpacity
                                className="bg-white size-[48px] rounded-full justify-center items-center shadow-lg"
                                onPress={handleCreateAlbum}
                            >
                                <FontAwesome5 name="folder-plus" size={24} color="#2678FF" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-2 flex-row items-center">
                            <View className="bg-white  rounded-2xl px-4 py-3 mr-3 w-[110px]">
                                <Text
                                    className="font-medium text-nowrap overflow-hidden text-sm text-center"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    Select Photos
                                </Text>
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
