import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default CustomHeader; 