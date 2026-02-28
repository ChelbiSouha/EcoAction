import { useQuery } from '@tanstack/react-query';
import { MissionService } from '../../../services/missions';
import { MissionCategory } from '../../../types';

export const useMissions = (category?: MissionCategory, search?: string) => {
  return useQuery({
    queryKey: ['missions', { category, search }],
    queryFn: () => MissionService.getAll(category, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMissionDetails = (id: string) => {
  return useQuery({
    queryKey: ['mission', id],
    queryFn: () => MissionService.getById(id),
    enabled: !!id,
  });
};
