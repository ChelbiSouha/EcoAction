import { apiClient } from '../api/client';
import { Participation, User } from '../types';

export const ParticipationService = {
  // Get participations for a user
  getByUser: async (userId: string): Promise<Participation[]> => {
    const response = await apiClient.get<Participation[]>(`/participations?userId=${userId}`);
    return response.data;
  },

  // Get participations for a mission
  getByMission: async (missionId: string): Promise<Participation[]> => {
    const response = await apiClient.get<Participation[]>(`/participations?missionId=${missionId}`);
    return response.data;
  },

  // Register for a mission
  register: async (userId: string, missionId: string): Promise<Participation> => {
    // 1. Check if already registered
    const existing = await apiClient.get<Participation[]>(`/participations?userId=${userId}&missionId=${missionId}`);
    if (existing.data.length > 0) {
      throw new Error('User already registered for this mission');
    }

    // 2. Create participation
    const participation: Omit<Participation, 'id'> = {
      userId,
      missionId,
      status: 'registered',
      registeredAt: new Date().toISOString(),
    };
    
    const response = await apiClient.post<Participation>('/participations', participation);
    
    // 3. Update user stats (optional for strict backend, but good for MVP simulation)
    // We would ideally use a transaction or backend logic here.
    // For now, we will rely on client-side state updates or separate calls if needed.
    
    return response.data;
  },

  // Cancel participation
  cancel: async (participationId: string): Promise<void> => {
    await apiClient.delete(`/participations/${participationId}`);
  },
};
