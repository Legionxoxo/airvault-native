import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import './globals.css';

const CustomHeader = ({ leftIcon, rightIcon, centerContent }: {
  leftIcon?: React.ReactNode,
  rightIcon?: React.ReactNode,
  centerContent?: React.ReactNode,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
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
    </View>
  );
};

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen
          name="auth/device-selection"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/email-verification"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
