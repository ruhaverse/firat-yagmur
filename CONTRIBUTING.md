# Contributing to ShareUpTime

Thank you for your interest in contributing to ShareUpTime! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a positive community

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Git
- Code editor (VS Code recommended)

### Setup

```bash
# Clone the repository
git clone https://github.com/ruhaverse/firat-yagmur.git
cd firat-yagmur

# Install frontend dependencies
cd Shareup-frontend
npm install

# Install backend dependencies (optional)
cd ../backend
npm install
```

## Development Workflow

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code patterns
   - Test your changes thoroughly

3. **Test your changes**

   ```bash
   # Frontend tests
   cd Shareup-frontend
   npm test

   # Manual testing
   npm start
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### File Structure

- Place components in appropriate category folders
- Keep related files together
- Use consistent naming conventions

### CSS

- Follow existing styling patterns
- Use Bootstrap classes when possible
- Keep styles modular and reusable

### Git Commit Messages

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:

```text
feat: add user profile editing functionality

- Added edit profile form
- Implemented avatar upload
- Added validation
```

## Submitting Changes

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with:
     - Description of changes
     - Screenshots (if UI changes)
     - Testing steps
     - Related issues

3. **Code Review**
   - Address reviewer feedback
   - Make requested changes
   - Update PR as needed

4. **Merge**
   - Once approved, your PR will be merged
   - Delete your feature branch after merge

## Important Notes

### UI/UX Changes

- **Do not modify existing UI/UX without approval**
- This is a 3-4 year production codebase
- Maintain consistency with existing design
- Test responsive design (mobile, tablet, desktop)

### Backend Changes

- The backend is shared with the mobile app
- Changes must not break mobile compatibility
- Test all API endpoints after changes
- Update API documentation if needed

### Breaking Changes

- Avoid breaking changes when possible
- If necessary, document thoroughly
- Provide migration guide
- Discuss with maintainers first

## Questions

- Check existing documentation in `/docs`
- Review closed issues and PRs
- Ask in pull request comments
- Contact project maintainers

## Thank You

Your contributions make ShareUpTime better for everyone. We appreciate your time and effort! 🎉

