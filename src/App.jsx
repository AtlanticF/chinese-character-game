import React from 'react';
import { useGame, GAME_STATES } from './hooks/useGame';
import GameMenu from './components/GameMenu';
import GamePlay from './components/GamePlay';
import GameOver from './components/GameOver';
import GameVictory from './components/GameVictory';
import LevelComplete from './components/LevelComplete';
import './App.css';

function App() {
  const {
    gameState,
    currentGrade,
    currentLevel,
    score,
    lives,
    currentCharacter,
    options,
    streak,
    totalCharacters,
    completedCharacters,
    userProgress,
    startGame,
    handleAnswer,
    completeLevel,
    returnToMenu,
    restartLevel,
    GAME_CONFIG
  } = useGame();

  // 根据游戏状态渲染不同组件
  const renderGameComponent = () => {
    switch (gameState) {
      case GAME_STATES.MENU:
        return <GameMenu onStartGame={startGame} userProgress={userProgress} />;
      
      case GAME_STATES.PLAYING:
        return (
          <GamePlay
            currentCharacter={currentCharacter}
            options={options}
            score={score}
            lives={lives}
            streak={streak}
            totalCharacters={totalCharacters}
            completedCharacters={completedCharacters}
            currentGrade={currentGrade}
            currentLevel={currentLevel}
            onAnswer={handleAnswer}
            onReturnToMenu={returnToMenu}
            GAME_CONFIG={GAME_CONFIG}
          />
        );
      
      case GAME_STATES.LEVEL_COMPLETE:
        return (
          <LevelComplete
            score={score}
            currentGrade={currentGrade}
            currentLevel={currentLevel}
            onNextLevel={completeLevel}
            onReturnToMenu={returnToMenu}
          />
        );
      
      case GAME_STATES.GAME_OVER:
        return (
          <GameOver
            score={score}
            onRestart={restartLevel}
            onReturnToMenu={returnToMenu}
          />
        );
      
      case GAME_STATES.VICTORY:
        return (
          <GameVictory
            score={score}
            currentGrade={currentGrade}
            onRestart={() => startGame(currentGrade, 1)}
            onReturnToMenu={returnToMenu}
          />
        );
      
      default:
        return <GameMenu onStartGame={startGame} userProgress={userProgress} />;
    }
  };

  return (
    <div className="App">
      {renderGameComponent()}
    </div>
  );
}

export default App; 