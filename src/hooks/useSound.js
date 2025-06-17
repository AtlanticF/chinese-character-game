import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioRefs = useRef({
    correct: null,
    incorrect: null,
    combo: null
  });

  // 预加载音效
  const preloadSounds = useCallback(() => {
    try {
      audioRefs.current.correct = new Audio('/sounds/correct.mp3');
      audioRefs.current.incorrect = new Audio('/sounds/incorrect.mp3');
      audioRefs.current.combo = new Audio('/sounds/combo.mp3');
      
      // 设置音量
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.volume = 0.5;
          audio.preload = 'auto';
        }
      });
    } catch (error) {
      console.warn('音效加载失败:', error);
    }
  }, []);

  // 播放正确音效
  const playCorrectSound = useCallback(() => {
    try {
      if (audioRefs.current.correct) {
        audioRefs.current.correct.currentTime = 0;
        audioRefs.current.correct.play().catch(error => {
          console.warn('播放正确音效失败:', error);
        });
      }
    } catch (error) {
      console.warn('播放正确音效失败:', error);
    }
  }, []);

  // 播放错误音效
  const playIncorrectSound = useCallback(() => {
    try {
      if (audioRefs.current.incorrect) {
        audioRefs.current.incorrect.currentTime = 0;
        audioRefs.current.incorrect.play().catch(error => {
          console.warn('播放错误音效失败:', error);
        });
      }
    } catch (error) {
      console.warn('播放错误音效失败:', error);
    }
  }, []);

  // 播放combo音效
  const playComboSound = useCallback(() => {
    try {
      if (audioRefs.current.combo) {
        audioRefs.current.combo.currentTime = 0;
        audioRefs.current.combo.play().catch(error => {
          console.warn('播放combo音效失败:', error);
        });
      }
    } catch (error) {
      console.warn('播放combo音效失败:', error);
    }
  }, []);

  return {
    preloadSounds,
    playCorrectSound,
    playIncorrectSound,
    playComboSound
  };
}; 