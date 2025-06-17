import { useState, useCallback, useEffect } from 'react';
import { getAllCharacters, getCharactersByGradeAndLevel, getLevelsByGrade, isGradeUnlocked } from '../data/characters.js';
import { useSound } from './useSound.js';
import { getUserProgress, updateUserProgress } from '../utils/storage.js';

// 游戏状态枚举
export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
  VICTORY: 'victory',
  LEVEL_COMPLETE: 'levelComplete'
};

// 游戏配置
const GAME_CONFIG = {
  MAX_LIVES: 3,
  POINTS_PER_CORRECT: 10,
  BONUS_POINTS: 5, // 连续答对奖励
  MIN_OPTIONS: 4,
  COMBO_START: 2, // 从第2次开始显示combo
  COMBO_SPECIAL: 3, // 从第3次开始特殊音效
  MAX_COMBO_EFFECT: 10 // 最大combo特效次数
};

export const useGame = () => {
  // 音效管理
  const { preloadSounds, playCorrectSound, playIncorrectSound, playComboSound } = useSound();
  
  // 游戏状态
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [currentGrade, setCurrentGrade] = useState('grade1');
  const [currentLevel, setCurrentLevel] = useState(1);
  
  // 游戏数据
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(GAME_CONFIG.MAX_LIVES);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [options, setOptions] = useState([]);
  const [usedCharacters, setUsedCharacters] = useState(new Set());
  const [streak, setStreak] = useState(0); // 连续答对次数
  
  // 进度追踪
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [completedCharacters, setCompletedCharacters] = useState(0);
  const [userProgress, setUserProgress] = useState(null);
  const [deathsThisGame, setDeathsThisGame] = useState(0);
  
  // 获取当前关卡的所有生字
  const getCurrentLevelCharacters = useCallback(() => {
    return getCharactersByGradeAndLevel(currentGrade, `level${currentLevel}`);
  }, [currentGrade, currentLevel]);
  
  // 生成随机选项
  const generateOptions = useCallback((correctCharacter, allCharacters) => {
    const correctPinyin = correctCharacter.pinyin;
    const wrongOptions = allCharacters
      .filter(char => char.pinyin !== correctPinyin)
      .map(char => char.pinyin);
    
    // 随机选择3个错误选项
    const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5);
    const selectedWrong = shuffledWrong.slice(0, GAME_CONFIG.MIN_OPTIONS - 1);
    
    // 组合选项并打乱顺序
    const allOptions = [correctPinyin, ...selectedWrong];
    return allOptions.sort(() => Math.random() - 0.5);
  }, []);
  
  // 获取下一个生字
  const getNextCharacter = useCallback(() => {
    const allCharacters = getCurrentLevelCharacters();
    const availableCharacters = allCharacters.filter(
      char => !usedCharacters.has(char.character)
    );
    
    // 如果所有生字都用完了，重新开始
    if (availableCharacters.length === 0) {
      setUsedCharacters(new Set());
      setCompletedCharacters(0);
      return allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }
    
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    return availableCharacters[randomIndex];
  }, [getCurrentLevelCharacters, usedCharacters]);
  
  // 开始新游戏
  const startGame = useCallback((grade = 'grade1', level = 1) => {
    setCurrentGrade(grade);
    setCurrentLevel(level);
    setScore(0);
    setLives(GAME_CONFIG.MAX_LIVES);
    setUsedCharacters(new Set());
    setStreak(0);
    setCompletedCharacters(0);
    setDeathsThisGame(0);
    
    // 设置总生字数
    const characters = getCharactersByGradeAndLevel(grade, `level${level}`);
    setTotalCharacters(characters.length);
    
    setGameState(GAME_STATES.PLAYING);
  }, []);
  
  // 处理答案选择
  const handleAnswer = useCallback((selectedPinyin) => {
    if (!currentCharacter) return;
    
    const isCorrect = selectedPinyin === currentCharacter.pinyin;
    
    if (isCorrect) {
      // 答对了
      const points = GAME_CONFIG.POINTS_PER_CORRECT + 
        (streak >= 2 ? GAME_CONFIG.BONUS_POINTS : 0);
      setScore(prev => prev + points);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // 播放音效
      if (newStreak >= GAME_CONFIG.COMBO_SPECIAL && newStreak <= GAME_CONFIG.MAX_COMBO_EFFECT) {
        playComboSound();
      } else {
        playCorrectSound();
      }
      
      // 标记已使用的生字
      setUsedCharacters(prev => new Set([...prev, currentCharacter.character]));
      setCompletedCharacters(prev => prev + 1);
      
      // 检查是否完成当前关卡
      const allCharacters = getCurrentLevelCharacters();
      const newUsedSet = new Set([...usedCharacters, currentCharacter.character]);
      if (newUsedSet.size >= allCharacters.length) {
        // 关卡完成，保存进度
        const progress = updateUserProgress(currentGrade, currentLevel, score + points, deathsThisGame, completedCharacters + 1);
        setUserProgress(progress);
        setGameState(GAME_STATES.LEVEL_COMPLETE);
        return;
      }
    } else {
      // 答错了
      const newLives = lives - 1;
      const newDeathsThisGame = deathsThisGame + 1;
      setLives(newLives);
      setDeathsThisGame(newDeathsThisGame);
      setStreak(0);
      
      // 播放错误音效
      playIncorrectSound();
      
      if (newLives <= 0) {
        // 游戏结束，保存死亡次数和当前进度
        const progress = updateUserProgress(currentGrade, currentLevel, score, newDeathsThisGame, completedCharacters);
        setUserProgress(progress);
        setGameState(GAME_STATES.GAME_OVER);
        return;
      }
    }
  }, [currentCharacter, streak, lives, deathsThisGame, usedCharacters, getCurrentLevelCharacters, playCorrectSound, playIncorrectSound, playComboSound, currentGrade, currentLevel, score, completedCharacters]);
  
  // 完成关卡
  const completeLevel = useCallback(() => {
    // 检查是否还有下一关
    const levels = getLevelsByGrade(currentGrade);
    const nextLevel = currentLevel + 1;
    
    if (nextLevel <= levels.length) {
      // 还有下一关，开始下一关
      startGame(currentGrade, nextLevel);
    } else {
      // 年级完成，保存最终进度并标记为完成
      const finalProgress = updateUserProgress(currentGrade, currentLevel, score, deathsThisGame, completedCharacters);
      
      // 确保标记年级为已完成
      if (finalProgress[currentGrade]) {
        finalProgress[currentGrade].completed = true;
        finalProgress[currentGrade].currentLevel = currentLevel;
      }
      
      setUserProgress(finalProgress);
      setGameState(GAME_STATES.VICTORY);
    }
  }, [currentGrade, currentLevel, score, deathsThisGame, completedCharacters, startGame]);
  
  // 返回主菜单
  const returnToMenu = useCallback(() => {
    // 如果当前正在游戏中，保存当前进度
    if (gameState === GAME_STATES.PLAYING && score > 0) {
      const progress = updateUserProgress(currentGrade, currentLevel, score, deathsThisGame, completedCharacters);
      setUserProgress(progress);
    }
    setGameState(GAME_STATES.MENU);
  }, [gameState, score, currentGrade, currentLevel, deathsThisGame, completedCharacters]);
  
  // 重新开始当前关卡
  const restartLevel = useCallback(() => {
    startGame(currentGrade, currentLevel);
  }, [startGame, currentGrade, currentLevel]);
  
  // 加载用户进度
  useEffect(() => {
    const progress = getUserProgress();
    setUserProgress(progress);
  }, []);
  
  // 预加载音效
  useEffect(() => {
    preloadSounds();
  }, [preloadSounds]);
  
  // 当游戏状态为PLAYING时，生成新的生字和选项
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      const nextCharacter = getNextCharacter();
      setCurrentCharacter(nextCharacter);
      
      const allCharacters = getAllCharacters();
      const newOptions = generateOptions(nextCharacter, allCharacters);
      setOptions(newOptions);
    }
  }, [gameState, getNextCharacter, generateOptions]);
  
  return {
    // 状态
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
    
    // 方法
    startGame,
    handleAnswer,
    completeLevel,
    returnToMenu,
    restartLevel,
    
    // 常量
    GAME_CONFIG
  };
}; 