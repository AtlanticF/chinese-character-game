// 生字数据 - 按年级和关卡分类
export const characterData = {
  grade1: {
    level1: [
      { character: '人', pinyin: 'rén', meaning: '人' },
      { character: '口', pinyin: 'kǒu', meaning: '口' },
      { character: '日', pinyin: 'rì', meaning: '日' },
      { character: '月', pinyin: 'yuè', meaning: '月' },
      { character: '水', pinyin: 'shuǐ', meaning: '水' }
    ],
    level2: [
      { character: '火', pinyin: 'huǒ', meaning: '火' },
      { character: '山', pinyin: 'shān', meaning: '山' },
      { character: '石', pinyin: 'shí', meaning: '石' },
      { character: '田', pinyin: 'tián', meaning: '田' },
      { character: '土', pinyin: 'tǔ', meaning: '土' }
    ],
    level3: [
      { character: '木', pinyin: 'mù', meaning: '木' },
      { character: '禾', pinyin: 'hé', meaning: '禾' },
      { character: '竹', pinyin: 'zhú', meaning: '竹' },
      { character: '米', pinyin: 'mǐ', meaning: '米' },
      { character: '糸', pinyin: 'sī', meaning: '糸' }
    ]
  },
  grade2: {
    level1: [
      { character: '学', pinyin: 'xué', meaning: '学习' },
      { character: '习', pinyin: 'xí', meaning: '练习' },
      { character: '读', pinyin: 'dú', meaning: '读书' },
      { character: '写', pinyin: 'xiě', meaning: '写字' },
      { character: '说', pinyin: 'shuō', meaning: '说话' }
    ],
    level2: [
      { character: '听', pinyin: 'tīng', meaning: '听' },
      { character: '看', pinyin: 'kàn', meaning: '看' },
      { character: '走', pinyin: 'zǒu', meaning: '走' },
      { character: '跑', pinyin: 'pǎo', meaning: '跑' },
      { character: '跳', pinyin: 'tiào', meaning: '跳' }
    ],
    level3: [
      { character: '吃', pinyin: 'chī', meaning: '吃' },
      { character: '喝', pinyin: 'hē', meaning: '喝' },
      { character: '睡', pinyin: 'shuì', meaning: '睡觉' },
      { character: '玩', pinyin: 'wán', meaning: '玩' },
      { character: '笑', pinyin: 'xiào', meaning: '笑' }
    ]
  },
  grade3: {
    level1: [
      { character: '爱', pinyin: 'ài', meaning: '爱' },
      { character: '家', pinyin: 'jiā', meaning: '家' },
      { character: '国', pinyin: 'guó', meaning: '国家' },
      { character: '校', pinyin: 'xiào', meaning: '学校' },
      { character: '师', pinyin: 'shī', meaning: '老师' }
    ],
    level2: [
      { character: '生', pinyin: 'shēng', meaning: '学生' },
      { character: '友', pinyin: 'yǒu', meaning: '朋友' },
      { character: '亲', pinyin: 'qīn', meaning: '亲人' },
      { character: '父', pinyin: 'fù', meaning: '父亲' },
      { character: '母', pinyin: 'mǔ', meaning: '母亲' }
    ],
    level3: [
      { character: '兄', pinyin: 'xiōng', meaning: '兄弟' },
      { character: '弟', pinyin: 'dì', meaning: '弟弟' },
      { character: '姐', pinyin: 'jiě', meaning: '姐姐' },
      { character: '妹', pinyin: 'mèi', meaning: '妹妹' },
      { character: '爷', pinyin: 'yé', meaning: '爷爷' }
    ]
  }
};

// 年级配置
export const gradeConfig = {
  grade1: { name: '一年级', levels: 3, requiredGrade: null },
  grade2: { name: '二年级', levels: 3, requiredGrade: 'grade1' },
  grade3: { name: '三年级', levels: 3, requiredGrade: 'grade2' }
};

// 获取所有生字
export const getAllCharacters = () => {
  const allCharacters = [];
  Object.values(characterData).forEach(grade => {
    Object.values(grade).forEach(level => {
      allCharacters.push(...level);
    });
  });
  return allCharacters;
};

// 根据年级和关卡获取生字
export const getCharactersByGradeAndLevel = (grade, level) => {
  return characterData[grade]?.[level] || [];
};

// 获取年级的所有关卡
export const getLevelsByGrade = (grade) => {
  return Object.keys(characterData[grade] || {});
};

// 获取年级列表
export const getGradeList = () => {
  return Object.keys(characterData);
};

// 检查年级是否解锁
export const isGradeUnlocked = (grade, userProgress) => {
  const config = gradeConfig[grade];
  if (!config) return false;
  
  // 如果userProgress为null或undefined，只有grade1可以解锁
  if (!userProgress) {
    return grade === 'grade1';
  }
  
  if (!config.requiredGrade) return true;
  
  const requiredGradeProgress = userProgress[config.requiredGrade];
  return requiredGradeProgress && requiredGradeProgress.completed;
}; 