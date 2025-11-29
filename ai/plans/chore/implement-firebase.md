# Chore: Implement Firebase

## Chore Description

Implement Firebase in the sazonia-web Next.js application. This includes setting up both the Firebase Client SDK for client-side operations (authentication, real-time listeners, file uploads) and the Firebase Admin SDK for server-side operations (SSR authentication, server actions, signed URLs). The implementation will follow the established patterns documented in the project's skills (`.claude/skills/firebase-*`) and security rules (`.claude/rules/firebase-security.md`).

## Relevant Files

Use these files to resolve the chore:

- `.claude/skills/firebase-client-patterns/SKILL.md` - Reference for client-side Firebase patterns including Auth Context, hooks for collections/documents, and file uploads
- `.claude/skills/firebase-ssr-patterns/SKILL.md` - Reference for server-side Firebase patterns including Admin SDK setup, session management, and server actions
- `.claude/skills/firebase-firestore-advanced/SKILL.md` - Reference for advanced Firestore patterns
- `.claude/skills/firebase-storage-patterns/SKILL.md` - Reference for storage patterns and file upload hooks
- `.claude/rules/firebase-security.md` - Reference for security rules patterns
- `src/app/layout.tsx` - Root layout where AuthProvider will be wrapped
- `package.json` - Add Firebase dependencies

### New Files

The following new files will be created:

**Core Firebase Setup:**

- `src/lib/firebase/client.ts` - Firebase client SDK initialization (singleton)
- `src/lib/firebase/admin.ts` - Firebase Admin SDK initialization (singleton)
- `src/lib/firebase/errors.ts` - Firebase error handling utilities
- `src/lib/firebase/types.ts` - Common TypeScript interfaces for Firebase entities
- `src/lib/firebase/index.ts` - Barrel exports for cleaner imports

**Authentication:**

- `src/contexts/AuthContext.tsx` - Auth context provider with all auth methods
- `src/lib/firebase/auth-server.ts` - Server-side auth utilities (session verification)
- `src/app/api/auth/session/route.ts` - API route for session cookie management

**Firestore:**

- `src/lib/firebase/firestore-server.ts` - Server-side Firestore utilities with converters, batch ops, and transactions

**Storage:**

- `src/lib/firebase/storage.ts` - Client storage utilities
- `src/lib/firebase/storage-server.ts` - Server storage utilities (signed URLs, deletion, metadata)

**Hooks:**

- `src/hooks/useCollection.ts` - Real-time collection listener hook with query constraints
- `src/hooks/useDocument.ts` - Real-time document listener hook with enabled option
- `src/hooks/useAddDocument.ts` - Hook for adding documents with optimistic updates
- `src/hooks/useUpdateDocument.ts` - Hook for updating documents with optimistic updates
- `src/hooks/useDeleteDocument.ts` - Hook for deleting documents with optimistic updates
- `src/hooks/usePaginatedCollection.ts` - Cursor-based pagination hook
- `src/hooks/useFileUpload.ts` - File upload hook with progress tracking
- `src/hooks/index.ts` - Barrel exports for hooks

**Components:**

- `src/components/firebase/FirebaseErrorBoundary.tsx` - Error boundary for Firebase errors

**Middleware:**

- `src/middleware.ts` - Route protection middleware

**Security Rules:**

- `firestore.rules` - Firestore security rules with user ownership validation
- `storage.rules` - Storage security rules with file type and size restrictions

**Environment:**

- `.env.local.example` - Example environment variables file

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### 1. Install Firebase Dependencies

- Install `firebase` package for client-side SDK
- Install `firebase-admin` package for server-side SDK

```bash
npm install firebase firebase-admin
```

### 2. Create Environment Variables Example File and Update .gitignore

- Create `.env.local.example` with all required Firebase environment variables
- Include both client-side (`NEXT_PUBLIC_*`) and server-side variables
- Document each variable with comments
- **Update `.gitignore`** to ensure `.env.local` is excluded (prevent credential exposure)

Required variables:

```
# Client-side Firebase config (public)
# Get these values from Firebase Console > Project Settings > General > Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Server-side Firebase Admin config (private)
# Get these values from Firebase Console > Project Settings > Service Accounts > Generate new private key
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

**Getting Firebase Credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. For client config: Project Settings > General > Your apps > Web app
4. For admin config: Project Settings > Service Accounts > Generate new private key

### 3. Create TypeScript Types File

- Create `src/lib/firebase/types.ts`
- Define common interfaces: `FirebaseUser`, `DocumentWithId`, `CollectionQueryOptions`
- Define Firestore document base types with `id`, `createdAt`, `updatedAt`
- Include utility types for query constraints and pagination

### 4. Create Firebase Client SDK Initialization

- Create `src/lib/firebase/client.ts`
- Implement singleton pattern to prevent multiple initializations
- Export typed instances of `auth`, `db`, `storage`, and `app`
- Configure offline persistence with `enableIndexedDbPersistence` for better offline experience
- Follow the pattern from `.claude/skills/firebase-client-patterns/SKILL.md`

### 5. Create Firebase Admin SDK Initialization

- Create `src/lib/firebase/admin.ts`
- Implement singleton pattern with `getApps()` check
- Handle private key newline escaping (`\n` to actual newlines)
- Export `adminAuth`, `adminDb`, `adminStorage`
- Follow the pattern from `.claude/skills/firebase-ssr-patterns/SKILL.md`
- **Note:** Admin SDK cannot run in Edge runtime; middleware should only check cookie presence

### 6. Create Firebase Error Handling Utilities

- Create `src/lib/firebase/errors.ts`
- Map Firebase error codes to user-friendly messages
- Include auth errors, Firestore errors, and storage errors
- Export `getFirebaseErrorMessage` and `isFirebaseError` utilities

### 7. Create Auth Context Provider

- Create `src/contexts/AuthContext.tsx`
- Implement `AuthProvider` component with auth state management
- Include methods: `signIn`, `signUp`, `signOut`, `signInWithGoogle`, `resetPassword`, `updateUserProfile`
- Use `onAuthStateChanged` for reactive auth state
- Sync session cookie with server on auth state change
- Export `useAuth` hook for consuming auth context
- Mark as `"use client"` component

### 8. Create Server-Side Auth Utilities

- Create `src/lib/firebase/auth-server.ts`
- Implement `getServerSession()` to verify session cookies
- Implement `getCurrentUser()` to get full user data
- Use `await cookies()` from `next/headers` for cookie access (Next.js 15+ async API)
- Handle session verification errors gracefully

### 9. Create Session Cookie API Route

- Create `src/app/api/auth/session/route.ts`
- Implement POST handler to create session cookie from ID token
- Implement DELETE handler to clear session cookie
- Verify ID token recency (5 minutes) before creating session
- Set secure cookie options (httpOnly, secure in production, sameSite)
- **CRITICAL:** Use `await cookies()` consistently (Next.js 15+ async API)

### 10. Create Server-Side Firestore Utilities

- Create `src/lib/firebase/firestore-server.ts`
- Implement Timestamp to Date conversion utility (`timestampToDate`, `dateToTimestamp`)
- Create type-safe document converter with generics
- Export common query builder functions
- Include batch write utilities for multiple document operations
- Include transaction helpers for atomic operations
- Use `revalidatePath` for cache invalidation after mutations

### 11. Create Storage Utilities

- Create `src/lib/firebase/storage.ts` for client-side storage reference helper
- Create `src/lib/firebase/storage-server.ts` for server-side operations:
  - Signed URL generation with expiration options
  - File deletion by path
  - File metadata retrieval and updates
  - Directory listing utilities
  - File existence checks

### 12. Create React Hooks for Firestore

- Create `src/hooks/useCollection.ts`:
  - Real-time collection listener with query constraints
  - Accept query constraints array for customization
  - Implement proper cleanup on unmount

- Create `src/hooks/useDocument.ts`:
  - Real-time single document listener
  - Include `enabled` option to conditionally enable/disable
  - Handle document not found states

- Create `src/hooks/useAddDocument.ts`:
  - Hook for adding documents to a collection
  - Support optimistic updates
  - Handle loading and error states

- Create `src/hooks/useUpdateDocument.ts`:
  - Hook for updating existing documents
  - Support optimistic updates
  - Handle loading and error states

- Create `src/hooks/useDeleteDocument.ts`:
  - Hook for deleting documents
  - Support optimistic updates with undo capability
  - Handle loading and error states

- Create `src/hooks/usePaginatedCollection.ts`:
  - Cursor-based pagination for infinite scroll
  - Use `startAfter()` for efficient pagination (not offset)
  - Include `loadMore`, `hasMore`, and `isLoadingMore` states
  - Always use `limit()` for query optimization

- All hooks should handle loading, error states, and cleanup

### 13. Create File Upload Hook

- Create `src/hooks/useFileUpload.ts`
- Implement upload progress tracking (0-100%)
- Handle upload states (idle, uploading, success, error, paused)
- Include pause/resume capability
- Include file deletion capability
- Support client-side image compression before upload
- Follow pattern from `.claude/skills/firebase-storage-patterns/SKILL.md`

### 14. Create Barrel Exports

- Create `src/lib/firebase/index.ts` - Export all Firebase utilities
- Create `src/hooks/index.ts` - Export all hooks
- Enable cleaner imports: `import { useCollection, useDocument } from '@/hooks'`

### 15. Create Firebase Error Boundary Component

- Create `src/components/firebase/FirebaseErrorBoundary.tsx`
- Wrap Firebase-dependent components for graceful error handling
- Display user-friendly error messages
- Include retry functionality
- Follow pattern from `.claude/skills/firebase-client-patterns/SKILL.md`

### 16. Create Security Rules Files

- Create `firestore.rules`:
  - Basic CRUD rules with user ownership validation
  - User documents only accessible by owner
  - Require authentication for all operations
  - Include field validation rules

- Create `storage.rules`:
  - File upload validation with type restrictions (images, documents)
  - File size limits (e.g., 5MB for images, 10MB for documents)
  - User-based path restrictions
  - Include content type validation

**Note:** Deploy rules separately using Firebase CLI: `firebase deploy --only firestore:rules,storage`

### 17. Create Route Protection Middleware

- Create `src/middleware.ts`
- Define protected routes that require authentication
- Define auth routes that should redirect authenticated users
- Check for session cookie presence (lightweight check only)
- Full token verification happens in server components/actions
- Configure matcher to exclude static files
- **Note:** Edge runtime limitations prevent Admin SDK usage in middleware

### 18. Update Root Layout with AuthProvider

- Modify `src/app/layout.tsx`
- Wrap children with `AuthProvider`
- Import AuthProvider from contexts

### 19. Run Validation Commands

- Run type checking to ensure no TypeScript errors
- Run build to verify successful compilation
- Run tests to ensure no regressions

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- Run TypeScript type checking:

  ```bash
  npm run type-check
  ```

- Run the build to verify compilation:

  ```bash
  npm run build
  ```

- Run tests to verify no regressions:

  ```bash
  npm run test:run
  ```

- Run linting:
  ```bash
  npm run lint
  ```

## Notes

### Configuration

- The actual Firebase project configuration values must be obtained from the Firebase Console and added to `.env.local` (not committed to git)
- The Firebase Admin private key should be stored securely and never exposed in client code
- Session cookies are set with `__session` as the name - this is Firebase Hosting's reserved cookie name that passes through CDN

### Next.js 15+ Compatibility

- **CRITICAL:** Always use `await cookies()` and `await headers()` - these APIs are async in Next.js 15+
- Server actions must include `"use server"` directive at the top of the file
- Edge runtime (middleware) cannot use Firebase Admin SDK - only check cookie presence
- Full token verification must happen in server components or API routes (Node.js runtime)

### Architecture

- The middleware only checks for cookie presence; full token verification happens in server components/actions
- Real-time listeners (useCollection, useDocument) automatically clean up on component unmount
- All client-side Firebase code must be in `"use client"` components
- The Admin SDK is only imported in server-side code (server components, API routes, server actions)
- Use `revalidatePath` in server actions to invalidate Next.js cache after mutations

### Performance

- Always use `limit()` in Firestore queries
- Prefer `startAfter()` over `offset()` for pagination
- Consider creating Firestore composite indexes for complex queries
- Use real-time listeners sparingly - prefer one-time reads when real-time updates aren't needed
- Modular imports (v9+ SDK) enable tree-shaking for smaller bundles

### Security

- Security rules should be deployed to Firebase separately using Firebase CLI
- Firestore rules: Validate user ownership, require authentication, validate field types
- Storage rules: Validate file types, enforce size limits, restrict paths by user
- Never commit `.env.local` - ensure it's in `.gitignore`

### Future Considerations

- Consider adding Firebase Emulator configuration for local development in a future task
- Consider Storybook stories for auth components
- Consider loading skeleton components for auth states
