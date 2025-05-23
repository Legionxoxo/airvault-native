import Chatbot from '@/assets/icons/chatbot.svg';
import Logo from '@/assets/icons/logo.svg';
import { useGalleryMonitor } from '@/hooks/useGalleryMonitor';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { PhotoGroup } from '@/types/photoGroup';
import { groupPhotosByMonth } from '@/utils/groupPhotosByMonth';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CreateAlbumModal from './CreateAlbumModal';
import CustomHeader from './CustomHeader';
import FloatingActionButton from './FloatingButon';

export default function GalleryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [creatingAlbum, setCreatingAlbum] = useState(false);

    const {
        permissionStatus,
        photos,
        loading,
        requestPermissionAndLoadPhotos,
        loadMorePhotos,
    } = useMediaLibrary();

    // Add gallery monitoring
    const { isMonitoring, error: monitoringError } = useGalleryMonitor((newPhotos) => {
        // Refresh the gallery when new photos are detected
        requestPermissionAndLoadPhotos();
    });

    const photosByMonth = useMemo(() => groupPhotosByMonth(photos), [photos]);

    // Handle navigation mode
    useEffect(() => {
        if (params.mode === 'create-album') {
            setIsSelecting(true);
            // Clear the mode from URL after handling
            router.setParams({});
        }
    }, [params.mode]);

    const togglePhotoSelection = (id: string) => {
        setSelectedPhotos((prev) =>
            prev.includes(id) ? prev.filter((photoId) => photoId !== id) : [...prev, id]
        );
    };

    const isPhotoSelected = (id: string) => selectedPhotos.includes(id);

    const areAllMonthPhotosSelected = (monthPhotoIds: string[]) =>
        monthPhotoIds.every((id) => selectedPhotos.includes(id));

    const toggleMonthSelection = (monthPhotoIds: string[]) => {
        const allSelected = areAllMonthPhotosSelected(monthPhotoIds);
        setSelectedPhotos((prev) =>
            allSelected
                ? prev.filter((id) => !monthPhotoIds.includes(id))
                : [...prev, ...monthPhotoIds.filter((id) => !prev.includes(id))]
        );
    };

    const clearSelection = () => {
        setSelectedPhotos([]);
        setIsSelecting(false);
    };

    // Helper: Save album to AsyncStorage
    const saveAlbum = async (name: string, photoIds: string[]) => {
        try {
            const albumsRaw = await AsyncStorage.getItem('albums');
            const albums = albumsRaw ? JSON.parse(albumsRaw) : [];
            const newAlbum = {
                id: Date.now().toString(),
                name,
                photoIds,
            };
            await AsyncStorage.setItem('albums', JSON.stringify([...albums, newAlbum]));
        } catch (e) {
            console.error('Failed to save album', e);
        }
    };

    // Show modal when 'Create Album' is clicked
    const createAlbum = () => {
        setShowAlbumModal(true);
    };

    // Handle album creation in modal
    const handleCreateAlbum = async () => {
        if (!albumName.trim() || selectedPhotos.length === 0) return;
        setCreatingAlbum(true);
        await saveAlbum(albumName.trim(), selectedPhotos);
        setCreatingAlbum(false);
        setShowAlbumModal(false);
        setAlbumName('');
        clearSelection();
        // TODO: Optionally navigate to Collection screen
    };

    const renderMonthSection = ({ item }: { item: PhotoGroup }) => {
        const photoIds = item.photos.map((photo) => photo.id);
        const allSelected = areAllMonthPhotosSelected(photoIds);

        return (
            <View className="mb-3">
                <View className="flex-row justify-between items-center px-2 py-2">
                    <Text className="text-lg font-bold">{`${item.month} ${item.year}`}</Text>
                    {isSelecting && (
                        <TouchableOpacity onPress={() => toggleMonthSelection(photoIds)}>
                            {allSelected ? (
                                <View className="w-6 h-6 bg-primary rounded-lg justify-center items-center">
                                    <MaterialIcons name="check" size={18} color="white" />
                                </View>
                            ) : (
                                <View className="w-6 h-6 border-2 border-gray-400 rounded-lg" />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
                <FlatList
                    data={item.photos}
                    keyExtractor={(photo) => photo.id}
                    numColumns={3}
                    scrollEnabled={false}
                    renderItem={({ item: photo }) => (
                        <View className="w-1/3 aspect-square p-0.5">
                            <TouchableOpacity
                                onPress={() => isSelecting && togglePhotoSelection(photo.id)}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: photo.uri }}
                                    className={`w-full h-full ${selectedPhotos.includes(photo.id) ? 'opacity-50' : ''
                                        }`}
                                />
                                {isSelecting && (
                                    <View className="absolute top-1 right-1 rounded-md p-1">
                                        {isPhotoSelected(photo.id) ? (
                                            <View className="w-6 h-6 bg-primary rounded-lg justify-center items-center">
                                                <MaterialIcons name="check" size={18} color="white" />
                                            </View>
                                        ) : (
                                            <View className="w-6 h-6 rounded-lg border-2 border-white" />
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        );
    };

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
                    className="bg-primary py-2.5 px-5 rounded"
                    onPress={requestPermissionAndLoadPhotos}
                >
                    <Text className="text-white text-base text-center">Request Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <CustomHeader
                rightIcon={
                    isSelecting ? (
                        <TouchableOpacity onPress={clearSelection} className='-mr-2'>
                            <MaterialIcons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity className='mr-2' onPress={() => router.push('/(tabs)/(modals)/chatbot')}>
                            <Chatbot />
                        </TouchableOpacity>
                    )
                }
                centerContent={
                    isSelecting ? (
                        <TouchableOpacity
                            onPress={createAlbum}
                            className="bg-primary px-3 py-3 rounded-xl self-start flex items-center justify-center"
                        >
                            <Text className="text-white">Create Album</Text>
                        </TouchableOpacity>
                    ) : (
                        <Logo />
                    )
                }
                leftIcon={
                    isSelecting && (
                        <View className="flex-row items-center">
                            <Text className="text-lg font-semibold mr-1">Selected Photos</Text>
                            <Text className="text-base text-light-100 mr-12">({selectedPhotos.length})</Text>
                        </View>

                    )
                }
            />

            {/* Album Creation Modal */}
            <CreateAlbumModal
                visible={showAlbumModal}
                onClose={() => setShowAlbumModal(false)}
                onCreate={handleCreateAlbum}
                albumName={albumName}
                setAlbumName={setAlbumName}
                selectedPhotos={selectedPhotos}
                photos={photos}
                togglePhotoSelection={togglePhotoSelection}
                creatingAlbum={creatingAlbum}
            />

            {photosByMonth.length === 0 ? (
                <Text className="text-base text-center mt-5">No photos found</Text>
            ) : (
                <FlatList
                    data={photosByMonth}
                    keyExtractor={(item) => `${item.month}-${item.year}`}
                    renderItem={renderMonthSection}
                    onEndReached={() => {
                        if (photos.length > 0) {
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

            <FloatingActionButton
                onUploadSuccess={requestPermissionAndLoadPhotos}
                onSelectModeToggle={() => setIsSelecting((prev) => !prev)}
                onCreateAlbum={() => {
                    setIsSelecting(true);
                }}
            />
        </SafeAreaView>
    );
}
