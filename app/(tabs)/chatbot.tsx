import Backarrow from '@/assets/icons/backarrow.svg';
import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Chatbot() {
    const router = useRouter()
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Photo Assistant',
                    headerShown: true,
                    tabBarItemStyle: { display: 'none' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 10 }}>
                            <Backarrow />
                        </TouchableOpacity>
                    ),

                }}


            />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>This screen is hidden from tab bar</Text>
            </View>
        </>
    );
}
