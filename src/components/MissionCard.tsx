import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Mission } from '../types';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Users, Leaf, Droplets, Recycle, Trophy } from 'lucide-react-native';
import { format } from 'date-fns';

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const router = useRouter();

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'Planting': return <Leaf size={14} color="#2E7D32" />;
      case 'Cleanup': return <Droplets size={14} color="#4FC3F7" />;
      case 'Recycling': return <Recycle size={14} color="#66BB6A" />;
      default: return <Leaf size={14} color="#2E7D32" />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/mission/[id]', params: { id: mission.id } })}
      className="bg-white rounded-[20px] shadow-lg shadow-black/10 overflow-hidden mb-5 border border-sand"
    >
      <View className="relative">
        <Image
          source={{ uri: mission.image }}
          className="w-full h-48 object-cover"
          resizeMode="cover"
        />
        {/* Semi-transparent gradient-like overlay at the top if needed */}
        <View className="absolute inset-x-0 top-0 h-16 bg-black/20" />
      </View>
      <View className="p-5">
        <View className="flex-row justify-between items-start mb-3">
          <View className="bg-sand/50 px-3 py-1.5 rounded-full flex-row items-center border border-earth/10">
            {renderCategoryIcon(mission.category)}
            <Text className="text-xs font-bold text-forest uppercase tracking-widest ml-1.5 mt-0.5">
              {mission.category}
            </Text>
          </View>
          <View className={`px-2.5 py-1 rounded-md border ${mission.difficulty === 'Easy' ? 'bg-leaf/10 border-leaf' :
            mission.difficulty === 'Medium' ? 'bg-earth/10 border-earth' :
              'bg-orange-100 border-orange-500' // Hard
            }`}>
            <Text className={`text-xs font-bold ${mission.difficulty === 'Easy' ? 'text-forest' :
              mission.difficulty === 'Medium' ? 'text-earth' :
                'text-orange-600'
              }`}>
              {mission.difficulty}
            </Text>
          </View>
        </View>

        <Text className="text-xl font-extrabold text-gray-900 mb-3" numberOfLines={2}>
          {mission.title}
        </Text>

        <View className="space-y-4">
          <View className="flex-row items-center">
            <View className="bg-sand/30 p-2 rounded-full mr-3 border border-sand">
              <Calendar size={18} color="#8D6E63" />
            </View>
            <Text className="text-gray-600 text-sm font-medium">
              {format(new Date(mission.date), 'MMM d, yyyy • h:mm a')}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="bg-sand/30 p-2 rounded-full mr-3 border border-sand">
              <MapPin size={18} color="#8D6E63" />
            </View>
            <Text className="text-gray-600 text-sm font-medium flex-1" numberOfLines={1}>
              {typeof mission.location === 'string' ? mission.location : mission.location?.name || 'Unknown Location'}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="bg-sand/30 p-2 rounded-full mr-3 border border-sand">
              <Users size={18} color="#8D6E63" />
            </View>
            <Text className="text-gray-600 text-sm font-medium">
              {mission.maxSpots} spots total
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
