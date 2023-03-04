export type Player = {
  id: string;
  name: string;
  country: string;
  classical: number;
  rapid: number;
  blitz: number;
  average: number;
  createdAt: number;
  updatedAt: number;
};

export type Ranking = {
  id: string;
  name: string;
  country: string;
  rating: string;
};

export type TimeClass = 'classical' | 'rapid' | 'blitz';
