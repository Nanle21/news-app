# 🤝 Contributing to Nanle News Aggregator

Thank you for your interest in contributing to the Nanle News Aggregator! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Code Standards](#-code-standards)
- [Testing](#-testing)
- [Pull Request Process](#-pull-request-process)
- [Issue Reporting](#-issue-reporting)
- [Code of Conduct](#-code-of-conduct)

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** - For containerized development
- **Git** - For version control
- **Code Editor** - VS Code, PhpStorm, or similar
- **API Keys** - For news services (optional for development)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nanle-home-task.git
   cd nanle-home-task
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/nanle-home-task.git
   ```

## 🛠️ Development Setup

### Quick Start

```bash
# Build and start all services
make build
make up

# Check status
make status

# View logs
make logs
```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

### Useful Development Commands

```bash
# Backend development
make shell-backend          # Access backend container
make artisan cmd="migrate"  # Run Laravel commands
make test                   # Run backend tests

# Frontend development
make shell-frontend         # Access frontend container
make npm-install            # Install dependencies
make test-frontend          # Run frontend tests

# Database operations
make migrate-fresh          # Reset database with seeding
make shell-db               # Access database shell
make db-backup              # Create database backup

# Monitoring
make status                 # Check service status
make health                 # Health check endpoints
make logs-backend           # View backend logs
```

## 📝 Code Standards

### Backend (Laravel/PHP)

#### Coding Standards
- Follow **PSR-12** coding standards
- Use **Laravel conventions** for naming and structure
- Write **meaningful commit messages** using conventional commits

#### Code Style
```php
// ✅ Good
class ArticleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $articles = Article::with(['source', 'category'])
            ->filter($request->all())
            ->paginate(20);

        return response()->json($articles);
    }
}

// ❌ Avoid
class articlecontroller extends controller
{
    public function index($request)
    {
        $articles = Article::all();
        return $articles;
    }
}
```

#### File Organization
```
backend/
├── app/
│   ├── Http/Controllers/    # API controllers
│   ├── Models/             # Eloquent models
│   ├── Services/           # Business logic
│   └── Console/Commands/   # Artisan commands
├── routes/
│   └── api.php            # API routes
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/          # Database seeders
└── tests/                # PHPUnit tests
```

### Frontend (React/TypeScript)

#### Coding Standards
- Use **TypeScript** for all new code
- Follow **React best practices**
- Use **functional components** with hooks
- Implement **proper error handling**

#### Code Style
```typescript
// ✅ Good
interface ArticleProps {
  article: Article;
  onBookmark: (id: number) => void;
}

export const ArticleCard: React.FC<ArticleProps> = ({ 
  article, 
  onBookmark 
}) => {
  const handleBookmark = useCallback(() => {
    onBookmark(article.id);
  }, [article.id, onBookmark]);

  return (
    <div className="article-card">
      <h3>{article.title}</h3>
      <button onClick={handleBookmark}>
        Bookmark
      </button>
    </div>
  );
};

// ❌ Avoid
export function ArticleCard(props: any) {
  return <div>{props.article.title}</div>;
}
```

#### File Organization
```
frontend/src/
├── components/            # Reusable components
├── pages/                # Page components
├── hooks/                # Custom hooks
├── services/             # API services
├── store/                # Redux store
├── types/                # TypeScript types
└── utils/                # Utility functions
```

### Git Commit Messages

Use **conventional commits** format:

```bash
# Format: type(scope): description

feat(auth): add email verification
fix(articles): resolve pagination issue
docs(readme): update installation instructions
style(components): improve button styling
refactor(api): simplify article filtering
test(auth): add login test cases
chore(deps): update dependencies
```

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
make test

# Run specific test file
make artisan cmd="test --filter=ArticleTest"

# Run with coverage
make artisan cmd="test --coverage"
```

#### Test Structure
```php
// tests/Feature/ArticleTest.php
class ArticleTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_articles(): void
    {
        $response = $this->getJson('/api/articles');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'content']
                ]
            ]);
    }
}
```

### Frontend Testing

```bash
# Run all tests
make test-frontend

# Run tests in watch mode
make shell-frontend
yarn test --watch
```

#### Test Structure
```typescript
// src/components/__tests__/ArticleCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';

describe('ArticleCard', () => {
  it('renders article title', () => {
    const article = { id: 1, title: 'Test Article' };
    render(<ArticleCard article={article} onBookmark={jest.fn()} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure tests pass**:
   ```bash
   make test
   make test-frontend
   ```

2. **Check code style**:
   ```bash
   # Backend
   make shell-backend
   composer lint

   # Frontend
   make shell-frontend
   yarn lint
   ```

3. **Update documentation** if needed

4. **Test your changes** thoroughly

### Pull Request Guidelines

1. **Use descriptive titles** and descriptions
2. **Reference issues** using `#issue-number`
3. **Include screenshots** for UI changes
4. **Describe testing steps** for reviewers
5. **Keep PRs focused** - one feature per PR

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** and troubleshooting guides
3. **Try to reproduce** the issue locally

### Issue Template

```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Information
Screenshots, logs, or other relevant information
```

## 📋 Code Review Process

### For Contributors

1. **Address review comments** promptly
2. **Request re-review** when changes are made
3. **Be open to feedback** and suggestions

### For Reviewers

1. **Be constructive** and respectful
2. **Focus on code quality** and functionality
3. **Provide specific feedback** with examples
4. **Approve when satisfied** with changes

## 🚫 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Use welcoming language**
- **Be collaborative** and open to feedback
- **Focus on constructive criticism**

### Unacceptable Behavior

- **Harassment** or discrimination
- **Trolling** or insulting comments
- **Publishing private information**
- **Unprofessional conduct**

## 🎯 Getting Help

### Resources

- **Documentation**: Check the [README.md](README.md)
- **API Docs**: http://localhost:8000/docs (when running)
- **Issues**: Search existing issues on GitHub
- **Discussions**: Use GitHub Discussions for questions

### Contact

- **Issues**: Create an issue on GitHub
- **Security**: Report security issues privately
- **Questions**: Use GitHub Discussions

---

**Thank you for contributing to Nanle News Aggregator! 🎉** 