/**
 * Safe localStorage wrapper with versioning and fallback capabilities
 */

const STORAGE_PREFIX = 'lifeos_';

export function getStorageItem(key, fallbackValue) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallbackValue;
    }
    const item = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (item === null || item === undefined) {
      return fallbackValue;
    }
    return JSON.parse(item);
  } catch (err) {
    console.warn(`[LifeOS Storage] Failed to read key: ${key}`, err);
    return fallbackValue;
  }
}

export function setStorageItem(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[LifeOS Storage] Failed to write key: ${key}`, err);
    return false;
  }
}

export function removeStorageItem(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (err) {
    console.warn(`[LifeOS Storage] Failed to remove key: ${key}`, err);
  }
}

export function clearLifeOSStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const keysToRemove = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  } catch (err) {
    console.error('[LifeOS Storage] Failed to clear storage', err);
  }
}
