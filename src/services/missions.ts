import { apiClient } from '../api/client';
import { Mission, MissionCategory } from '../types';

export const MissionService = {
  getAll: async (category?: MissionCategory, search?: string): Promise<Mission[]> => {
    let params: any = {};
    if (category) params.category = category;
    if (search) params.title_like = search; // JSON-Server syntax

    const response = await apiClient.get<Mission[]>('/missions', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Mission> => {
    const response = await apiClient.get<Mission>(`/missions/${id}`);
    return response.data;
  },
};
