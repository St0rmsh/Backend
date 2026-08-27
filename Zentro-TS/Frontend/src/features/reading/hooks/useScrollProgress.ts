import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks';
import { updateCurrentSession } from '../state/readingSlice';

export const useScrollProgress = (postId: string | undefined) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!postId) return;

    // Reset progress when post changes
    dispatch(updateCurrentSession({ postId, scrollPercentage: 0 }));

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const calculateProgress = () => {
      // Calculate scroll percentage
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollableHeight = documentHeight - windowHeight;
      const percentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 100;
      
      dispatch(updateCurrentSession({ scrollPercentage: Math.min(100, Math.max(0, percentage)) }));
    };

    const handleScroll = () => {
      if (throttleTimer) return;
      
      throttleTimer = setTimeout(() => {
        calculateProgress();
        throttleTimer = null;
      }, 100); // Throttle to max 10 times a second
    };

    // Calculate initial progress
    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [postId, dispatch]);
};
