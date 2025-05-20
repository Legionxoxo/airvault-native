import * as MediaLibrary from 'expo-media-library';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FloatingActionButton from './FloatingButon';

// Interface for photo groups by month
interface PhotoGroup {
    month: string;
    year: number;
    photos: MediaLibrary.Asset[];
}

export default function GalleryScreen() {
    const [permissionStatus, setPermissionStatus] = useState<MediaLibrary.PermissionStatus | null>(null);
    const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper function to convert month name to number
    const monthNameToNumber = (monthName: string): number => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        return monthNames.indexOf(monthName);
    };

    // Group photos by month
    const photosByMonth = useMemo(() => {
        const groups: Record<string, PhotoGroup> = {};

        photos.forEach((photo) => {
            // fallback to current date if creationTime is missing or zero
            const creationTime = photo.creationTime && photo.creationTime > 0 ? photo.creationTime : Date.now();
            const date = new Date(creationTime);
            const monthYear = `${date.getFullYear()}-${date.getMonth()}`
            if (!groups[monthYear]) {
                // Format month name
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December',
                ];

                groups[monthYear] = {
                    month: monthNames[date.getMonth()],
                    year: date.getFullYear(),
                    photos: [],
                };
            }

            groups[monthYear].photos.push(photo);
        });

        // Convert to array and sort by date (newest first)
        return Object.values(groups).sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;

            const monthA = monthNameToNumber(a.month);
            const monthB = monthNameToNumber(b.month);
            return monthB - monthA;
        });
    }, [photos]);

    useEffect(() => {
        requestPermissionAndLoadPhotos();
    }, []);

    const requestPermissionAndLoadPhotos = async () => {
        try {
            setLoading(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setPermissionStatus(status);

            if (status === 'granted') {
                await loadPhotos();
            } else {
                Alert.alert(
                    'Permission Required',
                    'This app needs access to your media library to display your photos.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
            Alert.alert('Error', 'Failed to request media library permissions');
        } finally {
            setLoading(false);
        }
    };

    const loadPhotos = async () => {
        try {
            setLoading(true);

            // Get all photos without filtering by album
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.photo,
                first: 100, // initial batch size
                sortBy: [MediaLibrary.SortBy.creationTime],
            });

            setPhotos(media.assets);

            // If there are more photos to load
            if (media.hasNextPage && media.endCursor) {
                loadMorePhotos(media.endCursor);
            }
        } catch (error) {
            console.error('Error loading photos:', error);
            Alert.alert('Error', 'Failed to load photos from gallery');
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

            setPhotos((prevPhotos) => [...prevPhotos, ...media.assets]);

            // Continue loading more if available
            if (media.hasNextPage && media.endCursor) {
                loadMorePhotos(media.endCursor);
            }
        } catch (error) {
            console.error('Error loading more photos:', error);
        }
    };

    const renderMonthSection = ({ item }: { item: PhotoGroup }) => (
        <View className="mb-3">
            <Text className="text-lg font-bold py-2.5 px-2">{`${item.month} ${item.year}`}</Text>
            <FlatList
                data={item.photos}
                keyExtractor={(photo) => photo.id}
                numColumns={3}
                scrollEnabled={false} // Disable scrolling for nested FlatList
                renderItem={({ item: photo }) => (
                    <View className="w-1/3 aspect-square p-0.5">
                        <Image source={{ uri: photo.uri }} className="w-full h-full bg-red-500" />
                    </View>
                )}
            />
        </View>
    );

    if (loading && photos.length === 0) {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-3 text-base">Loading photos...</Text>
            </View>
        );
    }

    if (permissionStatus !== 'granted') {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-base mb-5 text-center">No access to media library</Text>
                <TouchableOpacity
                    className="bg-blue-500 py-2.5 px-5 rounded"
                    onPress={requestPermissionAndLoadPhotos}
                >
                    <Text className="text-white text-base text-center">Request Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {photosByMonth.length === 0 ? (
                <Text className="text-base text-center mt-5">No photos found</Text>
            ) : (
                <FlatList
                    data={photosByMonth}
                    keyExtractor={(item) => `${item.month}-${item.year}`}
                    renderItem={renderMonthSection}
                    onEndReached={() => {
                        if (photos.length > 0) {
                            // Fallback in case recursive loading doesn't get all photos
                            const lastPhoto = photos[photos.length - 1];
                            loadMorePhotos(lastPhoto.id);
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
            )}
            {loading && photos.length > 0 && (
                <View className="p-2.5 items-center">
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text className="mt-1">Loading more...</Text>
                </View>
            )}

            {/* Floating Action Button with reload callback */}
            <FloatingActionButton onUploadSuccess={requestPermissionAndLoadPhotos} />
        </View>
    );
}
