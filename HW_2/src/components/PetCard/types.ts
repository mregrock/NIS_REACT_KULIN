export type Mood = 'happy' | 'neutral' | 'sad';

export interface Pet {
  id: string;
  name: string;
  species: string;
  mood: Mood;
  energy: number;
  level: number;
  avatar: string;
}

export type PetActionType = 
  | { type: 'FEED' }
  | { type: 'LEVEL_UP' }
  | { type: 'CHEER' }
  | { type: 'RESET'; payload: Pet }
  | { type: 'TICK' };

export interface PetState extends Pet {}