import BackArrow from '@/assets/icons/backarrow.svg';
import Logo from '@/assets/icons/logo.svg';
import Mycloud from '@/assets/icons/mycloud.svg';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function EmailVerification() {
    const router = useRouter();
    const { device } = useLocalSearchParams();
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        router.replace('/(tabs)');
    };

    const handleBack = () => {
        router.replace('/auth/device-selection');
    };

    // Mapping device ID to full display name
    const deviceMap: Record<string, string> = {
        mycloud: 'MyCloud Home',
        synology: 'Synology DS220+',
        qnap: 'QNAP TS-251D',
    };

    const deviceId = typeof device === 'string' ? device : '';
    const deviceName = deviceId && deviceMap[deviceId] ? deviceMap[deviceId] : deviceId;

    return (
        <>
            <Stack.Screen
                options={{
                    title: '',
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity className=" flex-row items-center gap-3">
                            <TouchableOpacity onPress={handleBack} hitSlop={16}>
                                <BackArrow />
                            </TouchableOpacity>
                            <Logo />
                        </TouchableOpacity>
                    ),
                }}
            />
            <View className="flex-1 bg-gray-50">
                {/* Content */}
                <View className="flex-1  px-6">
                    <View className='mt-10 flex items-center justify-center '>
                        <View className="rounded-full bg-[#4F46E51A] p-6 mb-6 ">
                            <Mycloud fill='#2678FF' height={28} width={28} />
                        </View>
                    </View>


                    <Text className="text-2xl font-bold font-roboto text-center mb-2">
                        Connected to {deviceName || 'your device'}
                    </Text>

                    <Text className="text-sm text-light-100 text-center mb-6 font-roboto">
                        Sign in to access your photos stored on this device
                    </Text>

                    {/* Google Button */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center border border-gray-200 rounded-lg py-3 mb-3 w-full"
                        style={{ maxWidth: 400 }}
                        onPress={handleSubmit}
                    >
                        <Ionicons name="logo-google" size={22} color="#4285F4" style={{ marginRight: 8 }} />
                        <Text className="text-base font-medium">Continue with Google</Text>
                    </TouchableOpacity>

                    {/* Apple Button */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-black rounded-lg py-3 w-full"
                        style={{ maxWidth: 400 }}
                        onPress={handleSubmit}
                    >
                        <Ionicons name="logo-apple" size={22} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-base font-medium text-white">Continue with Apple</Text>
                    </TouchableOpacity>

                    {/* Terms */}
                    <Text className="text-xs text-gray-400 text-center mt-8">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </View>
        </>

    );
}
