import React, { useMemo } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { groupPhotosByMonth, PhotoGroup } from '../utils/groupPhotosByMonth';

const { width } = Dimensions.get('window');
const numColumns = 3;
const tileSize = width / numColumns;

export default function Gallery() {
    const {
        permissionStatus,
        photos,
        loading,
        requestPermissionAndLoadPhotos,
        loadMorePhotos,
    } = useMediaLibrary();

    const photoSections = useMemo(() => groupPhotosByMonth(photos), [photos]);

    const renderSectionHeader = ({ item }: { item: PhotoGroup }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{`${item.month} ${item.year}`}</Text>
        </View>
    );

    const renderItem = ({ item }: { item: PhotoGroup }) => {
        return (
            <View>
                {renderSectionHeader({ item })}
                <FlatList
                    data={item.photos}
                    renderItem={({ item: photo }) => (
                        <View style={styles.photoContainer}>
                            <Image
                                source={{ uri: photo.uri }}
                                style={styles.photo}
                                onError={(error) => console.error('[Gallery] Error loading image:', error.nativeEvent.error)}
                            />
                        </View>
                    )}
                    keyExtractor={(photo) => photo.id}
                    numColumns={numColumns}
                    scrollEnabled={false}
                />
            </View>
        );
    };

    if (loading && photos.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading photos...</Text>
            </View>
        );
    }

    if (permissionStatus !== 'granted') {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>No access to media library</Text>
                <Text style={styles.button} onPress={requestPermissionAndLoadPhotos}>
                    Request Permission
                </Text>
            </View>
        );
    }

    if (photoSections.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No photos found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={photoSections}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.month}-${item.year}`}
                onEndReached={() => {
                    if (photos.length > 0) {
                        const lastPhoto = photos[photos.length - 1];
                        loadMorePhotos(lastPhoto.id);
                    }
                }}
                onEndReachedThreshold={0.5}
            />
            {loading && photos.length > 0 && (
                <View style={styles.loadingMore}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text style={styles.loadingMoreText}>Loading more...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    photoContainer: {
        width: tileSize,
        height: tileSize,
        padding: 1,
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    sectionHeader: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    button: {
        color: '#007AFF',
        fontSize: 16,
        padding: 10,
    },
    loadingMore: {
        padding: 10,
        alignItems: 'center',
    },
    loadingMoreText: {
        marginTop: 5,
        fontSize: 14,
        color: '#666',
    },
}); 