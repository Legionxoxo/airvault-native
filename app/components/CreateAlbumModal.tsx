import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface CreateAlbumModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: () => void;
    albumName: string;
    setAlbumName: (name: string) => void;
    selectedPhotos: string[];
    photos: any[];
    togglePhotoSelection: (id: string) => void;
    creatingAlbum: boolean;
}

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
    visible,
    onClose,
    onCreate,
    albumName,
    setAlbumName,
    selectedPhotos,
    photos,
    togglePhotoSelection,
    creatingAlbum,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => { }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 20, width: 340 }}>
                        <Text className='font-roboto font-bold mb-4 text-2xl text-dark-100 m-4'>Create New Album</Text>
                        <View className='border-b border-gray-100' />
                        <Text style={{ fontWeight: '500' }} className='m-4 font-roboto font-medium'>Album Name</Text>
                        <TextInput
                            placeholder="Enter album name"
                            value={albumName}
                            onChangeText={setAlbumName}
                            placeholderTextColor="#6B7280"
                            className="border border-[#ddd] rounded-lg px-4 py-3 text-sm text-dark-100 font-roboto mx-4"
                        />
                        <Text className='font-roboto font-medium m-4'>Selected Photos</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-row mb-[18px] mx-4"
                        >
                            {selectedPhotos.map((id) => {
                                const photo = photos.find((p) => p.id === id);
                                if (!photo) return null;
                                return (
                                    <View key={id} className="mr-[10px] relative">
                                        <Image
                                            source={{ uri: photo.uri }}
                                            className="w-[70px] h-[70px] rounded-[12px]"
                                        />
                                        <TouchableOpacity
                                            onPress={() => togglePhotoSelection(id)}
                                            className="absolute top-[4px] right-[4px] bg-white rounded-[8px] p-[2px]"
                                        >
                                            <MaterialIcons name="close" size={16} color="#333" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>

                        <View className='border-b border-gray-100' />

                        <View className="flex-row justify-end space-x-3 items-center m-4">
                            <TouchableOpacity onPress={onClose} disabled={creatingAlbum}>
                                <Text className="text-lg text-gray-500 mr-4">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onCreate}
                                disabled={creatingAlbum || !albumName.trim() || selectedPhotos.length === 0}
                                className={`
                                    bg-primary rounded-lg px-6 py-2 
                                    ${creatingAlbum || !albumName.trim() || selectedPhotos.length === 0 ? 'opacity-50' : 'opacity-100'}
                                `}
                            >
                                <Text className="text-white text-lg">Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
);

export default CreateAlbumModal;
