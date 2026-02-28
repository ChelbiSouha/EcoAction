import React from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMissionDetails } from '../../features/missions/hooks/useMissions';
import { useParticipations, useRegisterMission, useCancelParticipation } from '../../features/participations/hooks/useParticipation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Calendar, MapPin, Users, Tag } from 'lucide-react-native';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MissionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const { data: mission, isLoading: isLoadingMission } = useMissionDetails(id);
  const { data: participations, isLoading: isLoadingParticipations } = useParticipations(id);

  const registerMutation = useRegisterMission();
  const cancelMutation = useCancelParticipation();

  if (isLoadingMission || isLoadingParticipations) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!mission) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">Mission not found</Text>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const activeParticipants = participations?.filter(p => p.status === 'registered').length || 0;
  const remainingSpots = mission.maxSpots - activeParticipants;
  const userParticipation = participations?.find(p => p.userId === user?.id && p.status === 'registered');
  const isRegistered = !!userParticipation;

  const handleRegister = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to register for this mission.');
      return;
    }
    registerMutation.mutate(mission.id);
  };

  const handleCancel = () => {
    if (userParticipation) {
      cancelMutation.mutate(userParticipation.id);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView>
        <Image source={{ uri: mission.image }} className="w-full h-64 bg-gray-200" resizeMode="cover" />

        <View className="p-5">
          <View className="flex-row items-center mb-2">
            <View className="bg-primary/10 px-3 py-1 rounded-full mr-2">
              <Text className="text-primary font-bold text-xs uppercase">{mission.category}</Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-600 font-medium text-xs">{mission.difficulty}</Text>
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-4">{mission.title}</Text>

          <View className="space-y-4 mb-6">
            <View className="flex-row items-center">
              <Calendar size={20} color="#6b7280" />
              <Text className="ml-3 text-base text-gray-700">
                {format(new Date(mission.date), 'EEEE, MMMM d, yyyy • h:mm a')}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={20} color="#6b7280" />
              <Text className="ml-3 text-base text-gray-700">
                {typeof mission.location === 'string' ? mission.location : mission.location?.name || 'Unknown Location'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Users size={20} color="#6b7280" />
              <Text className="ml-3 text-base text-gray-700">
                {activeParticipants} / {mission.maxSpots} participants ({remainingSpots} spots left)
              </Text>
            </View>
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-2">About this mission</Text>
          <Text className="text-gray-600 text-base leading-6 mb-8">{mission.description}</Text>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-100 bg-white">
        {isRegistered ? (
          <Button
            title="Cancel Registration"
            onPress={handleCancel}
            variant="danger"
            loading={cancelMutation.isPending}
          />
        ) : (
          <Button
            title={remainingSpots > 0 ? "Join Mission" : "Mission Full"}
            onPress={handleRegister}
            disabled={remainingSpots <= 0}
            loading={registerMutation.isPending}
            variant="primary"
          />
        )}
      </View>
    </SafeAreaView>
  );
}
