import React from 'react';
import { getGradeList, gradeConfig, isGradeUnlocked } from '../data/characters.js';
import './GameMenu.css';

const GameMenu = ({ onStartGame, userProgress }) => {
  const gradeList = getGradeList();
  
  const getLevelStatus = (grade) => {
    if (!userProgress || !userProgress[grade]) {
      return { unlocked: false, currentLevel: 1, completed: false };
    }
    
    const progress = userProgress[grade];
    return {
      unlocked: true,
      currentLevel: progress.currentLevel,
      completed: progress.completed
    };
  };
  
  const getAchievementIcon = (level) => {
    switch (level) {
      case '高级': return '🏆';
      case '中级': return '🥈';
      case '初级': return '🥉';
      default: return '📋';
    }
  };
  
  const getAchievementColor = (level) => {
    switch (level) {
      case '高级': return '#ffd700';
      case '中级': return '#c0c0c0';
      case '初级': return '#cd7f32';
      default: return '#6c757d';
    }
  };

  // 获取默认成就数据
  const getDefaultAchievements = () => ({
    levels: { current: 0, max: 9, level: 'none' },
    deaths: { current: 0, max: 50, level: 'none' },
    characters: { current: 0, max: 45, level: 'none' }
  });

  // 获取用户统计数据
  const getUserStats = () => {
    if (!userProgress) {
      return {
        totalScore: 0,
        totalDeaths: 0,
        totalCharactersLearned: 0,
        achievements: getDefaultAchievements()
      };
    }
    return userProgress;
  };

  const userStats = getUserStats();

  return (
    <div className="game-menu">
      <div className="menu-container">
        <h1 className="game-title">汉字学习游戏</h1>
        <p className="game-subtitle">通过拼音选择学习生字</p>
        
        {/* 用户进度概览 */}
        <div className="user-progress-overview">
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-label">总得分</span>
              <span className="stat-value">{userStats.totalScore}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">死亡次数</span>
              <span className="stat-value">{userStats.totalDeaths}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">已学汉字</span>
              <span className="stat-value">{userStats.totalCharactersLearned}</span>
            </div>
          </div>
          
          {/* 成就系统 */}
          <div className="achievements-section">
            <h3>成就系统</h3>
            <div className="achievements-grid">
              <div className="achievement-item">
                <div className="achievement-icon" style={{ color: getAchievementColor(userStats.achievements.levels.level) }}>
                  {getAchievementIcon(userStats.achievements.levels.level)}
                </div>
                <div className="achievement-info">
                  <div className="achievement-name">闯关大师</div>
                  <div className="achievement-progress">
                    {userStats.achievements.levels.current}/{userStats.achievements.levels.max}
                  </div>
                  <div className="achievement-level">{userStats.achievements.levels.level || '未获得'}</div>
                </div>
              </div>
              
              <div className="achievement-item">
                <div className="achievement-icon" style={{ color: getAchievementColor(userStats.achievements.deaths.level) }}>
                  {getAchievementIcon(userStats.achievements.deaths.level)}
                </div>
                <div className="achievement-info">
                  <div className="achievement-name">生存专家</div>
                  <div className="achievement-progress">
                    {userStats.achievements.deaths.current}次死亡
                  </div>
                  <div className="achievement-level">{userStats.achievements.deaths.level || '未获得'}</div>
                </div>
              </div>
              
              <div className="achievement-item">
                <div className="achievement-icon" style={{ color: getAchievementColor(userStats.achievements.characters.level) }}>
                  {getAchievementIcon(userStats.achievements.characters.level)}
                </div>
                <div className="achievement-info">
                  <div className="achievement-name">汉字达人</div>
                  <div className="achievement-progress">
                    {userStats.achievements.characters.current}/{userStats.achievements.characters.max}
                  </div>
                  <div className="achievement-level">{userStats.achievements.characters.level || '未获得'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="menu-content">
          <h2>选择年级开始游戏</h2>
          <div className="grade-buttons">
            {gradeList.map(grade => {
              const status = getLevelStatus(grade);
              const config = gradeConfig[grade];
              const isUnlocked = isGradeUnlocked(grade, userProgress);
              
              return (
                <div key={grade} className={`grade-container ${!isUnlocked ? 'locked' : ''}`}>
                  <button
                    className={`grade-button ${!isUnlocked ? 'disabled' : ''}`}
                    onClick={() => isUnlocked && onStartGame(grade, status.currentLevel)}
                    disabled={!isUnlocked}
                  >
                    <span className="grade-name">{config.name}</span>
                    <span className="grade-desc">
                      {isUnlocked ? `第${status.currentLevel}关` : '需要解锁'}
                    </span>
                    {status.completed && <span className="grade-completed">✓ 已完成</span>}
                  </button>
                  
                  {!isUnlocked && (
                    <div className="lock-overlay">
                      <span className="lock-icon">🔒</span>
                      <span className="lock-text">需要完成{gradeConfig[config.requiredGrade]?.name}</span>
                    </div>
                  )}
                  
                  {/* 关卡进度指示器 */}
                  {isUnlocked && (
                    <div className="level-indicators">
                      {[1, 2, 3].map(level => (
                        <div
                          key={level}
                          className={`level-indicator ${
                            status.completed || level < status.currentLevel ? 'completed' :
                            level === status.currentLevel ? 'current' : 'locked'
                          }`}
                        >
                          {status.completed || level < status.currentLevel ? '✓' : level}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="game-rules">
            <h3>游戏规则</h3>
            <ul>
              <li>选择正确的拼音进入下一题</li>
              <li>每轮有3次错误机会</li>
              <li>连续答对可获得额外奖励</li>
              <li>完成所有关卡即可通关</li>
              <li>必须完成前一个年级才能解锁下一个年级</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMenu; 