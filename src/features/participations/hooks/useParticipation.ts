import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ParticipationService } from '../../../services/participations';
import { useAuth } from '../../../context/AuthContext';
import { Participation } from '../../../types';

export const useParticipations = (missionId: string) => {
  return useQuery({
    queryKey: ['participations', { missionId }],
    queryFn: () => ParticipationService.getByMission(missionId),
    enabled: !!missionId,
  });
};

export const useUserParticipations = (userId: string) => {
  return useQuery({
    queryKey: ['participations', { userId }],
    queryFn: () => ParticipationService.getByUser(userId),
    enabled: !!userId,
  });
};

export const useRegisterMission = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (missionId: string) => {
      if (!user) throw new Error('User not logged in');
      return ParticipationService.register(user.id, missionId);
    },
    onMutate: async (missionId) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['participations', { missionId }] });
      const previousParticipations = queryClient.getQueryData<Participation[]>(['participations', { missionId }]);

      if (previousParticipations && user) {
        queryClient.setQueryData<Participation[]>(['participations', { missionId }], [
          ...previousParticipations,
          {
            id: 'temp-id',
            userId: user.id,
            missionId,
            status: 'registered',
            registeredAt: new Date().toISOString(),
          },
        ]);
      }

      return { previousParticipations };
    },
    onError: (err, missionId, context) => {
      if (context?.previousParticipations) {
        queryClient.setQueryData(['participations', { missionId }], context.previousParticipations);
      }
      console.error('Registration failed:', err);
    },
    onSettled: (_, __, missionId) => {
      queryClient.invalidateQueries({ queryKey: ['participations', { missionId }] });
      queryClient.invalidateQueries({ queryKey: ['participations', { userId: user?.id }] });
    },
  });
};

export const useCancelParticipation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (participationId: string) => ParticipationService.cancel(participationId),
    onSuccess: (_, participationId) => {
      // Find the mission ID associated with this participation if possible, or invalidate all
      // Here we invalidate broadly or optimistically update if we had context
      queryClient.invalidateQueries({ queryKey: ['participations'] });
    },
  });
};
