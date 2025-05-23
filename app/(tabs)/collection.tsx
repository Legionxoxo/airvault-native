import Plus from '@/assets/icons/plus.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';

interface Album {
    id: string;
    name: string;
    photoIds: string[];
}

const Collection = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [photos, setPhotos] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchAlbums = async () => {
            setLoading(true);
            const albumsRaw = await AsyncStorage.getItem('albums');
            const albums = albumsRaw ? JSON.parse(albumsRaw) : [];
            setAlbums(albums);
            setLoading(false);
        };
        fetchAlbums();
    }, []);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const MediaLibrary = require('expo-media-library');
                const res = await MediaLibrary.getAssetsAsync({ mediaType: 'photo', first: 1000 });
                setPhotos(res.assets);
            } catch (e) {
                setPhotos([]);
            }
        };
        fetchPhotos();
    }, []);

    const getPhotoUri = (id: string) => {
        const photo = photos.find((p) => p.id === id);
        return photo ? photo.uri : undefined;
    };

    return (
        <View className="flex-1 bg-gray-50">
            <CustomHeader
                rightIcon={
                    <TouchableOpacity className='mr-2'
                        onPress={() => router.push({
                            pathname: '/(tabs)',
                            params: { mode: 'create-album' }

                        })}>
                        <Plus />
                    </TouchableOpacity>
                }
                centerContent={<Text className="text-[20px] font-medium text-dark-100">Collections</Text>}
            />
            <ScrollView className="bg-gray-50 p-4 mt-4" >
                {loading ? (
                    <ActivityIndicator size="large" color="#2678FF" />
                ) : albums.length === 0 ? (
                    <Text className="text-center text-gray-400 mt-10 text-base">No albums found</Text>
                ) : (
                    <View className="flex flex-wrap flex-row justify-between">
                        {albums.map((album) => (
                            <TouchableOpacity
                                key={album.id}
                                className="mb-4 w-[48%]"
                                onPress={() =>
                                    router.push({ pathname: '/album/[id]', params: { id: album.id } })
                                }
                            >
                                {album.photoIds.length > 0 && getPhotoUri(album.photoIds[0]) ? (
                                    <Image
                                        source={{ uri: getPhotoUri(album.photoIds[0]) }}
                                        className="w-full h-32 rounded-t-2xl"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-full h-32 rounded-t-lg bg-gray-200 justify-center items-center">
                                        <Text className="text-gray-400">No Photo</Text>
                                    </View>
                                )}
                                <View className="px-2 py-1">
                                    <Text className="text-lg font-semibold font-roboto text-dark-100">{album.name}</Text>
                                    <Text className="text-light-100 font-roboto">
                                        {album.photoIds.length} photos
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default Collection;
