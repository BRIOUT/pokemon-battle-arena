import { useEffect, useState } from 'react';
import './PokemonModal.css';

function PokemonModal({ pokemon, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonDetails();
  }, [pokemon.id]);

  const fetchPokemonDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      const data = await response.json();
      setDetails(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-loading">Loading details...</div>
        </div>
      </div>
    );
  }

  if (!details) return null;

  // Helper function to get stat color
  const getStatColor = (statName) => {
    const colors = {
      hp: '#FF5959',
      attack: '#F5AC78',
      defense: '#FAE078',
      'special-attack': '#9DB7F5',
      'special-defense': '#A7DB8D',
      speed: '#FA92B2'
    };
    return colors[statName] || '#68A090';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>{details.name}</h2>
          <span className="modal-number">#{details.id.toString().padStart(3, '0')}</span>
        </div>

        <div className="modal-body">
          {/* Large Image */}
          <div className="modal-image-section">
            <img
              src={details.sprites.other['official-artwork'].front_default || details.sprites.front_default}
              alt={details.name}
              className="modal-large-image"
            />
          </div>

          {/* Basic Info */}
          <div className="modal-info-grid">
            <div className="info-item">
              <span className="info-label">Height</span>
              <span className="info-value">{(details.height / 10).toFixed(1)}m</span>
            </div>
            <div className="info-item">
              <span className="info-label">Weight</span>
              <span className="info-value">{(details.weight / 10).toFixed(1)}kg</span>
            </div>
            <div className="info-item">
              <span className="info-label">Type</span>
              <div className="type-badges">
                {details.types.map((type) => (
                  <span key={type.slot} className={`type-badge ${type.type.name}`}>
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="modal-stats">
            <h3>Base Stats</h3>
            {details.stats.map((stat) => (
              <div key={stat.stat.name} className="stat-row">
                <span className="stat-name">{stat.stat.name}</span>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar"
                    style={{
                      width: `${(stat.base_stat / 255) * 100}%`,
                      backgroundColor: getStatColor(stat.stat.name)
                    }}
                  />
                </div>
                <span className="stat-value">{stat.base_stat}</span>
              </div>
            ))}
            <div className="stat-total">
              <span>Total:</span>
              <span>{details.stats.reduce((sum, s) => sum + s.base_stat, 0)}</span>
            </div>
          </div>

          {/* Abilities */}
          <div className="modal-abilities">
            <h3>Abilities</h3>
            <div className="abilities-list">
              {details.abilities.map((ability, idx) => (
                <span key={idx} className={`ability-badge ${ability.is_hidden ? 'hidden' : ''}`}>
                  {ability.ability.name}
                  {ability.is_hidden && ' (Hidden)'}
                </span>
              ))}
            </div>
          </div>

          {/* Top Moves */}
          <div className="modal-moves">
            <h3>Signature Moves</h3>
            <div className="moves-list">
              {details.moves.slice(0, 6).map((move, idx) => (
                <span key={idx} className="move-badge">
                  {move.move.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;