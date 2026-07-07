# Contributing Guide

Thank you for your interest in contributing to the GrowEasy CSV Importer! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the project

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed
- OpenAI API key
- Text editor (VS Code recommended)

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/csv-importer.git
   cd csv-importer
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/csv-importer.git
   ```

4. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Setup environment**:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

6. **Start development servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```

**Branch Naming Convention**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Test your changes thoroughly
- Update documentation if needed

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) below.

### 4. Push Changes

```bash
git push origin feature/my-new-feature
```

### 5. Create Pull Request

- Go to GitHub
- Create a Pull Request from your branch
- Fill in the PR template
- Wait for review

## 📝 Coding Standards

### TypeScript

#### General Rules
- Use TypeScript strict mode
- Define types for all functions
- Avoid `any` type
- Use interfaces for object shapes
- Export types that are used across files

**Good**:
```typescript
interface User {
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // implementation
}
```

**Bad**:
```typescript
function getUser(id: any): any {
  // implementation
}
```

### React Components

#### Functional Components
- Use functional components with hooks
- Define prop types with TypeScript interfaces
- Use meaningful component names

**Good**:
```typescript
interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export default function Button({ onClick, label, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

#### Component Organization
```typescript
// 1. Imports
import { useState } from 'react';
import { SomeType } from '@/types';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export default function MyComponent({ prop }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Functions
  const handleClick = () => {
    // ...
  };
  
  // 6. Return
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Backend Code

#### Service Pattern
```typescript
export class MyService {
  async getData(id: string): Promise<Data> {
    try {
      // implementation
    } catch (error) {
      throw new Error(`Failed to get data: ${error.message}`);
    }
  }
}

export default new MyService();
```

#### Route Handlers
```typescript
router.post('/endpoint', async (req: Request, res: Response) => {
  try {
    // Validate input
    // Process request
    // Return response
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `csv-service.ts` |
| Components | PascalCase | `CSVUploader.tsx` |
| Functions | camelCase | `parseCSV()` |
| Variables | camelCase | `userData` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Interfaces | PascalCase | `CRMRecord` |
| Types | PascalCase | `CRMStatus` |

### File Organization

```typescript
// 1. External imports
import { useState } from 'react';
import express from 'express';

// 2. Internal imports
import { MyType } from '@/types';
import myService from '@/services/my-service';

// 3. Constants
const MAX_SIZE = 1000;

// 4. Types/Interfaces
interface MyInterface {
  // ...
}

// 5. Main code
export default function MyComponent() {
  // ...
}
```

### Comments

**Do Comment**:
- Complex algorithms
- Non-obvious code
- Important decisions
- Public APIs

**Don't Comment**:
- Obvious code
- What the code does (code should be self-explanatory)

**Good**:
```typescript
// Process in batches to avoid API rate limits
const batches = createBatches(data, 10);
```

**Bad**:
```typescript
// Set x to 5
const x = 5;
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(upload): add drag and drop support

Add react-dropzone integration for better UX.
Users can now drag CSV files directly.

Closes #123
```

```bash
fix(ai): handle empty CSV rows

Fixed crash when CSV contains empty rows.
Now skips empty rows with warning.

Fixes #456
```

```bash
docs(readme): update installation steps

Clarified Node.js version requirement.
Added troubleshooting section.
```

### Rules

- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- Don't capitalize first letter
- No period at the end
- Keep subject line under 70 characters
- Reference issues in footer

## 🔀 Pull Request Process

### Before Creating PR

- [ ] Code compiles without errors
- [ ] All tests pass (if applicable)
- [ ] No ESLint warnings
- [ ] Code is formatted properly
- [ ] Changes are tested manually
- [ ] Documentation is updated
- [ ] Commits follow guidelines

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How were changes tested?

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added (if applicable)
```

### Review Process

1. **Automated checks** run first
2. **Code review** by maintainers
3. **Feedback** addressed by contributor
4. **Approval** required before merge
5. **Merge** by maintainer

### After PR is Merged

1. Delete your branch:
   ```bash
   git branch -d feature/my-feature
   git push origin --delete feature/my-feature
   ```

2. Update your fork:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## 🧪 Testing

### Manual Testing

Before submitting PR, test:

1. **Functionality**:
   - Upload CSV files
   - Preview displays correctly
   - AI processing works
   - Results display correctly
   - Download works

2. **Edge Cases**:
   - Empty CSV
   - Large CSV files
   - Invalid formats
   - Missing data

3. **UI/UX**:
   - Responsive design
   - Dark mode
   - Loading states
   - Error messages

4. **Cross-browser** (if UI changes):
   - Chrome
   - Firefox
   - Safari
   - Edge

### Automated Testing (Future)

When tests are added:

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📚 Documentation

### When to Update Documentation

Update docs when you:
- Add new features
- Change existing features
- Fix bugs (if user-facing)
- Change APIs
- Add configuration options

### What to Update

- `README.md` - If setup changes
- `ARCHITECTURE.md` - If system design changes
- `TESTING.md` - If test procedures change
- `DEPLOYMENT.md` - If deployment changes
- Code comments - For complex logic
- API documentation - For endpoint changes

### Documentation Style

- Use clear, simple language
- Include code examples
- Add screenshots when helpful
- Keep it up to date
- Link between related docs

## 🎯 Areas for Contribution

### High Priority

1. **Unit Tests**
   - Backend service tests
   - Frontend component tests
   - Integration tests

2. **E2E Tests**
   - Playwright or Cypress
   - Full workflow testing

3. **Performance**
   - Virtual scrolling for large tables
   - Request caching
   - Optimize bundle size

4. **Features**
   - User authentication
   - Database integration
   - More AI providers

### Good First Issues

- Fix typos in documentation
- Improve error messages
- Add more sample CSV files
- Enhance UI components
- Add keyboard shortcuts

### Advanced

- WebSocket for real-time updates
- Background job processing
- Advanced data validation
- Custom field mapping UI
- Analytics dashboard

## 💡 Tips for Contributors

### Do's ✅

- Read existing code to understand patterns
- Ask questions if unclear
- Start with small changes
- Test thoroughly
- Write clear commit messages
- Update documentation
- Be patient with review process

### Don'ts ❌

- Don't break existing functionality
- Don't ignore coding standards
- Don't skip testing
- Don't make unrelated changes
- Don't commit sensitive data
- Don't force push to main

## 🆘 Getting Help

### Resources

- **Documentation**: Read all .md files
- **Code**: Study existing implementations
- **Issues**: Check GitHub issues for context

### Ask Questions

- Create a GitHub issue
- Email: varun@groweasy.ai
- Be specific about your question
- Include code examples
- Show what you've tried

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to GrowEasy CSV Importer! Your help makes this project better for everyone.

---

**Questions?** Open an issue or email varun@groweasy.ai

**Ready to contribute?** Fork the repo and start coding! 🚀
