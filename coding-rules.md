# TypeScript/Node.js Coding Rules

This document outlines the coding standards and best practices for TypeScript/Node.js development. These rules ensure code quality, maintainability, and security.

## Core Principles

- Always prioritize code readability and maintainability
- Follow TypeScript-first approach with strict type checking
- Implement security best practices from the start
- Use modern ES6+ features and async/await patterns
- Maintain consistent code style across the project

---

## Naming Conventions

### [TS-NAMING-001] Variable and Function Naming

**Rule**: Use camelCase for variables and functions.

**Severity**: Error

**Good Examples**:
```typescript
const firstName = 'John';
const calculateTotalPrice = (items: Item[]) => { ... };
```

**Bad Examples**:
```typescript
const FirstName = 'John';
const calculate_total_price = (items: Item[]) => { ... };
```

---

### [TS-NAMING-002] Class, Interface, and Type Naming

**Rule**: Use PascalCase for classes, interfaces, types, and enums.

**Severity**: Error

**Good Examples**:
```typescript
class UserService { ... }
interface ApiResponse { ... }
type DatabaseConfig = { ... };
enum UserRole { Admin, User, Guest }
```

**Bad Examples**:
```typescript
class userService { ... }
interface apiResponse { ... }
type database_config = { ... };
```

---

### [TS-NAMING-003] Constant Naming

**Rule**: Use UPPER_SNAKE_CASE for constants.

**Severity**: Warning

**Good Examples**:
```typescript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

**Bad Examples**:
```typescript
const maxRetryAttempts = 3;
const apiBaseUrl = 'https://api.example.com';
```

---

### [TS-NAMING-004] Boolean Variable Naming

**Rule**: Boolean variables must be prefixed with question words (is, has, can, should).

**Severity**: Warning

**Good Examples**:
```typescript
const isAuthenticated = true;
const hasPermission = false;
const canEdit = user.role === 'admin';
const shouldShowModal = !isCompleted;
```

**Bad Examples**:
```typescript
const authenticated = true;
const permission = false;
const edit = user.role === 'admin';
```

---

### [TS-NAMING-005] File and Folder Naming

**Rule**: Use kebab-case for files and folders.

**Severity**: Warning

**Good Examples**:
```
user-service.ts
api-client.ts
database-config.ts
```

**Bad Examples**:
```
UserService.ts
api_client.ts
databaseConfig.ts
```

---

## Type System

### [TS-TYPE-001] Explicit Function Type Annotations

**Rule**: Always provide explicit types for function parameters and return values.

**Severity**: Error

**Good Examples**:
```typescript
function processUser(id: string, options: UserOptions): Promise<User | null> {
  // Implementation
}
```

**Bad Examples**:
```typescript
function processUser(id, options) {
  // Implementation
}
```

---

### [TS-TYPE-002] Interface Design

**Rule**: Use interfaces for object shapes. Use readonly for immutable properties.

**Severity**: Warning

**Good Examples**:
```typescript
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
}
```

**Bad Examples**:
```typescript
type User = {
  id: string;
  name: string;
  email: string;
};
```

---

### [TS-TYPE-003] Generic Types Usage

**Rule**: Use generics for reusable code with type safety.

**Severity**: Warning

**Good Examples**:
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // Implementation
}
```

**Bad Examples**:
```typescript
interface ApiResponse {
  data: any;
  status: number;
  message: string;
}
```

---

### [TS-TYPE-004] Type Guards Implementation

**Rule**: Implement proper type guards for type narrowing.

**Severity**: Warning

**Good Examples**:
```typescript
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

**Bad Examples**:
```typescript
function isString(value: any) {
  return typeof value === 'string';
}
```

---

## Asynchronous Programming

### [TS-ASYNC-001] Use Async/Await Instead of Callbacks

**Rule**: Always use async/await pattern instead of callback functions for asynchronous operations.

**Severity**: Error

**Good Examples**:
```typescript
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

**Bad Examples**:
```typescript
function fetchUserData(id: string, callback: (error: Error | null, user?: User) => void) {
  fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(user => callback(null, user))
    .catch(error => callback(error));
}
```

---

### [TS-ASYNC-002] Proper Error Handling in Async Functions

**Rule**: Always use try-catch blocks in async functions and handle errors appropriately.

**Severity**: Error

**Good Examples**:
```typescript
async function fetchUserData(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
```

**Bad Examples**:
```typescript
async function fetchUserData(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return await response.json();
}
```

---

## Modern JavaScript Features

### [TS-MODERN-001] Optional Chaining

**Rule**: Use optional chaining for safe property access.

**Severity**: Warning

**Good Examples**:
```typescript
const city = user?.address?.city ?? 'Unknown';
```

**Bad Examples**:
```typescript
const city = user && user.address && user.address.city ? user.address.city : 'Unknown';
```

---

### [TS-MODERN-002] Nullish Coalescing

**Rule**: Use nullish coalescing operator for default values.

**Severity**: Warning

**Good Examples**:
```typescript
const maxRetries = config.retries ?? 3;
```

**Bad Examples**:
```typescript
const maxRetries = config.retries || 3;
```

---

### [TS-MODERN-003] Functional Array Methods

**Rule**: Use functional array methods (map, filter, reduce) instead of for loops.

**Severity**: Warning

**Good Examples**:
```typescript
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => ({ ...user, displayName: `${user.firstName} ${user.lastName}` }))
  .sort((a, b) => a.displayName.localeCompare(b.displayName));
```

**Bad Examples**:
```typescript
const activeUsers = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].isActive) {
    activeUsers.push({
      ...users[i],
      displayName: `${users[i].firstName} ${users[i].lastName}`
    });
  }
}
```

---

### [TS-MODERN-004] Object Destructuring

**Rule**: Use object destructuring for extracting properties.

**Severity**: Warning

**Good Examples**:
```typescript
const { name, email, ...otherProps } = user;
```

**Bad Examples**:
```typescript
const name = user.name;
const email = user.email;
```

---

### [TS-MODERN-005] Template Literals

**Rule**: Use template literals for string interpolation.

**Severity**: Warning

**Good Examples**:
```typescript
const message = `Welcome ${user.name}! You have ${unreadCount} unread messages.`;
```

**Bad Examples**:
```typescript
const message = 'Welcome ' + user.name + '! You have ' + unreadCount + ' unread messages.';
```

---

## Import and Export

### [TS-IMPORT-001] Import Organization

**Rule**: Organize imports by type: Node.js modules, third-party modules, then relative imports.

**Severity**: Warning

**Good Examples**:
```typescript
import { readFile, writeFile } from 'fs/promises';
import express from 'express';
import { config } from '../config';
```

**Bad Examples**:
```typescript
import { config } from '../config';
import { readFile, writeFile } from 'fs/promises';
import express from 'express';
```

---

### [TS-IMPORT-002] Named vs Default Exports

**Rule**: Use named exports for utilities and services, default exports for main classes or components.

**Severity**: Warning

**Good Examples**:
```typescript
// Named exports for utilities
export const userService = {
  fetchUser,
  createUser,
  updateUser,
  deleteUser
};

// Default export for main class
export default class UserController {
  // Implementation
}
```

**Bad Examples**:
```typescript
// Mixed usage without clear pattern
export default const userService = { ... };
```

---

## Functions

### [TS-FUNCTION-001] Pure Functions

**Rule**: Use pure functions when possible (no side effects, same input produces same output).

**Severity**: Warning

**Good Examples**:
```typescript
function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
```

**Bad Examples**:
```typescript
let lastFormattedValue: string;
function formatCurrency(amount: number): string {
  lastFormattedValue = amount.toFixed(2);
  return lastFormattedValue;
}
```

---

### [TS-FUNCTION-002] Function Length

**Rule**: Functions should be less than 50 lines. Break down complex functions into smaller ones.

**Severity**: Warning

**Good Examples**:
```typescript
function processUser(user: User): ProcessedUser {
  const validated = validateUser(user);
  const enriched = enrichUserData(validated);
  return formatUserOutput(enriched);
}
```

**Bad Examples**:
```typescript
function processUser(user: User): ProcessedUser {
  // 100+ lines of code doing everything
}
```

---

## Error Handling

### [TS-ERROR-001] Custom Error Classes

**Rule**: Use custom error classes that extend Error for domain-specific errors.

**Severity**: Warning

**Good Examples**:
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

**Bad Examples**:
```typescript
throw new Error('Validation failed');
throw new Error('Not found');
```

---

### [TS-ERROR-002] Input Validation

**Rule**: Use validation libraries like Zod for runtime type validation.

**Severity**: Error

**Good Examples**:
```typescript
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

**Bad Examples**:
```typescript
function validateUser(data: any): User {
  if (!data.name || !data.email) {
    throw new Error('Invalid user');
  }
  return data;
}
```

---

## Performance

### [TS-PERF-001] Dynamic Imports

**Rule**: Use dynamic imports for code splitting and lazy loading.

**Severity**: Warning

**Good Examples**:
```typescript
async function loadHeavyModule() {
  const { heavyFunction } = await import('./heavy-module');
  return heavyFunction();
}
```

**Bad Examples**:
```typescript
import { heavyFunction } from './heavy-module';
```

---

### [TS-PERF-002] Memoization

**Rule**: Use memoization for expensive computations that are called frequently.

**Severity**: Warning

**Good Examples**:
```typescript
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

**Bad Examples**:
```typescript
// No memoization for expensive recursive function
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

---

## Testing

### [TS-TEST-001] Test Structure

**Rule**: Use Arrange-Act-Assert pattern for test structure.

**Severity**: Warning

**Good Examples**:
```typescript
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

**Bad Examples**:
```typescript
it('test user fetch', async () => {
  const result = await userService.fetchUser('123');
  expect(result).toBeDefined();
});
```

---

### [TS-TEST-002] Type-Safe Mocks

**Rule**: Create type-safe mocks using jest.Mocked or similar utilities.

**Severity**: Warning

**Good Examples**:
```typescript
const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn()
};
```

**Bad Examples**:
```typescript
const mockUserRepository = {
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn()
};
```

---

## Security

### [TS-SECURITY-001] Input Sanitization

**Rule**: All user input must be sanitized before processing or rendering.

**Severity**: Error

**Good Examples**:
```typescript
import DOMPurify from 'dompurify';
import { escape } from 'html-escaper';

function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input);
}

function escapeHtml(input: string): string {
  return escape(input);
}
```

**Bad Examples**:
```typescript
element.innerHTML = userInput;
```

---

### [TS-SECURITY-002] Environment Variables

**Rule**: Use type-safe environment variable handling with validation.

**Severity**: Error

**Good Examples**:
```typescript
interface EnvironmentConfig {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly DATABASE_URL: string;
  readonly JWT_SECRET: string;
  readonly PORT: number;
}

function getConfig(): EnvironmentConfig {
  const config = {
    NODE_ENV: process.env.NODE_ENV as EnvironmentConfig['NODE_ENV'] || 'development',
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    PORT: parseInt(process.env.PORT || '3000', 10)
  };

  if (!config.DATABASE_URL || !config.JWT_SECRET) {
    throw new Error('Missing required environment variables');
  }

  return config;
}
```

**Bad Examples**:
```typescript
const dbUrl = process.env.DATABASE_URL;
const secret = process.env.JWT_SECRET;
```

---

### [TS-SECURITY-003] No Secrets in Code

**Rule**: Never hardcode secrets, API keys, or passwords in code.

**Severity**: Error

**Good Examples**:
```typescript
const apiKey = process.env.API_KEY;
```

**Bad Examples**:
```typescript
const apiKey = 'sk-1234567890abcdef';
```

---

## Logging

### [TS-LOGGING-001] Structured Logging

**Rule**: Use structured logging with proper log levels and context.

**Severity**: Warning

**Good Examples**:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  )
});

logger.info('User login attempt', { userId: user.id, ip: req.ip });
logger.error('Database connection failed', { error: error.message });
```

**Bad Examples**:
```typescript
console.log('User logged in');
console.log(error);
```

---

## Code Style

### [TS-STYLE-001] No Unused Variables

**Rule**: Remove or prefix unused variables with underscore.

**Severity**: Error

**Good Examples**:
```typescript
function processUser(user: User, _options: Options) {
  return user.name;
}
```

**Bad Examples**:
```typescript
function processUser(user: User, options: Options) {
  return user.name;
}
```

---

### [TS-STYLE-002] No Explicit Any

**Rule**: Avoid using explicit 'any' type. Use 'unknown' or proper types instead.

**Severity**: Error

**Good Examples**:
```typescript
function processData(data: unknown): User {
  if (isUser(data)) {
    return data;
  }
  throw new Error('Invalid data');
}
```

**Bad Examples**:
```typescript
function processData(data: any): User {
  return data;
}
```

---

### [TS-STYLE-003] Prefer Const

**Rule**: Use const for variables that are not reassigned.

**Severity**: Warning

**Good Examples**:
```typescript
const userName = 'John';
const maxRetries = 3;
```

**Bad Examples**:
```typescript
let userName = 'John';
let maxRetries = 3;
```

---

### [TS-STYLE-004] No Var Declaration

**Rule**: Never use var, always use const or let.

**Severity**: Error

**Good Examples**:
```typescript
const x = 10;
let y = 20;
```

**Bad Examples**:
```typescript
var x = 10;
var y = 20;
```

---

## Code Review Checklist

Before submitting code, ensure:

- [ ] All functions have proper type annotations ([TS-TYPE-001])
- [ ] Error handling is implemented appropriately ([TS-ASYNC-002], [TS-ERROR-001])
- [ ] Security vulnerabilities are addressed ([TS-SECURITY-001], [TS-SECURITY-002], [TS-SECURITY-003])
- [ ] Code is properly tested ([TS-TEST-001], [TS-TEST-002])
- [ ] Performance implications are considered ([TS-PERF-001], [TS-PERF-002])
- [ ] Naming conventions are followed ([TS-NAMING-001] through [TS-NAMING-005])
- [ ] No explicit 'any' types used ([TS-STYLE-002])
- [ ] Modern JavaScript patterns are used ([TS-MODERN-001] through [TS-MODERN-005])

---

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

**Note**: These rules serve as guidelines to improve code quality and maintainability. Use judgment when exceptions are necessary and document the reasoning behind any deviations.