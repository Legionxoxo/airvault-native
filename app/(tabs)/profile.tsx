import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
    return (
        <ScrollView className="flex-1 bg-gray-50">

            {/* Profile Info */}
            <View className="items-center py-10">
                <Image
                    source={require('@/assets/images/highlight.png')}
                    className="w-20 h-20 rounded-full mb-3"
                />
                <Text className="text-lg font-roboto-600 font-semibold mb-1">Emma Thompson</Text>
                <Text className="text-sm font-roboto text-light-100">emma.thompson@example.com</Text>
            </View>

            {/* Storage Section */}
            <View className="px-4 mb-4 bg-[#F3F4F6] py-3 mx-4 rounded-2xl">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-sm font-roboto text-dark-100">Storage Used</Text>
                    <Text className="text-sm text-dark-100 font-roboto font-medium">2.4 GB of 10 GB</Text>
                </View>
                <View className="h-2 rounded overflow-hidden">
                    <View className="flex-1 bg-gray-200 rounded">
                        <View className="h-full bg-blue-500 rounded w-1/4" />
                    </View>
                </View>
            </View>
            <View className="h-px w-full bg-gray-200 mb-2" />
            {/* Connected Device */}
            <View className="px-4 mb-6">
                <Text className="text-sm text-light-100 font-medium mb-3">Connected Device</Text>
                <View className="flex-row items-center p-4 bg-white rounded-xl">
                    <View className="w-10 h-10 rounded-full bg-[#F3F4F6] justify-center items-center mr-3">
                        <View className="w-6 h-6 bg-gray-400 rounded-full" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-medium font-roboto text-dark-100">MyCloud Home</Text>
                        <Text className="text-xs text-light-100">142.138.11.195 • Connected</Text>
                    </View>
                </View>
            </View>

            {/* Settings Section */}
            <View className="px-4 mb-6">
                <Text className="text-sm font-medium mb-2 text-light-100 font-roboto">Settings</Text>

                {/* Settings Items */}
                <View className='font-roboto bg-white rounded-[24px]'>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
                        <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center mr-3">
                            <View className="w-4 h-4 bg-gray-400 rounded" />
                        </View>
                        <Text className="flex-1 text-base">Account Settings</Text>
                        <Text className="text-xl text-gray-400 pr-2">›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
                        <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center mr-3">
                            <View className="w-4 h-4 bg-gray-400 rounded" />
                        </View>
                        <Text className="flex-1 text-base">Backup & Sync</Text>
                        <Text className="text-xl text-gray-400 pr-2">›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
                        <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center mr-3">
                            <View className="w-4 h-4 bg-gray-400 rounded" />
                        </View>
                        <Text className="flex-1 text-base">Appearance</Text>
                        <Text className="text-xl text-gray-400 pr-2">›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
                        <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center mr-3">
                            <View className="w-4 h-4 bg-gray-400 rounded" />
                        </View>
                        <Text className="flex-1 text-base">Notifications</Text>
                        <Text className="text-xl text-gray-400 pr-2">›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
                        <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center mr-3">
                            <View className="w-4 h-4 bg-gray-400 rounded" />
                        </View>
                        <Text className="flex-1 text-base">Privacy & Security</Text>
                        <Text className="text-xl text-gray-400 pr-2">›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-4 ">
                        <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center mr-3">
                            <View className="w-4 h-4 bg-gray-400 rounded" />
                        </View>
                        <Text className="flex-1 text-base">Help & Support</Text>
                        <Text className="text-xl text-gray-400 pr-2">›</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity className="mx-4 mb-8 bg-white border border-[#EF4444] rounded-lg py-4 items-center">
                <Text className="text-[#EF4444] text-base font-medium font-roboto">Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Profile;