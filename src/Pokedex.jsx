import { useState } from 'react';
import Pokecard from './Pokecard';
import PokemonModal from './PokemonModal';
import './Pokedex.css';

function Pokedex({ pokemon, exp, isWinner, playerName }) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handlePokemonClick = (pokemonData) => {
    setSelectedPokemon(pokemonData);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className={`Pokedex ${isWinner ? 'winner' : ''}`}>
      <h2 className="Pokedex-title">{playerName}'s Team</h2>
      <p className="Pokedex-exp">Total Experience: {exp}</p>
      <div className="Pokedex-cards">
        {pokemon.map((p) => (
          <Pokecard
            key={p.id}
            id={p.id}
            name={p.name}
            type={p.type}
            base_experience={p.base_experience}
            onClick={handlePokemonClick}
          />
        ))}
      </div>
      {isWinner && <h3 className="Pokedex-winner">🏆 THIS HAND WINS! 🏆</h3>}

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// ... defaultProps stay the same

export default Pokedex;