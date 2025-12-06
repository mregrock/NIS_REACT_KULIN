import React, { memo, useRef, useEffect } from 'react';
import type { Pet } from './types';
import { usePetLifecycle } from '../../hooks/usePetLifecycle';
import { ActionButton } from '../PetActions/ActionButton.styled';
import styles from './PetCard.module.scss';

interface PetCardProps {
  petData: Pet;
}

const PetCard: React.FC<PetCardProps> = memo(({ petData }) => {
  const { pet, feed, levelUp, cheer, reset } = usePetLifecycle(petData);
  const avatarRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.style.filter = pet.mood === 'sad' ? 'grayscale(100%)' : 'none';
    }
  }, [pet.mood]);

  const isDead = pet.energy === 0;

  return (
    <div className={styles.card} style={{ boxShadow: pet.mood === 'happy' ? '0 4px 12px rgba(255, 215, 0, 0.4)' : undefined }}>
      <img 
        ref={avatarRef}
        src={pet.avatar} 
        alt={pet.name} 
        className={styles.avatar}
      />
      
      <div className={styles.info}>
        <h3>{pet.name}</h3>
        <p>{pet.species} • Lvl {pet.level}</p>
        <p>Mood: {pet.mood}</p>
      </div>

      <div className={styles.stats}>
        <div>
          <span>{pet.energy}%</span>
          <small>Energy</small>
        </div>
      </div>

      <div className={styles.actions}>
        <ActionButton onClick={feed} disabled={isDead}>Feed</ActionButton>
        <ActionButton onClick={cheer} disabled={isDead}>Cheer</ActionButton>
        <ActionButton onClick={levelUp} disabled={isDead}>Level Up</ActionButton>
        <ActionButton onClick={reset}>Reset</ActionButton>
      </div>
    </div>
  );
});

export default PetCard;
