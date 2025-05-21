import Backarrow from '@/assets/icons/backarrow.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const AlbumDetail = () => {
    const { id } = useLocalSearchParams();
    const [album, setAlbum] = useState<any>(null);
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAlbum = async () => {
            setLoading(true);
            const albumsRaw = await AsyncStorage.getItem('albums');
            const albums = albumsRaw ? JSON.parse(albumsRaw) : [];
            const found = albums.find((a: any) => a.id === id);
            setAlbum(found);
            setLoading(false);
        };
        fetchAlbum();
    }, [id]);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (!album) return;
            try {
                const MediaLibrary = require('expo-media-library');
                const res = await MediaLibrary.getAssetsAsync({
                    mediaType: 'photo',
                    first: 1000,
                });
                const albumPhotos = res.assets.filter((p: any) =>
                    album.photoIds.includes(p.id)
                );
                setPhotos(albumPhotos);
            } catch (e) {
                setPhotos([]);
            }
        };
        fetchPhotos();
    }, [album]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#2678FF" />
            </View>
        );
    }

    if (!album) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-xl text-gray-400">Album not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-5">
                    <Text className="text-blue-500 text-base">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{
                title: album.name,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} className="pr-2">
                        <Backarrow />
                    </TouchableOpacity>
                ),
            }} />
            <View className="flex-1 bg-gray-50 pt-8">
                {photos.length === 0 ? (
                    <Text className="text-base text-gray-400 text-center mt-10">
                        No photos in this album
                    </Text>
                ) : (
                    <FlatList
                        data={photos}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <View className="w-1/3 aspect-square p-1">
                                <Image
                                    source={{ uri: item.uri }}
                                    className="w-full h-full rounded-lg"
                                />
                            </View>
                        )}
                    />
                )}
            </View>
        </>
    );
};

export default AlbumDetail;
