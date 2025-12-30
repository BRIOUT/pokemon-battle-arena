import { useState, useEffect, useRef } from 'react';
import Pokedex from './Pokedex';
import './Pokegame.css';

function Pokegame({ player1Name, player2Name, onScoreUpdate }) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasUpdatedScore = useRef(false);

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  const fetchRandomPokemon = async () => {
    setLoading(true);
    setError(null);
    hasUpdatedScore.current = false; // Reset score update flag

    try {
      // Generate 8 unique random Pokemon IDs (1-151 for classic Gen 1)
      // You can change 151 to 898 for all Pokemon, or 1025 for the latest
      const maxPokemonId = 151;
      const pokemonIds = new Set();

      while (pokemonIds.size < 8) {
        pokemonIds.add(Math.floor(Math.random() * maxPokemonId) + 1);
      }

      // Fetch all 8 Pokemon in parallel
      const pokemonPromises = Array.from(pokemonIds).map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(res => res.json())
      );

      const pokemonData = await Promise.all(pokemonPromises);

      // Format the data to match our component structure
      const formattedPokemon = pokemonData.map(p => ({
        id: p.id,
        name: p.name,
        type: p.types[0].type.name, // Get primary type
        base_experience: p.base_experience || 100 // Fallback if null
      }));

      setPokemon(formattedPokemon);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Pokemon:', err);
      setError('Failed to load Pokemon. Please try again!');
      setLoading(false);
    }
  };

  // Split Pokemon into two hands
  const hand1 = pokemon.slice(0, 4);
  const hand2 = pokemon.slice(4, 8);

  // Calculate total experience
  const exp1 = hand1.reduce((acc, p) => acc + p.base_experience, 0);
  const exp2 = hand2.reduce((acc, p) => acc + p.base_experience, 0);

  // Determine winner and update score ONLY ONCE per battle
  useEffect(() => {
    if (pokemon.length === 8 && !hasUpdatedScore.current) {
      if (exp1 > exp2) {
        onScoreUpdate(1);
        hasUpdatedScore.current = true;
      } else if (exp2 > exp1) {
        onScoreUpdate(2);
        hasUpdatedScore.current = true;
      }
    }
  }, [pokemon]); // Only depend on pokemon array changing

  if (loading) {
    return (
      <div className="Pokegame-loading">
        <div className="Pokeball-loader"></div>
        <h2>Catching Pokemon...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Pokegame-error">
        <h2>😞 {error}</h2>
        <button className="retry-button" onClick={fetchRandomPokemon}>
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="Pokegame">
      <Pokedex
        pokemon={hand1}
        exp={exp1}
        isWinner={exp1 > exp2}
        playerName={player1Name}
      />
      <Pokedex
        pokemon={hand2}
        exp={exp2}
        isWinner={exp2 > exp1}
        playerName={player2Name}
      />
    </div>
  );
}

export default Pokegame;