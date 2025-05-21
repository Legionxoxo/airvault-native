import Logo from '@/assets/icons/logo.svg';
import Mycloud from '@/assets/icons/mycloud.svg';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const nasDevices = [
    { id: 'mycloud', name: 'MyCloud Home', ip: '192.168.1.105' },
    { id: 'synology', name: 'Synology DS220+', ip: '192.168.1.110' },
    { id: 'qnap', name: 'QNAP TS-251D', ip: '192.168.1.115' },
];

export default function SelectNASDevice() {
    const [selectedId, setSelectedId] = useState<string | null>('mycloud');
    const router = useRouter();

    const handleContinue = (deviceId: string) => {
        router.push({
            pathname: '/auth/email-verification',
            params: { device: deviceId }
        });
    };

    return (
        <> <Stack.Screen
            options={{
                title: '',
                headerShown: true,
                headerLeft: () => (
                    <View className="pl-3 flex-row items-center gap-3">
                        <Logo />
                        <Text className='text-sm font-roboto text-light-100 mt-1'>
                            Connect to your photos
                        </Text>
                    </View>
                )

            }}
        />

            <View className="flex-1 bg-gray-50 px-4 pt-9">
                {/* Title */}
                <Text className="text-xl font-roboto-500 font-semibold mb-2">Select your device</Text>
                <Text className="text-light-100 mb-6 text-base">
                    Choose a NAS device on your network to access your photos.
                </Text>

                {/* Device List */}
                <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
                    {nasDevices.map((device) => (
                        <TouchableOpacity
                            key={device.id}
                            className={`flex-row items-center justify-between border rounded-xl p-4 mb-3 ${selectedId === device.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
                                }`}
                            onPress={() => setSelectedId(device.id)}
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-[#F3F4F6] justify-center items-center mr-3">
                                    <Mycloud fill='#6B7280' />
                                </View>
                                <View>
                                    <Text className="text-black font-semibold">{device.name}</Text>
                                    <Text className="text-gray-500">{device.ip} • Available</Text>
                                </View>
                            </View>
                            {selectedId === device.id && (
                                <Ionicons name="checkmark" size={24} color="#2563EB" />
                            )}
                        </TouchableOpacity>
                    ))}

                    {/* Scanning status */}
                    <View className="flex justify-center items-center flex-row gap-2 mt-5 ">
                        <ActivityIndicator size="small" color="#6B7280" />
                        <Text className="text-light-100">Scanning for devices...</Text>
                    </View>
                    <TouchableOpacity
                        className="bg-primary rounded-xl p-4 mb-6 mt-8"
                        onPress={() => selectedId && handleContinue(selectedId)}
                    >
                        <Text className="text-white text-lg text-center font-semibold">Continue</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

        </>

    );
}
