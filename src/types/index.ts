export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  totalMissionsCompleted: number;
  activeMissionsCount: number;
}

export type MissionCategory = 'Cleanup' | 'Education' | 'Planting' | 'Recycling' | 'Other';
export type MissionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Location {
  name: string;
  city?: string;
  state?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  tags?: string[];
  date: string; // ISO Date string
  location: Location | string;
  organizerId?: string;
  maxSpots: number;
  currentParticipants?: number;
  difficulty: MissionDifficulty;
  status?: 'open' | 'almost_full' | 'closed';
  createdAt?: string;
  image: string;
}

export type ParticipationStatus = 'registered' | 'cancelled' | 'completed';

export interface Participation {
  id: string;
  userId: string;
  missionId: string;
  status: ParticipationStatus;
  registeredAt: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
