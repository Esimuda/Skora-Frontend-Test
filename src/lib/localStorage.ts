/**
 * Local Storage Utility for Offline Data Persistence
 * Allows teachers to work offline and sync when internet is available
 */

const STORAGE_PREFIX = 'skora_';

export const localStorageService = {
  /**
   * Save data to local storage
   */
  save<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_PREFIX + key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Get data from local storage
   */
  get<T>(key: string): T | null {
    try {
      const serialized = localStorage.getItem(STORAGE_PREFIX + key);
      if (serialized === null) return null;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  /**
   * Remove data from local storage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all Skora data from local storage
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Check if data exists
   */
  exists(key: string): boolean {
    return localStorage.getItem(STORAGE_PREFIX + key) !== null;
  },

  /**
   * Auto-save scores (debounced)
   */
  autoSaveScores(classId: string, subjectId: string, scores: any[]): void {
    const key = `scores_${classId}_${subjectId}`;
    this.save(key, {
      scores,
      lastSaved: new Date().toISOString(),
      synced: false,
    });
  },

  /**
   * Get saved scores
   */
  getSavedScores(classId: string, subjectId: string): any {
    const key = `scores_${classId}_${subjectId}`;
    return this.get(key);
  },

  /**
   * Mark scores as synced
   */
  markSynced(classId: string, subjectId: string): void {
    const key = `scores_${classId}_${subjectId}`;
    const data = this.get(key);
    if (data) {
      this.save(key, { ...data, synced: true });
    }
  },

  /**
   * Get all unsynced data
   */
  getUnsyncedData(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter((key) => key.startsWith(STORAGE_PREFIX + 'scores_'))
      .filter((key) => {
        const data = this.get(key.replace(STORAGE_PREFIX, ''));
        return data && !data.synced;
      });
  },

  /**
   * Save behavioral assessments
   */
  saveBehavioral(classId: string, studentId: string, ratings: any): void {
    const key = `behavioral_${classId}_${studentId}`;
    this.save(key, {
      ratings,
      lastSaved: new Date().toISOString(),
      synced: false,
    });
  },

  /**
   * Get behavioral assessments
   */
  getBehavioral(classId: string, studentId: string): any {
    const key = `behavioral_${classId}_${studentId}`;
    return this.get(key);
  },

  /**
   * Save comments
   */
  saveComment(classId: string, studentId: string, comment: string, type: 'teacher' | 'principal'): void {
    const key = `comment_${type}_${classId}_${studentId}`;
    this.save(key, {
      comment,
      lastSaved: new Date().toISOString(),
      synced: false,
    });
  },

  /**
   * Get comment
   */
  getComment(classId: string, studentId: string, type: 'teacher' | 'principal'): any {
    const key = `comment_${type}_${classId}_${studentId}`;
    return this.get(key);
  },
};
