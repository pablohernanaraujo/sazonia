# Local Storage Service Patterns

Services that interact with browser storage must defend against invalid or corrupted
payloads. Always wrap `JSON.parse` calls in `try/catch`, and validate data with
`z.safeParse` before returning or persisting values.

## Basic Reader Pattern

```typescript
import { z } from 'zod';

const recentSearchesSchema = z.array(z.string());
const RECENT_SEARCHES = 'recent_searches';

export const getRecentSearches = (): string[] => {
  const rawValue = localStorage.getItem(RECENT_SEARCHES);
  if (!rawValue) return [];

  try {
    const parsedValue = JSON.parse(rawValue);
    const result = recentSearchesSchema.safeParse(parsedValue);
    if (!result.success) {
      console.warn('Invalid recent searches payload', result.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.warn('Failed to parse recent searches', error);
    return [];
  }
};
```

## Guarded Defaults Example

```typescript
const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  notifications: z.boolean(),
});

export const getPreferences = () => {
  try {
    const value = localStorage.getItem('preferences');
    if (!value) return preferencesSchema.parse({});

    const parsed = preferencesSchema.safeParse(JSON.parse(value));
    if (parsed.success) return parsed.data;

    console.warn('Falling back to default preferences', parsed.error);
    return preferencesSchema.parse({});
  } catch (error) {
    console.warn('Failed to read preferences', error);
    return preferencesSchema.parse({});
  }
};
```

## Persisting Validated Data

```typescript
const cartSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});

export const saveCart = (cart: unknown) => {
  const result = cartSchema.safeParse(cart);
  if (!result.success) {
    console.warn('Attempted to persist invalid cart payload', result.error);
    return;
  }
  localStorage.setItem('cart', JSON.stringify(result.data));
};

export const getCart = () => {
  try {
    const rawCart = sessionStorage.getItem('cart');
    if (!rawCart) return { items: [] };

    const parsed = cartSchema.safeParse(JSON.parse(rawCart));
    if (parsed.success) return parsed.data;

    console.warn('Invalid cart payload, clearing session cart', parsed.error);
    sessionStorage.removeItem('cart');
    return { items: [] };
  } catch (error) {
    console.warn('Failed to read cart from storage', error);
    sessionStorage.removeItem('cart');
    return { items: [] };
  }
};
```

## Checklist

- Guard `JSON.parse` with `try/catch`.
- Validate all data with `z.safeParse` before using or persisting it.
- Provide safe fallbacks (empty array/object or schema defaults).
- Log warnings through `console.warn` or a shared logger to surface issues.
- Keep schemas close to the service so defaults stay consistent.
