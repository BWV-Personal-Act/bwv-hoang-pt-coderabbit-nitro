# TypeScript/Node.js Coding Rules

This document outlines the coding standards and best practices for TypeScript/Node.js development. These rules ensure code quality, maintainability, and security.

## Core Principles

- Always prioritize code readability and maintainability
- Follow TypeScript-first approach with strict type checking
- Implement security best practices from the start
- Use modern ES6+ features and async/await patterns
- Maintain consistent code style across the project

## 1. Naming Conventions

### 1.1 Variable Naming
```typescript
// Use camelCase for variables and functions
const firstName = 'John';
const calculateTotalPrice = (items: Item[]) => { ... };

// Use PascalCase for classes, interfaces, types, and enums
class UserService { ... }
interface ApiResponse { ... }
type DatabaseConfig = { ... };
enum UserRole { Admin, User, Guest }

// Use UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

### 1.2 Boolean Variables
```typescript
// Prefix with question words
const isAuthenticated = true;
const hasPermission = false;
const canEdit = user.role === 'admin';
const shouldShowModal = !isCompleted;
```

### 1.3 File and Folder Naming
```typescript
// Use kebab-case for files
user-service.ts
api-client.ts
database-config.ts

// Use PascalCase for component files (if using React/Vue)
UserProfile.tsx
PaymentForm.vue
```

## 2. Type Safety and TypeScript Best Practices

### 2.1 Strict Type Annotations
```typescript
// Always provide explicit types for function parameters and return values
function processUser(id: string, options: UserOptions): Promise<User | null> {
  // Implementation
}

// Use type assertions sparingly and safely
const userElement = document.getElementById('user') as HTMLDivElement;
```

### 2.2 Interface Design
```typescript
// Use interfaces for object shapes
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date; // Optional properties with ?
}

// Extend interfaces when needed
interface AdminUser extends User {
  permissions: Permission[];
  lastLogin: Date;
}
```

### 2.3 Generic Types
```typescript
// Use generics for reusable code
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // Implementation
}
```

### 2.4 Union Types and Type Guards
```typescript
// Use union types for multiple possible types
type Status = 'pending' | 'approved' | 'rejected';

// Implement type guards
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'name' in obj;
}
```

## 3. Modern JavaScript/TypeScript Patterns

### 3.1 Async/Await and Error Handling
```typescript
// Always use async/await instead of callbacks
async function fetchUserData(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
```

### 3.2 Optional Chaining and Nullish Coalescing
```typescript
// Use optional chaining for safe property access
const city = user?.address?.city ?? 'Unknown';

// Use nullish coalescing for default values
const maxRetries = config.retries ?? 3;
```

### 3.3 Array and Object Methods
```typescript
// Use functional array methods
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => ({ ...user, displayName: `${user.firstName} ${user.lastName}` }))
  .sort((a, b) => a.displayName.localeCompare(b.displayName));

// Use object destructuring
const { name, email, ...otherProps } = user;
```

### 3.4 Template Literals
```typescript
// Use template literals for string interpolation
const message = `Welcome ${user.name}! You have ${unreadCount} unread messages.`;
```

## 4. Code Structure and Organization

### 4.1 Import/Export Patterns
```typescript
// Use named exports for utilities and services
export const userService = {
  fetchUser,
  createUser,
  updateUser,
  deleteUser
};

// Use default exports for main classes or components
export default class UserController {
  // Implementation
}

// Import organization
import { readFile, writeFile } from 'fs/promises'; // Node.js modules
import express from 'express'; // Third-party modules
import { config } from '../config'; // Relative imports
```

### 4.2 Function Organization
```typescript
// Prefer function declarations for main functions
function calculateTax(amount: number, rate: number): number {
  return amount * rate;
}

// Use arrow functions for callbacks and short functions
const processItems = (items: Item[]) => items.map(item => processItem(item));

// Use pure functions when possible
function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
```

## 5. Error Handling and Validation

### 5.1 Custom Error Classes
```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

### 5.2 Input Validation
```typescript
// Use libraries like Zod for runtime validation
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150).optional()
});

function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}
```

## 6. Performance and Optimization

### 6.1 Lazy Loading and Dynamic Imports
```typescript
// Dynamic imports for code splitting
async function loadHeavyModule() {
  const { heavyFunction } = await import('./heavy-module');
  return heavyFunction();
}
```

### 6.2 Memoization
```typescript
// Simple memoization for expensive computations
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};
```

## 7. Testing Best Practices

### 7.1 Test Structure
```typescript
// Use descriptive test names
describe('UserService', () => {
  describe('fetchUser', () => {
    it('should return user when valid id is provided', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, name: 'John Doe' };
      
      // Act
      const result = await userService.fetchUser(userId);
      
      // Assert
      expect(result).toEqual(expectedUser);
    });
  });
});
```

### 7.2 Mock Implementation
```typescript
// Create type-safe mocks
const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn()
};
```

## 8. Security Guidelines

### 8.1 Input Sanitization
```typescript
import DOMPurify from 'dompurify';
import { escape } from 'html-escaper';

// Sanitize HTML input
function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input);
}

// Escape HTML entities
function escapeHtml(input: string): string {
  return escape(input);
}
```

### 8.2 Environment Variables
```typescript
// Use type-safe environment variable handling
interface EnvironmentConfig {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly DATABASE_URL: string;
  readonly JWT_SECRET: string;
  readonly PORT: number;
}

function getConfig(): EnvironmentConfig {
  return {
    NODE_ENV: process.env.NODE_ENV as EnvironmentConfig['NODE_ENV'] || 'development',
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    PORT: parseInt(process.env.PORT || '3000', 10)
  };
}
```

## 9. Logging and Monitoring

### 9.1 Structured Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('User login attempt', { userId: user.id, ip: req.ip });
logger.error('Database connection failed', { error: error.message });
```

## 10. ESLint and Prettier Configuration

### 10.1 ESLint Rules
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "prefer-const": "error",
    "no-var": "error",
    "max-lines": ["error", { "max": 500 }],
    "max-complexity": ["error", 10]
  }
}
```

### 10.2 TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## 11. Code Review Checklist

Before submitting code, ensure:
- [ ] All functions have proper type annotations
- [ ] Error handling is implemented appropriately
- [ ] Security vulnerabilities are addressed
- [ ] Code is properly tested
- [ ] Performance implications are considered
- [ ] Documentation is updated
- [ ] Linting and formatting rules pass

## 12. Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

Remember: These rules serve as guidelines to improve code quality and maintainability. Use judgment when exceptions are necessary and document the reasoning behind any deviations.