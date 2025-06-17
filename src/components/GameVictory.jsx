import React from 'react';
import './GameVictory.css';

const GameVictory = ({ score, currentGrade, onRestart, onReturnToMenu }) => {
  const gradeNames = {
    grade1: '一年级',
    grade2: '二年级',
    grade3: '三年级'
  };

  return (
    <div className="game-victory">
      <div className="victory-container">
        <div className="victory-content">
          <div className="victory-header">
            <h1 className="victory-title">🎉 恭喜通关！</h1>
            <div className="grade-badge">{gradeNames[currentGrade]}</div>
          </div>
          
          <div className="final-score">
            <h2>最终得分</h2>
            <div className="score-display">{score}</div>
          </div>
          
          <div className="victory-message">
            <p>太棒了！你已经完成了{gradeNames[currentGrade]}的所有生字！</p>
            <p>你的学习能力非常出色！</p>
          </div>
          
          <div className="achievement">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-text">
              <h3>成就解锁</h3>
              <p>{gradeNames[currentGrade]}生字大师</p>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="restart-button"
              onClick={onRestart}
            >
              再玩一次
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

export default GameVictory; 