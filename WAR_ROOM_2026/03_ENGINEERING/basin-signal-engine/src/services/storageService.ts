// BASIN::NEXUS v9.0 - Storage Service

import { UserState } from '../types';
import { INITIAL_USER_STATE } from '../constants';

const STORAGE_KEY = 'basin_nexus_state';

export const loadUserState = (): UserState => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with defaults to handle new fields
            return { ...INITIAL_USER_STATE, ...parsed };
        }
    } catch (error) {
        console.error('Failed to load user state:', error);
    }
    return INITIAL_USER_STATE;
};

export const saveUserState = (state: UserState): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save user state:', error);
    }
};

export const clearUserState = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear user state:', error);
    }
};

export const exportUserState = (state: UserState): string => {
    return JSON.stringify(state, null, 2);
};

export const importUserState = (jsonString: string): UserState | null => {
    try {
        const parsed = JSON.parse(jsonString);
        return { ...INITIAL_USER_STATE, ...parsed };
    } catch (error) {
        console.error('Failed to import user state:', error);
        return null;
    }
};
