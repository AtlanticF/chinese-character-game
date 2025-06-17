import React from 'react';
import './GameOver.css';

const GameOver = ({ score, onRestart, onReturnToMenu }) => {
  const gradeNames = {
    grade1: '一年级',
    grade2: '二年级',
    grade3: '三年级'
  };

  return (
    <div className="game-over">
      <div className="game-over-container">
        <div className="game-over-content">
          <h1 className="game-over-title">游戏结束</h1>
          
          <div className="final-score">
            <h2>最终得分</h2>
            <div className="score-display">{score}</div>
          </div>
          
          <div className="game-over-message">
            <p>很遗憾，生命值用完了！</p>
            <p>再接再厉，下次一定能做得更好！</p>
          </div>
          
          <div className="action-buttons">
            <button 
              className="restart-button"
              onClick={onRestart}
            >
              重新开始
            </button>
            <button 
              className="menu-button"
              onClick={onReturnToMenu}
            >
              返回主菜单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOver; 