import React from 'react';
import './LevelComplete.css';

const LevelComplete = ({ 
  score, 
  currentGrade, 
  currentLevel, 
  onNextLevel, 
  onReturnToMenu 
}) => {
  const gradeNames = {
    grade1: '一年级',
    grade2: '二年级',
    grade3: '三年级'
  };

  return (
    <div className="level-complete">
      <div className="level-complete-container">
        <div className="level-complete-content">
          <div className="level-complete-header">
            <h1 className="level-complete-title">🎉 关卡完成！</h1>
            <div className="level-badge">
              {gradeNames[currentGrade]} - 第{currentLevel}关
            </div>
          </div>
          
          <div className="final-score">
            <h2>本关得分</h2>
            <div className="score-display">{score}</div>
          </div>
          
          <div className="level-complete-message">
            <p>恭喜你完成了第{currentLevel}关！</p>
            <p>继续挑战下一关吧！</p>
          </div>
          
          <div className="action-buttons">
            <button 
              className="next-level-button"
              onClick={onNextLevel}
            >
              下一关
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

export default LevelComplete; 