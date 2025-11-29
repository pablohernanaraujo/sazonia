---
name: sazonia-local-storage
description: Manage client-side storage with type-safe utilities, versioning, and migration strategies. Use when working with localStorage, sessionStorage, client-side data persistence, browser storage, or cache management.
---

# Sazonia Local Storage Management

This Skill helps you implement type-safe client-side storage with versioning, migration strategies, and proper error handling in sazonia-web.

## When to Use This Skill

- Storing user preferences
- Caching data client-side
- Persisting form state
- Managing shopping cart data
- Storing authentication tokens
- Implementing offline functionality

## Core Principles

### 1. Storage Types

**localStorage**: Persistent across sessions
**sessionStorage**: Cleared when tab closes
**Cookies**: For server-side access

### 2. Type Safety

Always use TypeScript for storage operations:

- Define types for stored data
- Validate data when reading
- Handle JSON parse errors

## Storage Patterns

### Pattern 1: Type-Safe Storage Utility

**Base Storage Utility:**

```typescript
// src/lib/storage.ts
export class TypedStorage<T> {
  constructor(
    private key: string,
    private storage: Storage = localStorage
  ) {}

  get(): T | null {
    try {
      const item = this.storage.getItem(this.key);
      if (!item) return null;

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading ${this.key} from storage:`, error);
      return null;
    }
  }

  set(value: T): void {
    try {
      this.storage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${this.key} to storage:`, error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded');
      }
    }
  }

  remove(): void {
    this.storage.removeItem(this.key);
  }

  clear(): void {
    this.storage.clear();
  }
}
```

**Usage:**

```typescript
interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

const preferencesStorage = new TypedStorage<UserPreferences>('user-preferences');

// Set preferences
preferencesStorage.set({
  theme: 'dark',
  language: 'en',
  notifications: true,
});

// Get preferences
const prefs = preferencesStorage.get();
console.log(prefs?.theme);

// Remove preferences
preferencesStorage.remove();
```

### Pattern 2: Storage with Versioning

**Versioned Storage:**

```typescript
// src/lib/versionedStorage.ts
interface StorageData<T> {
  version: number;
  data: T;
}

export class VersionedStorage<T> {
  constructor(
    private key: string,
    private currentVersion: number,
    private migrate?: (oldData: any, oldVersion: number) => T
  ) {}

  get(): T | null {
    try {
      const item = localStorage.getItem(this.key);
      if (!item) return null;

      const stored = JSON.parse(item) as StorageData<T>;

      // Check if migration needed
      if (stored.version < this.currentVersion && this.migrate) {
        const migratedData = this.migrate(stored.data, stored.version);
        this.set(migratedData);
        return migratedData;
      }

      return stored.data;
    } catch (error) {
      console.error(`Error reading ${this.key}:`, error);
      return null;
    }
  }

  set(data: T): void {
    const storageData: StorageData<T> = {
      version: this.currentVersion,
      data,
    };
    localStorage.setItem(this.key, JSON.stringify(storageData));
  }

  remove(): void {
    localStorage.removeItem(this.key);
  }
}
```

**Usage with Migration:**

```typescript
interface CartV1 {
  items: string[];
}

interface CartV2 {
  items: Array<{ id: string; quantity: number }>;
}

const cartStorage = new VersionedStorage<CartV2>(
  'shopping-cart',
  2, // Current version
  (oldData, oldVersion) => {
    if (oldVersion === 1) {
      // Migrate from V1 to V2
      const v1Data = oldData as CartV1;
      return {
        items: v1Data.items.map((id) => ({ id, quantity: 1 })),
      };
    }
    return oldData;
  }
);
```

### Pattern 3: React Hook for Storage

**useLocalStorage Hook:**

```typescript
// src/hooks/useLocalStorage.ts
'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage on mount
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update local storage when value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

**Usage:**

```typescript
"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

### Pattern 4: Storage with Expiration

**TTL Storage:**

```typescript
// src/lib/ttlStorage.ts
interface StorageWithTTL<T> {
  data: T;
  expiry: number;
}

export class TTLStorage<T> {
  constructor(private key: string) {}

  set(data: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    const item: StorageWithTTL<T> = { data, expiry };
    localStorage.setItem(this.key, JSON.stringify(item));
  }

  get(): T | null {
    try {
      const item = localStorage.getItem(this.key);
      if (!item) return null;

      const stored = JSON.parse(item) as StorageWithTTL<T>;

      // Check if expired
      if (Date.now() > stored.expiry) {
        this.remove();
        return null;
      }

      return stored.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  remove(): void {
    localStorage.removeItem(this.key);
  }
}
```

**Usage:**

```typescript
const cacheStorage = new TTLStorage<SearchResults>('search-cache');

// Cache for 5 minutes
cacheStorage.set(results, 5 * 60 * 1000);

// Get cached data (returns null if expired)
const cached = cacheStorage.get();
```

### Pattern 5: Sync Storage Across Tabs

**Cross-Tab Sync:**

```typescript
'use client';

import { useEffect, useState } from 'react';

export function useSyncedStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    // Initialize from storage
    const stored = localStorage.getItem(key);
    if (stored) {
      setValue(JSON.parse(stored));
    }

    // Listen for changes in other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue] as const;
}
```

## Storage Patterns by Use Case

### Shopping Cart

```typescript
interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

const cartStorage = new TypedStorage<CartItem[]>('cart');
```

### User Preferences

```typescript
interface Preferences {
  theme: 'light' | 'dark';
  language: string;
  currency: string;
}

const prefsStorage = new TypedStorage<Preferences>('preferences');
```

### Recent Searches

```typescript
interface RecentSearches {
  queries: string[];
  timestamp: number;
}

const searchStorage = new TTLStorage<RecentSearches>('recent-searches');
```

## Storage Checklist

When implementing storage:

- [ ] Use TypeScript for type safety
- [ ] Handle JSON parse errors
- [ ] Check for quota exceeded errors
- [ ] Implement versioning for migrations
- [ ] Consider TTL for cached data
- [ ] Sync across tabs if needed
- [ ] Clear sensitive data appropriately
- [ ] Test in private/incognito mode
- [ ] Handle storage not available
- [ ] Validate data when reading

## Best Practices

1. **Type Safety**: Always type your storage data
2. **Error Handling**: Wrap in try/catch
3. **Versioning**: Version your data structure
4. **Expiration**: Use TTL for temporary data
5. **Validation**: Validate data when reading
6. **Cleanup**: Clear old/unused data
7. **Security**: Never store sensitive data

## Anti-Patterns to Avoid

❌ **Storing sensitive data**

```typescript
localStorage.setItem('password', password); // Never!
```

❌ **No error handling**

```typescript
const data = JSON.parse(localStorage.getItem('data')!); // Can throw
```

❌ **No versioning**

```typescript
// Structure changes break existing data
```

❌ **Storing too much data**

```typescript
localStorage.setItem('huge', JSON.stringify(hugeArray)); // Quota exceeded
```

## Additional Resources

For more details:

- See `.claude/rules/local-storage-patterns.md` for complete patterns
- MDN Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
