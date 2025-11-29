# Firebase Security Rules & Best Practices

This document provides security rules patterns, best practices, and guidelines for Firebase Security Rules (Firestore, Storage, and Realtime Database).

## When This Rule Applies

- Writing or modifying Firebase Security Rules
- Designing data structures for Firestore
- Implementing file upload features
- Reviewing Firebase security configurations
- Setting up multi-tenant applications

## Firestore Security Rules

### Basic Structure

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Rules go here
  }
}
```

### Pattern 1: User-Owned Documents

Documents that belong to a specific user:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - user can only read/write their own
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User's private documents
    match /documents/{docId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;

      // For creating new documents
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### Pattern 2: Public Read, Authenticated Write

Content visible to all but only editable by auth users:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      // Anyone can read
      allow read: if true;

      // Only authenticated users can create
      allow create: if request.auth != null
        && request.resource.data.authorId == request.auth.uid;

      // Only author can update/delete
      allow update, delete: if request.auth != null
        && resource.data.authorId == request.auth.uid;
    }
  }
}
```

### Pattern 3: Role-Based Access Control (RBAC)

Using custom claims for roles:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check admin role
    function isAdmin() {
      return request.auth != null
        && request.auth.token.role == 'admin';
    }

    // Helper function to check moderator role
    function isModerator() {
      return request.auth != null
        && (request.auth.token.role == 'admin'
            || request.auth.token.role == 'moderator');
    }

    // Admin-only collection
    match /adminSettings/{docId} {
      allow read, write: if isAdmin();
    }

    // Moderator-accessible content
    match /reports/{reportId} {
      allow read, write: if isModerator();
    }

    // Regular users can read, moderators can write
    match /content/{contentId} {
      allow read: if request.auth != null;
      allow write: if isModerator();
    }
  }
}
```

### Pattern 4: Data Validation

Validate data structure and content:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      // Validate post structure
      function isValidPost() {
        let data = request.resource.data;
        return data.keys().hasAll(['title', 'content', 'authorId', 'createdAt'])
          && data.title is string
          && data.title.size() >= 1
          && data.title.size() <= 100
          && data.content is string
          && data.content.size() <= 10000
          && data.authorId == request.auth.uid
          && data.createdAt == request.time;
      }

      // Validate update doesn't change immutable fields
      function isValidUpdate() {
        let data = request.resource.data;
        let oldData = resource.data;
        return data.authorId == oldData.authorId
          && data.createdAt == oldData.createdAt
          && data.diff(oldData).affectedKeys().hasOnly(['title', 'content', 'updatedAt']);
      }

      allow read: if true;
      allow create: if request.auth != null && isValidPost();
      allow update: if request.auth != null
        && resource.data.authorId == request.auth.uid
        && isValidUpdate();
      allow delete: if request.auth != null
        && resource.data.authorId == request.auth.uid;
    }
  }
}
```

### Pattern 5: Subcollections

Handling nested data:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Parent document
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null
        && resource.data.authorId == request.auth.uid;

      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;

        // Anyone authenticated can comment
        allow create: if request.auth != null
          && request.resource.data.authorId == request.auth.uid
          && request.resource.data.content.size() <= 1000;

        // Only comment author can edit/delete
        allow update, delete: if request.auth != null
          && resource.data.authorId == request.auth.uid;
      }

      // Likes subcollection (one per user)
      match /likes/{likeId} {
        allow read: if true;
        allow create, delete: if request.auth != null
          && likeId == request.auth.uid;
      }
    }
  }
}
```

### Pattern 6: Rate Limiting with Timestamps

Prevent abuse with time-based rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      // User can only create one post per minute
      function canCreatePost() {
        let recentPosts = getAfter(/databases/$(database)/documents/userMeta/$(request.auth.uid)).data.lastPostTime;
        return recentPosts == null
          || request.time > recentPosts + duration.value(60, 's');
      }

      allow create: if request.auth != null && canCreatePost();
    }

    // Track user metadata for rate limiting
    match /userMeta/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId
        && request.resource.data.keys().hasOnly(['lastPostTime'])
        && request.resource.data.lastPostTime == request.time;
    }
  }
}
```

### Pattern 7: Multi-Tenant Application

Organization-based access:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper to check org membership
    function isOrgMember(orgId) {
      return request.auth != null
        && exists(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
    }

    // Helper to check org admin
    function isOrgAdmin(orgId) {
      return request.auth != null
        && get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid)).data.role == 'admin';
    }

    // Organization settings
    match /organizations/{orgId} {
      allow read: if isOrgMember(orgId);
      allow write: if isOrgAdmin(orgId);

      // Organization members
      match /members/{memberId} {
        allow read: if isOrgMember(orgId);
        allow write: if isOrgAdmin(orgId);
      }

      // Organization projects
      match /projects/{projectId} {
        allow read: if isOrgMember(orgId);
        allow create: if isOrgMember(orgId);
        allow update, delete: if isOrgAdmin(orgId)
          || resource.data.ownerId == request.auth.uid;
      }
    }
  }
}
```

## Firebase Storage Security Rules

### Basic Structure

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Rules go here
  }
}
```

### Pattern 1: User File Storage

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // User's private files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

### Pattern 2: Validated Uploads

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{fileName} {
      // Only allow image uploads under 5MB
      allow read: if request.auth != null;

      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024  // 5MB
        && request.resource.contentType.matches('image/.*');
    }

    // Profile pictures with specific naming
    match /profiles/{userId}/avatar.{ext} {
      allow read: if true;  // Public profile pics

      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 1 * 1024 * 1024  // 1MB
        && request.resource.contentType.matches('image/(png|jpeg|jpg|webp)')
        && ext.matches('png|jpg|jpeg|webp');
    }
  }
}
```

### Pattern 3: Document Attachments

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{docId}/{fileName} {
      // Check if user owns the Firestore document
      function ownsDocument() {
        return firestore.get(/databases/(default)/documents/documents/$(docId)).data.userId == request.auth.uid;
      }

      allow read: if request.auth != null && ownsDocument();

      allow write: if request.auth != null
        && ownsDocument()
        && request.resource.size < 10 * 1024 * 1024  // 10MB
        && request.resource.contentType.matches('application/pdf|image/.*');
    }
  }
}
```

## Security Checklist

### Authentication Rules

- [ ] Never allow unauthenticated access to sensitive data
- [ ] Always verify `request.auth != null` for protected resources
- [ ] Use `request.auth.uid` for user-specific access
- [ ] Implement role-based access with custom claims
- [ ] Validate email verification when required: `request.auth.token.email_verified`

### Data Validation

- [ ] Validate required fields exist with `hasAll()`
- [ ] Check field types (`is string`, `is number`, etc.)
- [ ] Enforce string length limits
- [ ] Validate enum values with `in ['value1', 'value2']`
- [ ] Prevent modification of immutable fields
- [ ] Use `request.time` for server timestamps

### Access Patterns

- [ ] Implement principle of least privilege
- [ ] Use `get()` carefully (adds read operations)
- [ ] Avoid wildcards `{document=**}` for write operations
- [ ] Test rules with Firebase Emulator
- [ ] Document all security rules

### Storage Rules

- [ ] Always validate file size limits
- [ ] Validate content types strictly
- [ ] Restrict file extensions when needed
- [ ] Scope uploads to user directories
- [ ] Never allow public write access

## Common Security Mistakes

### ❌ Overly Permissive Rules

```javascript
// NEVER DO THIS
match /{document=**} {
  allow read, write: if true;
}
```

### ❌ Missing Auth Check

```javascript
// WRONG - anyone can read
match /users/{userId} {
  allow read: if resource.data.userId == userId;
}

// CORRECT
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
}
```

### ❌ Not Validating Create vs Update

```javascript
// WRONG - allows changing authorId
match /posts/{postId} {
  allow write: if request.auth.uid == request.resource.data.authorId;
}

// CORRECT - separate create and update
match /posts/{postId} {
  allow create: if request.auth.uid == request.resource.data.authorId;
  allow update: if request.auth.uid == resource.data.authorId
    && request.resource.data.authorId == resource.data.authorId;
}
```

### ❌ Trusting Client-Provided Data

```javascript
// WRONG - client can set any timestamp
allow create: if request.resource.data.createdAt is timestamp;

// CORRECT - must be server time
allow create: if request.resource.data.createdAt == request.time;
```

### ❌ Not Limiting Query Scope

```javascript
// WRONG - allows reading entire collection
match /posts/{postId} {
  allow read: if request.auth != null;
}

// BETTER - require query filters
match /posts/{postId} {
  allow read: if request.auth != null
    && (resource.data.public == true
        || resource.data.authorId == request.auth.uid);
}
```

## Testing Security Rules

### Firebase Emulator

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulator with rules
firebase emulators:start --only firestore,storage

# Run tests against emulator
npm test
```

### Unit Test Example

```typescript
// tests/firestore.rules.test.ts
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'test-project',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('User documents', () => {
  it('allows users to read their own document', async () => {
    const userId = 'user123';
    const context = testEnv.authenticatedContext(userId);
    const db = context.firestore();

    await assertSucceeds(getDoc(doc(db, 'users', userId)));
  });

  it('denies users from reading other users documents', async () => {
    const context = testEnv.authenticatedContext('user123');
    const db = context.firestore();

    await assertFails(getDoc(doc(db, 'users', 'otherUser')));
  });

  it('denies unauthenticated access', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();

    await assertFails(getDoc(doc(db, 'users', 'anyUser')));
  });
});
```

## Environment-Specific Rules

### Development vs Production

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Use environment variable in deployment
    function isDevelopment() {
      // Set via Firebase config
      return false; // Change for production
    }

    match /debug/{docId} {
      // Only available in development
      allow read, write: if isDevelopment();
    }
  }
}
```

## Additional Resources

- See `.claude/skills/firebase-ssr-patterns/SKILL.md` for server patterns
- See `.claude/skills/firebase-client-patterns/SKILL.md` for client patterns
- Firebase Security Rules docs: https://firebase.google.com/docs/rules
- Rules Playground: https://console.firebase.google.com/project/_/firestore/rules
