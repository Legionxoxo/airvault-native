import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';


const SearchHeader = () => {


    return (
        <View className='flex-row items-center bg-white px-4 py-3'>
            {/* Back Button */}
            < TouchableOpacity onPress={() => { }} className='mr-2' >
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity >

            {/* Search Box */}
            < View className='flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 h-10' >
                <Ionicons name="search" size={18} color="#9CA3AF" className='mr-2' />

                <TextInput
                    placeholder="Search photos..."
                    placeholderTextColor="#9CA3AF"
                    className='flex-1 text-base text-gray-900'
                />
                <Ionicons name="mic-outline" size={18} color="#9CA3AF" className=' ml-2' />
            </View >
        </View >
    );
};

export default SearchHeader;
