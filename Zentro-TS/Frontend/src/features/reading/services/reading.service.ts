import { ReadingGoal, ReadingStreak, Achievement, ReadingHistoryItem } from '../types';

const mockGoal: ReadingGoal = {
  dailyMinutes: 30,
  weeklyArticles: 5,
  currentDailyMinutes: 12,
  currentWeeklyArticles: 2,
  lastUpdated: new Date().toISOString(),
};

const mockStreak: ReadingStreak = {
  currentStreak: 3,
  longestStreak: 14,
  lastReadDate: new Date().toISOString(),
};

const mockAchievements: Achievement[] = [
  { id: '1', title: 'First Read', description: 'Read your first article', icon: 'book', isUnlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: '2', title: 'Avid Reader', description: 'Read 10 articles', icon: 'star', isUnlocked: false, progress: 2, maxProgress: 10 },
  { id: '3', title: 'Week Warrior', description: 'Read every day for a week', icon: 'flame', isUnlocked: false, progress: 3, maxProgress: 7 },
];

const mockHistory: ReadingHistoryItem[] = [
  { postId: '1', title: 'The Future of AI in Web Development', author: 'ai_expert', category: 'Technology', completionPercentage: 100, readAt: new Date(Date.now() - 3600000).toISOString() },
  { postId: '2', title: '10 Tips for Better Sleep', author: 'health_guru', category: 'Health', completionPercentage: 45, readAt: new Date(Date.now() - 86400000).toISOString() },
];

export const readingService = {
  getReadingData: async (): Promise<{ goal: ReadingGoal, streak: ReadingStreak, achievements: Achievement[], history: ReadingHistoryItem[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          goal: mockGoal,
          streak: mockStreak,
          achievements: mockAchievements,
          history: mockHistory,
        });
      }, 500);
    });
  },

  syncProgress: async (_postId: string, _percentage: number): Promise<void> => {
    // In a real app, this would ping the backend to update reading history / progress
    return new Promise((resolve) => setTimeout(resolve, 300));
  }
};
