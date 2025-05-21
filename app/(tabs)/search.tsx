import { FontAwesome6 } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

const Search = () => {
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [filters, setFilters] = useState<string[]>([])
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // Simulated DB call
            await new Promise((res) => setTimeout(res, 1000))

            setRecentSearches(['Beach vacation', 'Birthday party', 'Hiking', 'wonderful'])
            setFilters(['Date: Last 30 days', 'Albums: All', 'Type: Photos', 'Year: Last year'])
            setSuggestions([
                'Show me beach photos',
                'Family gatherings',
                'Trip to mountains',
                'Diwali celebrations',
                'My dog pictures'
            ])

            setLoading(false)
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-600">Loading...</Text>
            </View>
        )
    }

    return (
        <ScrollView className="flex-1 bg-gray-50 px-4 pt-5">
            {/* Recent Searches */}
            <Text className="text-lg font-semibold mb-2 font-roboto-500">Recent Searches</Text>
            <View className="space-y-2 mb-6">
                {recentSearches.slice(0, 3).map((item, index) => (
                    <View
                        key={index}
                        className={`flex-row items-center pb-2 ${index !== recentSearches.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                        <FontAwesome6 name="clock-rotate-left" size={18} color="#9CA3AF" className='mt-2' />
                        <Text className="ml-1 text-base text-dark-100 font-roboto pt-4 pb-2 pl-2">
                            {item}
                        </Text>
                    </View>
                ))}
            </View>


            {/* Filters */}
            <Text className="text-lg font-semibold mb-2 font-roboto-500">Filters</Text>
            <View style={{ height: 50 }} className="mb-6">
                <FlatList
                    data={filters}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-4"
                    contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity className="bg-gray-100 py-2 px-4 rounded-xl">
                            <Text className="text-gray-700 text-sm font-roboto">{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>




            {/* Try Asking */}
            < Text className="text-lg font-semibold mb-1" > Try asking</Text>
            <View className="h-[50px] mb-8">
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-4"
                    contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity className="bg-indigo-100 py-2 px-3 rounded-xl">
                            <Text className="text-blue-600 font-medium">{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>



            <Text className="text-center text-gray-500">Type a search term or try voice search</Text>
        </ScrollView>
    )
}

export default Search
