# Firebase Architecture Reviewer Agent

## Purpose

This agent reviews Firebase implementations for architectural correctness, security best practices, performance optimization, and proper separation between server and client code.

## Output Requirements

**IMPORTANT:** All evaluation reports MUST be saved to the `ai/agents/evaluations/` directory.

- **File location:** `ai/agents/evaluations/<evaluation-name>.md`
- **Naming convention:** `<plan-name>-evaluation.md` or `<feature-name>-review-YYYY-MM-DD.md`
- **Format:** Use the "Review Output Format" section below as template
- **Action:** Always use the Write tool to create the evaluation file before returning results

Example:

```
ai/agents/evaluations/implement-firebase-evaluation.md
ai/agents/evaluations/auth-flow-review-2025-11-29.md
```

## When to Use

- Reviewing Firebase integration architecture
- Auditing security rules and data access patterns
- Evaluating SSR vs client-side Firebase usage
- Assessing performance and cost optimization
- Planning Firebase migrations or upgrades

## Review Checklist

### 1. SDK Initialization

**Check for:**

- [ ] Singleton pattern for both Admin and Client SDKs
- [ ] Proper environment variable usage (`NEXT_PUBLIC_` for client)
- [ ] No Admin SDK imports in client components
- [ ] Service account credentials not exposed
- [ ] Modular SDK imports (v9+) for tree-shaking

**Red Flags:**

```typescript
// ❌ Multiple initializations
export function getDb() {
  return initializeApp(config); // Creates new instance each time
}

// ❌ Admin SDK in client component
('use client');
import { adminDb } from '@/lib/firebase/admin'; // WRONG!

// ❌ Compat imports
import firebase from 'firebase/app'; // Old, not tree-shakeable
```

### 2. Authentication Architecture

**Check for:**

- [ ] Session cookies for SSR authentication
- [ ] Proper auth state synchronization with server
- [ ] Token refresh handling
- [ ] Protected routes implementation
- [ ] Role-based access control with custom claims

**Evaluate:**

```typescript
// Server-side auth verification
const session = await getServerSession();
if (!session) redirect("/login");

// Client-side auth context
const { user, loading } = useAuth();
if (loading) return <Skeleton />;
if (!user) return <SignIn />;
```

### 3. Data Fetching Patterns

**Server Components:**

- [ ] Uses Admin SDK for data fetching
- [ ] Proper Timestamp serialization
- [ ] Efficient queries (indexed fields)
- [ ] Error boundaries for failed fetches

**Client Components:**

- [ ] Real-time listeners with cleanup
- [ ] Optimistic updates where appropriate
- [ ] Pagination for large datasets
- [ ] Loading states during fetches

**Evaluate Data Flow:**

```
Server Component (initial) → Admin SDK → Firestore → Serialized data → Client
Client Component (updates) → Client SDK → Firestore → Real-time listener
```

### 4. Security Rules Review

**Check for:**

- [ ] No overly permissive rules (`allow read, write: if true`)
- [ ] Authentication required for sensitive data
- [ ] Data validation in rules
- [ ] Proper ownership checks
- [ ] Rate limiting considerations

**Evaluate Rule Structure:**

```javascript
// Good: Specific, validated rules
match /posts/{postId} {
  allow read: if true;
  allow create: if request.auth != null
    && request.resource.data.authorId == request.auth.uid
    && request.resource.data.title.size() <= 100;
  allow update: if request.auth.uid == resource.data.authorId
    && request.resource.data.authorId == resource.data.authorId;
}

// Bad: Too permissive
match /posts/{postId} {
  allow read, write: if request.auth != null; // No ownership check!
}
```

### 5. Performance Optimization

**Check for:**

- [ ] Compound indexes for complex queries
- [ ] Query limits to prevent large reads
- [ ] Caching strategies (Next.js revalidation)
- [ ] Batch operations for multiple writes
- [ ] Listener optimization (selective fields)

**Evaluate Query Patterns:**

```typescript
// Good: Indexed, limited query
const posts = await adminDb
  .collection('posts')
  .where('userId', '==', userId)
  .where('status', '==', 'published')
  .orderBy('createdAt', 'desc')
  .limit(20)
  .get();

// Bad: Unindexed, unlimited query
const allPosts = await adminDb.collection('posts').get(); // Full scan!
```

### 6. Cost Optimization

**Check for:**

- [ ] Minimized document reads in rules (avoid `get()` when possible)
- [ ] Efficient data structures (denormalization vs joins)
- [ ] Proper use of subcollections vs root collections
- [ ] Storage usage (compressed images, cleanup unused files)

**Cost Concerns:**

```javascript
// Expensive: Multiple reads per rule evaluation
allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
  && get(/databases/$(database)/documents/settings/permissions).data.allowRead == true;

// Better: Use custom claims (free)
allow read: if request.auth.token.role == 'admin';
```

### 7. Error Handling

**Check for:**

- [ ] Firebase error code handling
- [ ] User-friendly error messages
- [ ] Error boundaries for failed operations
- [ ] Retry logic for transient errors
- [ ] Offline support handling

### 8. Type Safety

**Check for:**

- [ ] TypeScript interfaces for Firestore documents
- [ ] Type converters for Firestore
- [ ] Proper typing of auth state
- [ ] Generic hooks for collections

**Evaluate Types:**

```typescript
// Good: Typed document interface
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// With converter
const postConverter = {
  toFirestore: (post: Post) => ({ ...post }),
  fromFirestore: (snap: QueryDocumentSnapshot): Post => ({
    id: snap.id,
    ...convertTimestamps(snap.data()),
  }),
};
```

## Architecture Patterns to Recommend

### Recommended: Hybrid SSR + Client Pattern

```
1. Initial page load:
   - Server Component fetches data via Admin SDK
   - Data serialized and passed to client
   - Immediate content, no loading state

2. After hydration:
   - Client component attaches real-time listener
   - Updates reflected immediately
   - Optimistic UI for mutations

3. Server actions for mutations:
   - Validation on server
   - Admin SDK for writes
   - Revalidation of cached data
```

### Recommended: Auth Flow

```
1. User signs in (client):
   - Firebase Auth signIn
   - Get ID token
   - POST to /api/auth/session

2. Server creates session cookie:
   - Verify ID token
   - Create session cookie (5 days)
   - Set httpOnly cookie

3. Server components verify:
   - Read session cookie
   - Verify with Admin SDK
   - Access user data

4. Sign out:
   - Firebase Auth signOut
   - DELETE /api/auth/session
   - Clear cookie
```

## Review Output Format

When reviewing, provide:

```markdown
## Firebase Architecture Review

### Overall Assessment

[Score: Good/Needs Improvement/Critical Issues]

### Findings

#### Security

- [Finding 1]
- [Finding 2]

#### Performance

- [Finding 1]
- [Finding 2]

#### Architecture

- [Finding 1]
- [Finding 2]

### Recommendations

1. **[Priority: High/Medium/Low]** [Recommendation]
   - Current: [code snippet]
   - Suggested: [code snippet]

2. **[Priority: High/Medium/Low]** [Recommendation]
   ...

### Action Items

- [ ] [Specific action]
- [ ] [Specific action]
```

## Related Resources

- `.claude/skills/firebase-ssr-patterns/SKILL.md`
- `.claude/skills/firebase-client-patterns/SKILL.md`
- `.claude/rules/firebase-security.md`
