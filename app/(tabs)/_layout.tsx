import Collection from '@/assets/icons/collection.svg';
import Photo from "@/assets/icons/photo.svg";
import Profile from '@/assets/icons/profile.svg';
import Search from '@/assets/icons/search.svg';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
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
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Photo width={24} height={24} fill={focused ? '#2678FF' : '#6B7280'} />
                    ),
                }}
            />

            <Tabs.Screen
                name="collection"
                options={{
                    title: 'Collections',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Collection width={24} height={24} fill={focused ? '#2678FF' : '#6B7280'} />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Search width={24} height={24} fill={focused ? '#2678FF' : '#6B7280'} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Profile width={24} height={24} fill={focused ? '#2678FF' : '#6B7280'} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default _layout;
