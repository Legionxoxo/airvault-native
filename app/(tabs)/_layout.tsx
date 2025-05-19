
import { icons } from '@/constants/icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'


const TabIcon = ({ focused, icon, title }: any) => {
    if (focused) {
        return (
            <>
                <Image source={icon} tintColor='#151312' className='size-5' />
                <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
            </>

        )
    }
    return (
        <View className='size-full justify-center items-center mt-4 rounded-full'>
            <Image source={icon} tintColor="#A8B5DB" className='size-5' />
        </View>
    )
}

const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle: {
                    height: 100
                }

            }}>
            <Tabs.Screen name='index'
                options={{
                    title: 'Photos', headerShown: true,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.photos}
                            title="Home"
                        />
                    )
                }} />

            <Tabs.Screen name='collection'
                options={{
                    title: 'Collection', headerShown: true,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.collection}
                            title="Home"
                        />
                    )
                }} />

            <Tabs.Screen name='search'
                options={{
                    title: 'Search', headerShown: true,
                }} />

            <Tabs.Screen name='profile'
                options={{
                    title: 'Profile', headerShown: true,

                }} />
        </Tabs>
    )
}

export default _layout

const styles = StyleSheet.create({})