import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    useFonts
} from '@expo-google-fonts/roboto'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import GalleryScreen from '../components/Gallery'

const Index = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_600SemiBold,
        Roboto_700Bold,
    })
    const router = useRouter()

    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#000" />
                <Text className="text-sm mt-2">Loading fonts...</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-black">
            <GalleryScreen />
        </View>
    )
}

export default Index
