import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserParticipations } from '../../features/participations/hooks/useParticipation';
import { useMissions } from '../../features/missions/hooks/useMissions';
import { MissionCard } from '../../components/MissionCard';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { data: participations, isLoading: isLoadingParticipations } = useUserParticipations(user?.id || '');
  const { data: allMissions } = useMissions(); // Fetch all to filter by participation
  
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg mb-4">Please login to view profile</Text>
        <Button title="Login" onPress={() => signOut()} />
      </View>
    );
  }

  const activeParticipations = participations?.filter(p => p.status === 'registered') || [];
  const completedParticipations = participations?.filter(p => p.status === 'completed') || [];
  
  // Filter missions that user is participating in
  const activeMissions = allMissions?.filter(m => 
    activeParticipations.some(p => p.missionId === m.id)
  ) || [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-white p-6 items-center shadow-sm mb-6">
          <Image
            source={{ uri: user.avatar || 'https://i.pravatar.cc/150' }}
            className="w-24 h-24 rounded-full mb-4 bg-gray-200"
          />
          <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
          <Text className="text-gray-500 mb-2">{user.email}</Text>
          <Text className="text-gray-600 text-center px-4 mb-4">{user.bio}</Text>
          
          <View className="flex-row justify-around w-full mt-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">{activeParticipations.length}</Text>
              <Text className="text-xs text-gray-500 uppercase tracking-wide">Active</Text>
            </View>
            <View className="w-[1px] bg-gray-200 h-full" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">{user.totalMissionsCompleted}</Text>
              <Text className="text-xs text-gray-500 uppercase tracking-wide">Completed</Text>
            </View>
          </View>
        </View>

        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Active Missions</Text>
          {isLoadingParticipations ? (
            <ActivityIndicator color="#16a34a" />
          ) : activeMissions.length > 0 ? (
            activeMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))
          ) : (
            <View className="bg-white p-6 rounded-xl items-center border border-gray-100 border-dashed">
              <Text className="text-gray-500 text-center">No active missions. Join one!</Text>
            </View>
          )}
        </View>

        <View className="px-4">
          <Button 
            title="Log Out" 
            onPress={signOut} 
            variant="outline" 
            className="mt-4 border-red-500 text-red-500" 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
