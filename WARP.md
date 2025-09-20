# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MongoDBWeb is a modern Next.js 14 based web interface for MongoDB databases. It provides a comprehensive GUI for browsing databases, collections, and documents with full CRUD operations, similar to MongoDB Compass but web-based. The application uses modern React 18, TypeScript 5, Apollo Client 3, and Zustand for state management.

## Development Commands

### Core Development
```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Export static files (build + export)
npm run export
```

### Code Quality
```bash
# Format all files (TypeScript, JSON, CSS, Markdown)
npm run format

# Check formatting without making changes
npm run format:check

# Lint TypeScript files (using ESLint)
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Type checking without emitting files
npm run type-check
```

### GraphQL Code Generation
```bash
# Generate GraphQL types and client code (run when schema changes)
npm run codegen

# Watch mode for GraphQL generation during development
npm run codegen:watch
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Database Setup
```bash
# Start MongoDB using Docker Compose
docker-compose up -d

# Stop MongoDB container
docker-compose down
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript 5, TailwindCSS 3
- **Backend**: Apollo Server 4 (GraphQL API)
- **Database**: MongoDB 6+ (via native MongoDB driver)
- **State Management**: Zustand (modern alternative to Context API)
- **Styling**: TailwindCSS with CSS Variables for theming
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Hot Toast

### Modern Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Next.js pages and API routes
│   └── api/       # GraphQL API endpoint
├── lib/           # Utility libraries (Apollo, store)
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── graphql/       # GraphQL operations
├── generated/     # Auto-generated GraphQL types
└── styles/        # Global styles and CSS
```

### Key Architecture Components

#### GraphQL API Layer
- **Location**: `src/pages/api/graphql.ts`
- **Technology**: Apollo Server 4 with Next.js integration
- **Schema**: Schema-first approach with GraphQL SDL
- **Operations**: 
  - Queries: checkServer, listDatabases, listCollections, query (documents)
  - Mutations: addServer, create, update, delete documents
- **Features**: Proper error handling, connection management, type safety

#### Client-Side Data Layer
- **Apollo Client**: Modern setup in `src/lib/apollo-client.ts`
- **GraphQL Operations**: Defined in `src/graphql/operations.ts`
- **Code Generation**: Uses GraphQL Code Generator client preset
- **Generated Types**: Auto-generated in `src/generated/`
- **Cache Management**: InMemoryCache with proper type policies

#### State Management
- **Store**: Zustand-based store in `src/lib/store.ts`
- **Features**: 
  - Server management (add, remove, set active)
  - Tab management (add, remove, set active)
  - UI state (loading, error handling)
  - Persistence with localStorage
  - DevTools integration
- **Benefits**: Better TypeScript support, less boilerplate than Context API

#### UI Architecture
- **Design System**: Custom components with consistent styling
- **Theming**: CSS variables for light/dark mode support
- **Responsive**: Mobile-first design with TailwindCSS
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for smooth transitions

### Data Flow
1. User adds MongoDB connection URI → stored in localStorage
2. App connects to MongoDB via GraphQL resolver
3. User selects database/collection → opens new tab in CollectionViewer
4. Document operations (CRUD) → GraphQL mutations → MongoDB operations
5. Results displayed in JSON editor with syntax highlighting

## Key Development Patterns

### Adding New MongoDB Operations
1. Update GraphQL schema in `src/pages/api/graphql.ts` (typeDefs and resolvers)
2. Create GraphQL operations in `src/graphql/operations.ts`
3. Run `npm run codegen` to generate TypeScript types
4. Use generated functions with Apollo Client hooks in components
5. Update Zustand store if new state management is needed

### State Management with Zustand
- **Store Location**: `src/lib/store.ts`
- **Usage**: Import `useAppStore` hook in components
- **Benefits**: Type-safe, minimal boilerplate, excellent DevTools
- **Persistence**: Automatically syncs selected state to localStorage
- **Patterns**: Use selectors for optimal re-renders

### Modern Component Patterns
- **Location**: `src/components/` directory
- **Structure**: One component per file with co-located types
- **Styling**: TailwindCSS with `cn()` utility for class merging
- **Props**: Use proper TypeScript interfaces extending base props
- **Hooks**: Custom hooks in `src/hooks/` for reusable logic

### GraphQL Development
- **Schema**: Schema-first approach using GraphQL SDL
- **Type Safety**: Full end-to-end type safety with codegen
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Connection Management**: Proper MongoDB connection lifecycle
- **Scalars**: Custom JSONObject scalar for flexible document handling

### Code Quality Standards
- **ESLint**: Modern configuration with TypeScript support
- **Prettier**: Automatic code formatting with Tailwind plugin
- **Husky**: Pre-commit hooks for linting and formatting
- **TypeScript**: Strict mode enabled with helpful compiler options

## Development Workflow

1. **Initial Setup**:
   ```bash
   npm install
   docker-compose up -d
   npm run dev
   ```

2. **Adding Features**:
   - Create/modify components in `src/components/`
   - Update GraphQL schema and operations
   - Run `npm run codegen` to generate types
   - Update Zustand store if needed
   - Add tests for new functionality

3. **GraphQL Changes**:
   - Modify schema in `src/pages/api/graphql.ts`
   - Add operations in `src/graphql/operations.ts`
   - Run `npm run codegen` to update generated types
   - Import and use new operations in components

4. **Code Quality Checks**:
   ```bash
   npm run type-check  # TypeScript validation
   npm run lint        # ESLint checks
   npm run format      # Prettier formatting
   npm test           # Run test suite
   ```

5. **Git Workflow**: Pre-commit hooks automatically run linting and formatting

## Modern Architecture Benefits

- **Type Safety**: End-to-end TypeScript with GraphQL codegen
- **Performance**: Modern React patterns with optimized re-renders
- **Developer Experience**: Hot reload, error boundaries, DevTools integration
- **Scalability**: Modular architecture with clear separation of concerns
- **Maintainability**: Consistent code style and automated quality checks
- **Testing**: Jest setup with React Testing Library integration

## Important Notes

- **State Persistence**: Server connections and tabs are automatically saved to localStorage
- **Connection Management**: Each GraphQL operation uses a new MongoDB connection (no pooling)
- **Code Generation**: Never edit files in `src/generated/` manually - they are auto-generated
- **Path Aliases**: Use `@/` imports for clean relative paths
- **Styling**: Leverage CSS variables for consistent theming across light/dark modes
