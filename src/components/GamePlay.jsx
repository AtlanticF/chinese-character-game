import React, { useState, useEffect } from 'react';
import './GamePlay.css';

const GamePlay = ({ 
  currentCharacter, 
  options, 
  score, 
  lives, 
  streak, 
  totalCharacters,
  completedCharacters,
  currentGrade,
  currentLevel,
  onAnswer, 
  onReturnToMenu,
  GAME_CONFIG 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shake, setShake] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const [comboCount, setComboCount] = useState(0);

  const gradeNames = {
    grade1: '一年级',
    grade2: '二年级',
    grade3: '三年级'
  };

  // 处理答案选择
  const handleOptionClick = (pinyin) => {
    if (selectedAnswer !== null) return; // 防止重复点击
    
    setSelectedAnswer(pinyin);
    const correct = pinyin === currentCharacter.pinyin;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (!correct) {
      setShake(true);
      setShowCombo(false);
    } else {
      // 显示combo特效
      if (streak >= GAME_CONFIG.COMBO_START - 1) {
        setComboCount(streak + 1);
        setShowCombo(true);
      }
    }
    
    // 立即处理答案（音效会在onAnswer中播放）
    onAnswer(pinyin);
    
    // 延迟重置状态，让用户看到结果
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      setShake(false);
      setShowCombo(false);
    }, 1000);
  };

  // 当生字改变时重置状态
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setShake(false);
    setShowCombo(false);
  }, [currentCharacter]);

  if (!currentCharacter) return null;

  const getOptionClass = (pinyin) => {
    let className = 'option-button';
    
    if (selectedAnswer === pinyin) {
      className += showResult 
        ? (isCorrect ? ' correct' : ' incorrect')
        : ' selected';
    }
    
    if (showResult && pinyin === currentCharacter.pinyin) {
      className += ' correct';
    }
    
    return className;
  };

  // 计算进度百分比
  const progressPercentage = totalCharacters > 0 ? (completedCharacters / totalCharacters) * 100 : 0;

  return (
    <div className="game-play">
      <div className="game-header">
        <div className="level-info">
          <div className="current-level">
            {gradeNames[currentGrade]} - 第{currentLevel}关
          </div>
        </div>
        
        <div className="score-board">
          <div className="score">得分: {score}</div>
          <div className="lives">
            生命: {Array.from({ length: GAME_CONFIG.MAX_LIVES }, (_, i) => (
              <span 
                key={i} 
                className={`heart ${i < lives ? 'active' : 'inactive'}`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-info">
            <span>关卡进度: {completedCharacters}/{totalCharacters}</span>
            <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {streak >= GAME_CONFIG.COMBO_START && (
          <div className="streak">
            连续答对: {streak} 次
            {streak >= 2 && <span className="bonus"> +{GAME_CONFIG.BONUS_POINTS} 奖励</span>}
          </div>
        )}
        
        {/* 返回首页按钮 */}
        <div className="menu-button-container">
          <button 
            className="menu-button"
            onClick={onReturnToMenu}
            title="返回主菜单"
          >
            🏠 首页
          </button>
        </div>
      </div>

      <div className="game-content">
        <div className={`character-display ${shake ? 'shake' : ''}`}>
          <div className="character">{currentCharacter.character}</div>
          <div className="meaning">{currentCharacter.meaning}</div>
        </div>

        <div className="question">
          <h2>请选择正确的拼音</h2>
        </div>

        <div className="options-grid">
          {options.map((pinyin, index) => (
            <button
              key={index}
              className={getOptionClass(pinyin)}
              onClick={() => handleOptionClick(pinyin)}
              disabled={selectedAnswer !== null}
            >
              {pinyin}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✓ 答对了！' : '✗ 答错了！'}
          </div>
        )}

        {/* Combo特效 */}
        {showCombo && comboCount >= GAME_CONFIG.COMBO_START && (
          <div className={`combo-effect ${comboCount >= GAME_CONFIG.COMBO_SPECIAL ? 'special' : ''}`}>
            <div className="combo-text">
              COMBO x{comboCount}
            </div>
            {comboCount >= GAME_CONFIG.COMBO_SPECIAL && comboCount <= GAME_CONFIG.MAX_COMBO_EFFECT && (
              <div className="combo-sparkles">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="sparkle" style={{ '--angle': `${i * 45}deg` }}>✨</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlay; 