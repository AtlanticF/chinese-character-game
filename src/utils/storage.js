// 浏览器指纹生成和本地存储管理

// 生成简单的浏览器指纹
export const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Browser Fingerprint', 2, 2);
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasHash: canvas.toDataURL().slice(-16)
  };
  
  // 生成哈希
  let hash = 0;
  const str = JSON.stringify(fingerprint);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  return Math.abs(hash).toString(36);
};

// 获取或创建用户ID
export const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateFingerprint();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// 保存用户进度
export const saveUserProgress = (progress) => {
  const userId = getUserId();
  localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
};

// 获取用户进度
export const getUserProgress = () => {
  const userId = getUserId();
  const progress = localStorage.getItem(`progress_${userId}`);
  return progress ? JSON.parse(progress) : getDefaultProgress();
};

// 获取默认进度
export const getDefaultProgress = () => {
  return {
    grade1: { completed: false, currentLevel: 1, maxLevel: 3, score: 0, deaths: 0, charactersLearned: 0 },
    grade2: { completed: false, currentLevel: 1, maxLevel: 3, score: 0, deaths: 0, charactersLearned: 0 },
    grade3: { completed: false, currentLevel: 1, maxLevel: 3, score: 0, deaths: 0, charactersLearned: 0 },
    totalScore: 0,
    totalDeaths: 0,
    totalCharactersLearned: 0,
    achievements: {
      levels: { current: 0, max: 9, level: 'none' }, // 闯关个数
      deaths: { current: 0, max: 50, level: 'none' }, // 死亡次数
      characters: { current: 0, max: 45, level: 'none' } // 成功识别字个数
    }
  };
};

// 更新用户进度
export const updateUserProgress = (grade, level, score, deaths, charactersLearned) => {
  const progress = getUserProgress();
  
  // 确保输入参数是数字类型
  const numericScore = Number(score) || 0;
  const numericDeaths = Number(deaths) || 0;
  const numericCharactersLearned = Number(charactersLearned) || 0;
  const numericLevel = Number(level) || 1;
  
  // 更新年级进度
  if (!progress[grade]) {
    progress[grade] = { completed: false, currentLevel: 1, maxLevel: 3, score: 0, deaths: 0, charactersLearned: 0 };
  }
  
  // 确保年级数据是数字类型
  // 对于分数，只保存最高分
  progress[grade].score = Math.max(Number(progress[grade].score) || 0, numericScore);
  // 对于死亡次数和已学汉字，累加当前游戏的数据
  progress[grade].deaths = (Number(progress[grade].deaths) || 0) + numericDeaths;
  progress[grade].charactersLearned = (Number(progress[grade].charactersLearned) || 0) + numericCharactersLearned;
  
  // 检查是否完成当前关卡
  if (numericLevel > (Number(progress[grade].currentLevel) || 0)) {
    progress[grade].currentLevel = numericLevel;
  }
  
  // 检查是否完成整个年级（修复逻辑）
  if (numericLevel >= (Number(progress[grade].maxLevel) || 3)) {
    progress[grade].completed = true;
    progress[grade].currentLevel = Number(progress[grade].maxLevel) || 3; // 确保currentLevel设置为最大关卡
  }
  
  // 更新总计 - 修复计算逻辑
  let totalScore = 0;
  let totalDeaths = 0;
  let totalCharactersLearned = 0;
  
  // 只计算年级数据，排除其他属性
  Object.keys(progress).forEach(key => {
    if (key.startsWith('grade') && typeof progress[key] === 'object' && progress[key] !== null) {
      totalScore += Number(progress[key].score) || 0;
      totalDeaths += Number(progress[key].deaths) || 0;
      totalCharactersLearned += Number(progress[key].charactersLearned) || 0;
    }
  });
  
  progress.totalScore = totalScore;
  progress.totalDeaths = totalDeaths;
  progress.totalCharactersLearned = totalCharactersLearned;
  
  // 更新成就
  updateAchievements(progress);
  
  saveUserProgress(progress);
  return progress;
};

// 更新成就
export const updateAchievements = (progress) => {
  const achievements = progress.achievements;
  
  // 闯关个数成就
  const completedLevels = Object.keys(progress).filter(key => 
    key.startsWith('grade') && progress[key] && progress[key].completed
  ).length * 3;
  achievements.levels.current = Number(completedLevels) || 0;
  if (completedLevels >= 9) achievements.levels.level = '高级';
  else if (completedLevels >= 6) achievements.levels.level = '中级';
  else if (completedLevels >= 3) achievements.levels.level = '初级';
  
  // 死亡次数成就（死亡次数越少越好）
  achievements.deaths.current = Number(progress.totalDeaths) || 0;
  if (achievements.deaths.current <= 5) achievements.deaths.level = '高级';
  else if (achievements.deaths.current <= 15) achievements.deaths.level = '中级';
  else if (achievements.deaths.current <= 30) achievements.deaths.level = '初级';
  
  // 成功识别字个数成就
  achievements.characters.current = Number(progress.totalCharactersLearned) || 0;
  if (achievements.characters.current >= 45) achievements.characters.level = '高级';
  else if (achievements.characters.current >= 30) achievements.characters.level = '中级';
  else if (achievements.characters.current >= 15) achievements.characters.level = '初级';
};

// 清除用户数据
export const clearUserData = () => {
  const userId = getUserId();
  localStorage.removeItem(`progress_${userId}`);
  localStorage.removeItem('userId');
}; 