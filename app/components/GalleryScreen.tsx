import Chatbot from '@/assets/icons/chatbot.svg';
import { useGalleryMonitor } from '@/hooks/useGalleryMonitor';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import handleUploadPhoto from '@/utils/uploadPhoto';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    ViewToken
} from 'react-native';
import { updateVisiblePhotos } from '../../utils/photoCache';
import { downloadPhoto, fetchServerPhotos, groupPhotosByMonth, PhotoGroup, ServerPhoto } from '../../utils/serverPhotos';
import CreateAlbumModal from './CreateAlbumModal';
import CustomHeader from './CustomHeader';
import FloatingActionButton from './FloatingButon';
import FullScreenPhotoView from './FullScreenPhotoView';

export default function GalleryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [creatingAlbum, setCreatingAlbum] = useState(false);
    const [uploadingPhotos, setUploadingPhotos] = useState<Set<string>>(new Set());
    const [uploadedPhotos, setUploadedPhotos] = useState<Set<string>>(new Set());
    const [serverPhotos, setServerPhotos] = useState<ServerPhoto[]>([]);
    const [downloadingPhotos, setDownloadingPhotos] = useState<Set<string>>(new Set());
    const [selectedServerPhoto, setSelectedServerPhoto] = useState<ServerPhoto | null>(null);
    const [selectedLocalPhoto, setSelectedLocalPhoto] = useState<MediaLibrary.Asset | null>(null);
    const [selectedPhotoSource, setSelectedPhotoSource] = useState<'cache' | 'server' | 'local'>('local');
    const [photoSource, setPhotoSource] = useState<{ [key: string]: 'cache' | 'server' }>({});
    const flatListRef = useRef<FlatList>(null);

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

    // Group photos by month
    const photosByMonth = useMemo(() => {
        return groupPhotosByMonth(photos, serverPhotos);
    }, [photos, serverPhotos]);

    // Load uploaded photos from storage on mount
    useEffect(() => {
        const loadUploadedPhotos = async () => {
            const data = await AsyncStorage.getItem('uploaded_photos');
            if (data) {
                setUploadedPhotos(new Set(JSON.parse(data)));
            }
        };
        loadUploadedPhotos();
    }, []);

    // Fetch server photos
    useEffect(() => {
        const loadServerPhotos = async () => {
            const photos = await fetchServerPhotos();
            setServerPhotos(photos);

            // Check if photos came from cache
            const cachedPhotos = await AsyncStorage.getItem('server_photos_cache');
            if (cachedPhotos) {
                const { timestamp, photos: cachedPhotosList } = JSON.parse(cachedPhotos);
                const now = Date.now();
                const isFromCache = now - timestamp < 2 * 24 * 60 * 60 * 1000; // 2 days

                // Create a map of photo sources
                const sourceMap: { [key: string]: 'cache' | 'server' } = {};
                photos.forEach(photo => {
                    sourceMap[photo.id] = isFromCache ? 'cache' : 'server';
                });
                setPhotoSource(sourceMap);
            }
        };
        loadServerPhotos();
    }, [photos]);

    // Compare photos whenever local or server photos change
    const photoComparison = useMemo(() => {
        return groupPhotosByMonth(photos, serverPhotos);
    }, [photos, serverPhotos]);

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

    const handleDownloadPhoto = async (photo: ServerPhoto) => {
        try {
            setDownloadingPhotos(prev => new Set([...prev, photo.id]));
            const asset = await downloadPhoto(photo);

            if (asset) {
                Alert.alert('Success', 'Photo downloaded successfully');
                // Refresh the gallery
                requestPermissionAndLoadPhotos();
            } else {
                Alert.alert('Error', 'Failed to download photo');
            }
        } catch (error) {
            console.error('Error downloading photo:', error);
            Alert.alert('Error', 'Failed to download photo');
        } finally {
            setDownloadingPhotos(prev => {
                const newSet = new Set(prev);
                newSet.delete(photo.id);
                return newSet;
            });
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const firstVisibleIndex = viewableItems[0].index || 0;
            // Only update visible photos for server photos
            const serverPhotos = photos.filter(photo => 'thumbnailUrl' in photo && 'url' in photo && 'uploadedAt' in photo) as ServerPhoto[];
            updateVisiblePhotos(serverPhotos, firstVisibleIndex);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const renderMonthSection = ({ item }: { item: PhotoGroup }) => {
        const photoIds = item.photos.map((photo) => photo.id);
        const allSelected = areAllMonthPhotosSelected(photoIds);

        return (
            <View className="mb-4">
                <Text className="text-lg font-semibold mb-2 px-2">
                    {item.month} {item.year}
                </Text>
                <FlatList
                    data={item.photos}
                    keyExtractor={(photo) => photo.id}
                    numColumns={3}
                    scrollEnabled={false}
                    renderItem={({ item: photo }) => {
                        const isServerPhoto = 'thumbnailUrl' in photo;
                        const serverPhoto = isServerPhoto ? (photo as unknown as ServerPhoto) : null;
                        const localPhoto = !isServerPhoto ? (photo as MediaLibrary.Asset) : null;

                        return (
                            <View className="w-1/3 aspect-square p-0.5">
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isServerPhoto && serverPhoto) {
                                            setSelectedServerPhoto(serverPhoto);
                                            setSelectedPhotoSource(photoSource[serverPhoto.id] || 'server');
                                            console.log(`Opening server photo ${serverPhoto.id} from ${photoSource[serverPhoto.id] || 'unknown'} source`);
                                        } else if (isSelecting && localPhoto) {
                                            togglePhotoSelection(localPhoto.id);
                                        } else if (localPhoto) {
                                            setSelectedLocalPhoto(localPhoto);
                                            setSelectedPhotoSource('local');
                                            console.log('Opening local photo from device');
                                        }
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: isServerPhoto && serverPhoto?.thumbnailUrl ? serverPhoto.thumbnailUrl : localPhoto?.uri || '' }}
                                        style={{ width: '100%', height: '100%', opacity: selectedPhotos.includes(photo.id) ? 0.5 : 1 }}
                                        contentFit="cover"
                                    />
                                    {!isServerPhoto && localPhoto && (
                                        uploadedPhotos.has(localPhoto.id) ? (
                                            <View className="absolute bottom-1 right-1">
                                                <MaterialCommunityIcons
                                                    name="check-circle"
                                                    size={24}
                                                    color="#2678FF"
                                                />
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                className="absolute bottom-1 right-1"
                                                onPress={async () => {
                                                    try {
                                                        const response = await handleUploadPhoto(
                                                            localPhoto.uri,
                                                            localPhoto.id,
                                                            setUploadingPhotos,
                                                            setUploadedPhotos
                                                        );

                                                        if (!response.success) {
                                                            Alert.alert('Error', response.msg || 'Failed to upload photo. Please try again.');
                                                        }
                                                    } catch (error) {
                                                        console.error('Error uploading photo:', error);
                                                        Alert.alert('Error', 'Failed to upload photo. Please check your network connection and try again.');
                                                    }
                                                }}
                                                disabled={uploadingPhotos.has(localPhoto.id)}
                                            >
                                                {uploadingPhotos.has(localPhoto.id) ? (
                                                    <ActivityIndicator size="small" color="#2678FF" />
                                                ) : (
                                                    <MaterialCommunityIcons
                                                        name="progress-upload"
                                                        size={24}
                                                        color="black"
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        )
                                    )}
                                    {isServerPhoto && serverPhoto && (
                                        <TouchableOpacity
                                            className="absolute bottom-1 right-1"
                                            onPress={() => handleDownloadPhoto(serverPhoto)}
                                            disabled={downloadingPhotos.has(serverPhoto.id)}
                                        >
                                            <MaterialIcons
                                                name="downloading"
                                                size={24}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    )}
                                    {isSelecting && !isServerPhoto && localPhoto && (
                                        <View className="absolute top-1 right-1 rounded-md p-1">
                                            {isPhotoSelected(localPhoto.id) ? (
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
                        );
                    }}
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
        <SafeAreaView className="flex-1 bg-white">
            <CustomHeader
                centerContent={<Text className="text-lg font-semibold">Gallery</Text>}
                rightIcon={
                    <TouchableOpacity onPress={() => router.push('/(tabs)/(modals)/chatbot')}>
                        <Chatbot width={24} height={24} />
                    </TouchableOpacity>
                }
            />

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
                    ref={flatListRef}
                    data={photosByMonth}
                    keyExtractor={(item) => `${item.month}-${item.year}`}
                    renderItem={renderMonthSection}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
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

            {/* Full-size image modal for server photos */}
            <Modal
                visible={selectedServerPhoto !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedServerPhoto(null)}
            >
                <View className="flex-1 bg-black bg-opacity-90 justify-center items-center">
                    <TouchableOpacity
                        className="absolute top-4 right-4 z-10"
                        onPress={() => setSelectedServerPhoto(null)}
                    >
                        <MaterialIcons name="close" size={28} color="white" />
                    </TouchableOpacity>
                    {selectedServerPhoto && (
                        <Image
                            source={{ uri: selectedServerPhoto.url }}
                            style={{ width: '100%', height: '75%' }}
                            contentFit="contain"
                        />
                    )}
                </View>
            </Modal>

            {/* Full-screen photo view for local photos */}
            <FullScreenPhotoView
                photo={selectedLocalPhoto || selectedServerPhoto}
                visible={selectedLocalPhoto !== null || selectedServerPhoto !== null}
                onClose={() => {
                    setSelectedLocalPhoto(null);
                    setSelectedServerPhoto(null);
                }}
                onPhotoDeleted={requestPermissionAndLoadPhotos}
                source={selectedPhotoSource}
            />
        </SafeAreaView>
    );
}
