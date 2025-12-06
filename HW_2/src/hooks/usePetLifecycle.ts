import { useEffect, useReducer, useCallback } from 'react';
import type { Pet, PetState, PetActionType } from '../components/PetCard/types';
import { useEventLog } from './useEventLog';

const petReducer = (state: PetState, action: PetActionType): PetState => {
  switch (action.type) {
    case 'FEED':
      return {
        ...state,
        energy: Math.min(state.energy + 20, 100),
        mood: state.energy + 20 > 50 ? 'happy' : 'neutral',
      };
    case 'LEVEL_UP':
      return {
        ...state,
        level: state.level + 1,
      };
    case 'CHEER':
      return {
        ...state,
        mood: 'happy',
      };
    case 'RESET':
      return action.payload;
    case 'TICK':
      const newEnergy = Math.max(state.energy - 5, 0);
      let newMood = state.mood;
      if (newEnergy <= 20) newMood = 'sad';
      if (newEnergy === 0) newMood = 'sad';
      return {
        ...state,
        energy: newEnergy,
        mood: newMood,
      };
    default:
      return state;
  }
};

export const usePetLifecycle = (initialPet: Pet) => {
  const [pet, dispatch] = useReducer(petReducer, initialPet, (initial) => {
    const saved = localStorage.getItem(`pet-${initial.id}`);
    return saved ? JSON.parse(saved) : initial;
  });
  const { addLog } = useEventLog();

  useEffect(() => {
    localStorage.setItem(`pet-${pet.id}`, JSON.stringify(pet));
  }, [pet]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (pet.energy > 0) {
        dispatch({ type: 'TICK' });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [pet.energy]);

  const feed = useCallback(() => {
    dispatch({ type: 'FEED' });
    addLog(`${pet.name} was fed.`);
  }, [pet.name, addLog]);

  const levelUp = useCallback(() => {
    dispatch({ type: 'LEVEL_UP' });
    addLog(`${pet.name} leveled up!`);
  }, [pet.name, addLog]);

  const cheer = useCallback(() => {
    dispatch({ type: 'CHEER' });
    addLog(`${pet.name} is happy now!`);
  }, [pet.name, addLog]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET', payload: initialPet });
    addLog(`${pet.name} was reset.`);
  }, [initialPet, pet.name, addLog]);

  return { pet, feed, levelUp, cheer, reset };
};
