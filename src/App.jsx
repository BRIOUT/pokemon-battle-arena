import { useState } from 'react';
import './App.css';
import Pokegame from './Pokegame';

function App() {
  const [gameKey, setGameKey] = useState(0);
  const [player1Name, setPlayer1Name] = useState('Red');
  const [player2Name, setPlayer2Name] = useState('Blue');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [showNameInput, setShowNameInput] = useState(false);

  const startNewGame = () => {
    setGameKey(prevKey => prevKey + 1);
  };

  const updateScore = (winner) => {
    if (winner === 1) {
      setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
    } else if (winner === 2) {
      setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
    }
  };

  const resetScores = () => {
    setScores({ player1: 0, player2: 0 });
    setGameKey(0);
  };

  return (
    <div className="App">
      <h1 className="App-title">⚡ Pokemon Battle Arena ⚡</h1>

      <div className="App-scoreboard">
        <div className="App-score">
          <span className="player-name">{player1Name}</span>
          <span className="score-value">{scores.player1}</span>
        </div>
        <div className="App-score">
          <span className="player-name">{player2Name}</span>
          <span className="score-value">{scores.player2}</span>
        </div>
      </div>

      <div className="App-controls">
        <button className="App-button primary" onClick={startNewGame}>
          🎮 New Battle
        </button>
        <button className="App-button secondary" onClick={resetScores}>
          🔄 Reset Scores
        </button>
        <button className="App-button tertiary" onClick={() => setShowNameInput(!showNameInput)}>
          ✏️ Edit Names
        </button>
      </div>

      {showNameInput && (
        <div className="App-name-inputs">
          <input
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Player 1 Name"
            maxLength={15}
          />
          <input
            type="text"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            placeholder="Player 2 Name"
            maxLength={15}
          />
        </div>
      )}

      <Pokegame
        key={gameKey}
        player1Name={player1Name}
        player2Name={player2Name}
        onScoreUpdate={updateScore}
      />
    </div>
  );
}

export default App;