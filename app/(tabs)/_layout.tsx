import Backarrow from '@/assets/icons/backarrow.svg';
import Chatbot from '@/assets/icons/chatbot.svg';
import Collection from '@/assets/icons/collection.svg';
import Logo from "@/assets/icons/logo.svg";
import Photo from "@/assets/icons/photo.svg";
import Plus from '@/assets/icons/plus.svg';
import Profile from '@/assets/icons/profile.svg';
import Search from '@/assets/icons/search.svg';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomHeader = ({ leftIcon, rightIcon, centerContent }: {
    leftIcon?: React.ReactNode,
    rightIcon?: React.ReactNode,
    centerContent?: React.ReactNode,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView
            style={{
                paddingTop: insets.top,
                backgroundColor: 'white',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#E5E7EB',
            }}
        >
            <View className="flex-row items-center px-4 bg-white" style={{ height: 56, justifyContent: 'space-between' }}>
                {/* Left */}
                <View className="mr-2">
                    {leftIcon}
                </View>

                {/* Center */}
                <View className="flex-1">
                    {centerContent}
                </View>

                {/* Right */}
                <View className="ml-2">
                    {rightIcon}
                </View>
            </View>
        </SafeAreaView>
    );
};

const _layout = () => {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle: {
                    height: 104,
                },
                headerTitleStyle: {
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 20,
                    color: '#000',
                },
            }}
        >

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Photos',
                    headerShown: true,
                    header: () => (
                        <CustomHeader
                            leftIcon={<Logo />}
                            rightIcon={
                                <TouchableOpacity onPress={() => router.push('/(tabs)/chatbot')}>
                                    <Chatbot />
                                </TouchableOpacity>
                            }
                            centerContent={<Text className="text-lg font-medium text-black text-center"></Text>}
                        />
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Photo width={24} height={24} fill={focused ? '#2678FF' : '#6B7280'} />
                    ),
                }}
            />

            <Tabs.Screen
                name="collection"
                options={{
                    title: 'Collections',
                    headerShown: true,
                    header: () => (
                        <CustomHeader
                            centerContent={<Text className="text-[20px] font-medium text-dark-100">Collections</Text>}
                            rightIcon={
                                <TouchableOpacity onPress={() => console.log('Add Collection')}>
                                    <Plus />
                                </TouchableOpacity>
                            }
                        />
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Collection width={24} height={24} fill={focused ? '#2678FF' : '#6B7280'} />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: true,
                    header: () => (
                        <CustomHeader
                            leftIcon={<Backarrow />}
                            centerContent={
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-10">
                                    <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                                    <TextInput
                                        placeholder="Search photos..."
                                        placeholderTextColor="#9CA3AF"
                                        className="flex-1 text-base text-gray-900"
                                    />
                                    <Ionicons name="mic-outline" size={18} color="#9CA3AF" style={{ marginLeft: 8 }} />
                                </View>
                            }
                        />
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Search width={24} height={24} fill={focused ? '#2678FF' : '#6B7280'} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: true,
                    header: () => (
                        <CustomHeader
                            centerContent={<Text className="text-[20px] font-medium text-dark-100">Profile</Text>}
                        />
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Profile width={24} height={24} fill={focused ? '#2678FF' : '#6B7280'} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default _layout;
