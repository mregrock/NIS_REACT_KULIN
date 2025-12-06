import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel, Skeleton, Box } from '@mui/material';
import PetCard from '../components/PetCard/PetCard';
import EventLog from '../components/EventLog/EventLog';
import type { Pet } from '../components/PetCard/types';
import petsData from '../data/pets.json';

const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSpecies, setFilterSpecies] = useState<string>('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPets(petsData as Pet[]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredPets = useMemo(() => {
    if (filterSpecies === 'All') return pets;
    return pets.filter(pet => pet.species === filterSpecies);
  }, [pets, filterSpecies]);

  const speciesList = useMemo(() => {
    const species = new Set(pets.map(pet => pet.species));
    return ['All', ...Array.from(species)];
  }, [pets]);

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Container className="container" sx={{ flexGrow: 1, mr: { md: '320px' }, pr: { md: 4 }, width: '100%' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 4, mb: 4, textAlign: 'center', color: '#1f1f1f', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: { xs: '2rem', md: '3rem' } }}>
          CyberZoo 2077 Dashboard
        </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Filter by Species</InputLabel>
          <Select
            value={filterSpecies}
            label="Filter by Species"
            onChange={(e) => setFilterSpecies(e.target.value)}
          >
            {speciesList.map(species => (
              <MenuItem key={species} value={species}>{species}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="grid">
          {loading ? (
            Array.from(new Array(5)).map((_, index) => (
              <Box key={index} sx={{ p: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            ))
          ) : (
            filteredPets.map(pet => (
              <PetCard key={pet.id} petData={pet} />
            ))
          )}
        </div>
      </Container>
      <EventLog />
    </Box>
  );
};

export default Dashboard;