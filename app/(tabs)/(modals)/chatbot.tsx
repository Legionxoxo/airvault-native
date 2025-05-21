
const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
    }
});
import Backarrow from '@/assets/icons/backarrow.svg';
import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';


export default function Chatbot() {
    const router = useRouter();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const [bottomPadding, setBottomPadding] = useState(0);

    const messages = [
        { type: 'assistant', text: "Hi there! I'm your photo assistant. How can I help you find your photos today?" },
        { type: 'user', text: 'Show me beach photos from last summer' },
        { type: 'assistant', text: 'I found 12 beach photos from summer 2024. Here are some of them:' },
    ];

    const suggestions = [
        'See all beach photos',
        'Create beach album',
        'Show me beach photos with people',
    ];

    const photos = [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=60',
    ];

    const [input, setInput] = useState('');

    // Set up keyboard listeners
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardVisible(true);
                // Get keyboard height from event
                const keyboardHeight = e.endCoordinates.height;
                setKeyboardHeight(keyboardHeight);
                setBottomPadding(keyboardHeight);

                // Scroll to bottom when keyboard appears
                if (scrollViewRef.current) {
                    setTimeout(() => {
                        if (scrollViewRef.current) {
                            scrollViewRef.current.scrollToEnd({ animated: true });
                        }

                    }, 50);
                }
            }
        );

        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                setBottomPadding(0);
            }
        );

        // Cleanup
        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    const handleSend = () => {
        if (input.trim() === '') return;

        console.log('User message:', input);
        setInput('');

        // Scroll to bottom after sending a message
        if (scrollViewRef.current) {
            setTimeout(() => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true });
                }
            }, 100);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Photo Assistant',
                    headerShown: true,
                    tabBarItemStyle: { display: 'none' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="pl-3">
                            <Backarrow />
                        </TouchableOpacity>
                    ),
                }}
            />
            <View className='bg-gray-50 flex-1'>
                <ScrollView
                    ref={scrollViewRef}
                    className="p-4 flex-1"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: bottomPadding + 90 }}
                >
                    {messages.map((msg, idx) => (
                        <View
                            key={idx}
                            className={`
                                ${msg.type === 'assistant' ? 'bg-gray-200 self-start' : 'bg-blue-200 self-end'}
                                p-3 rounded-2xl mb-2 max-w-[100%]
                            `}
                        >
                            <Text className="text-sm font-roboto font-medium">{msg.text}</Text>
                        </View>
                    ))}

                    <FlatList
                        data={photos}
                        keyExtractor={(_, idx) => idx.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-3"
                        contentContainerStyle={{ gap: 12 }}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                className="w-[100px] h-[100px] rounded-xl"
                            />
                        )}
                    />

                    <View className="bg-gray-200 p-3 rounded-2xl self-start">
                        <Text className="text-sm font-roboto font-medium">{suggestions.join(', ')}</Text>
                    </View>

                    <FlatList
                        data={suggestions}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-4"
                        contentContainerStyle={{ gap: 12 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity className="bg-indigo-100 py-2 px-4 rounded-xl">
                                <Text className="text-blue-600 font-medium font-roboto-500">{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </ScrollView>

                {/* Chat Input Bar - Fixed at bottom */}
                <View
                    style={[
                        styles.inputContainer,
                        { bottom: keyboardVisible ? keyboardHeight - 60 : 0 }
                    ]}
                >
                    <TextInput
                        placeholder="Ask about your photos..."
                        placeholderTextColor="#6B7280"
                        value={input}
                        onChangeText={setInput}
                        onFocus={() => {
                            if (scrollViewRef.current) {
                                setTimeout(() => {
                                    if (scrollViewRef.current) {
                                        scrollViewRef.current.scrollToEnd({ animated: true });
                                    }

                                }, 100);
                            }
                        }}
                        className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-sm text-dark-100 font-roboto"
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={input.trim() === ''}
                        className={`mx-2 ${input.trim() === '' ? 'bg-gray-400' : 'bg-primary'} w-12 h-12 rounded-full flex items-center justify-center`}
                    >
                        <FontAwesome name="send" size={20} color="white" className="pr-1" />
                    </TouchableOpacity>
                </View>
            </View>
        </>




    );
}