import React, { useState } from 'react';
import { View, FlatList, TextInput, ActivityIndicator, Text, TouchableOpacity, Image } from 'react-native';
import { useMissions } from '@/features/missions/hooks/useMissions';
import { MissionCard } from '@/components/MissionCard';
import { MissionCategory } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Leaf } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';

const CATEGORIES: MissionCategory[] = ['Cleanup', 'Education', 'Planting', 'Recycling', 'Other'];

export default function MissionsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | undefined>(undefined);

  const { data: missions, isLoading, error } = useMissions(selectedCategory, search);
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-sand">
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-danger text-lg mb-2">Error loading missions</Text>
        <Text className="text-gray-600 text-center mb-4">{error.message}</Text>
        <TouchableOpacity
          onPress={() => queryClient.invalidateQueries({ queryKey: ['missions'] })}
          className="bg-primary px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-sand" edges={['top']}>
      <View className="px-5 pt-3 pb-4 bg-white shadow-xl shadow-black/5 z-10 rounded-b-3xl mb-2">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-extrabold text-forest">Explore Missions</Text>
        </View>
        <View className="flex-row items-center bg-sand/40 border border-sand/50 rounded-2xl px-4 py-3 mb-5">
          <Search size={20} color="#8D6E63" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="Search missions..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...CATEGORIES]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item === 'All' ? undefined : item as MissionCategory)}
              className={`px-5 py-2.5 rounded-full mr-3 border ${(item === 'All' && !selectedCategory) || item === selectedCategory
                  ? 'bg-forest border-forest'
                  : 'bg-white border-sand'
                }`}
            >
              <Text className={`text-sm font-bold tracking-wide ${(item === 'All' && !selectedCategory) || item === selectedCategory
                  ? 'text-white'
                  : 'text-earth'
                }`}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 pb-4">
            <MissionCard mission={item} />
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20 px-8">
            <View className="bg-leaf/20 p-6 rounded-full mb-6">
              <Leaf size={48} color="#66BB6A" />
            </View>
            <Text className="text-xl font-bold text-earth text-center mb-2">
              No missions found
            </Text>
            <Text className="text-gray-500 text-center">
              Try adjusting your filters or search terms to discover more opportunities to help the environment.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
