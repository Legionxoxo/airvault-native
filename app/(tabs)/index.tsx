import Collection from '@/assets/icons/collection.svg'
import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    useFonts
} from '@expo-google-fonts/roboto'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

const Index = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_600SemiBold,
        Roboto_700Bold,
    })

    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#000" />
                <Text className="text-sm mt-2">Loading fonts...</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-roboto">Roboto 400</Text>
            <Text style={{ fontFamily: 'Roboto_500Medium' }} className="text-lg">Roboto 500</Text>
            <Text style={{ fontFamily: 'Roboto_600SemiBold' }} className="text-lg">Roboto 600</Text>
            <Text style={{ fontFamily: 'Roboto_700Bold' }} className="text-lg">Roboto 700</Text>
            <Collection />
        </View>
    )
}

export default Index
