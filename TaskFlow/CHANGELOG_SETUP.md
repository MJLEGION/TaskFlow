# 📝 Automated Changelog Setup Guide

This guide explains how to use the automated changelog system in TaskFlow. Your changelog will now update automatically every time you make a commit!

## 🎯 Quick Start

### 1. Setup (One-time)

```bash
# Install dependencies and setup hooks
npm install
npm run setup-hooks

# Or run the setup script directly
node scripts/setup-git-hooks.js
```

### 2. Make Conventional Commits

```bash
# The system will guide you with proper commit format
git add .
git commit -m "feat(auth): add user login functionality"

# Changelog will update automatically! 🎉
```

## 🔧 How It Works

### Automatic Updates

- **Every commit** triggers changelog generation
- **Follows conventional commits** for categorization
- **Auto-increments version** based on commit types
- **Updates package.json** version automatically

### Commit Types & Changelog Sections

| Commit Type | Changelog Section | Version Bump |
| ----------- | ----------------- | ------------ |
| `feat`      | ✨ Features       | Minor        |
| `fix`       | 🐛 Bug Fixes      | Patch        |
| `perf`      | ⚡ Performance    | Patch        |
| `refactor`  | ♻️ Refactoring    | Patch        |
| `docs`      | 📚 Documentation  | Patch        |
| `test`      | ✅ Tests          | Patch        |
| `build`     | 🏗️ Build System   | Patch        |
| `ci`        | 👷 CI/CD          | Patch        |
| `chore`     | 🔧 Chores         | Patch        |
| `style`     | 💄 Styles         | Patch        |

### Breaking Changes

- Add `!` after type: `feat!: breaking change`
- Or include `BREAKING CHANGE:` in commit body
- Results in **Major** version bump

## 📋 Commit Message Format

### Basic Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples

```bash
# Feature
git commit -m "feat(auth): add JWT token refresh mechanism"

# Bug fix
git commit -m "fix(api): resolve task deletion cascade issue"

# Documentation
git commit -m "docs: update installation instructions"

# Breaking change
git commit -m "feat!: change API response format"

# With scope and body
git commit -m "feat(search): add advanced filtering

Add support for multiple filter criteria including:
- Date ranges
- Priority levels
- Assignment status

Closes #123"
```

## 🛠️ Available Commands

### Changelog Commands

```bash
# Generate changelog manually
npm run changelog

# Generate with conventional-changelog
npm run changelog:generate

# Create a release (tags + changelog)
npm run release

# Create specific version releases
npm run release:patch   # 1.0.0 -> 1.0.1
npm run release:minor   # 1.0.0 -> 1.1.0
npm run release:major   # 1.0.0 -> 2.0.0
```

### Git Helpers

```bash
# Quick commit (stages all files)
npm run commit

# View commit message template
git config --get commit.template
```

## 🎨 Customization

### Modify Changelog Sections

Edit `.changelogrc.json` to customize:

- Section titles and emojis
- Commit type mappings
- Version bump rules

```json
{
  "types": {
    "feat": {
      "title": "🚀 New Features",
      "semver": "minor"
    },
    "fix": {
      "title": "🔧 Bug Fixes",
      "semver": "patch"
    }
  }
}
```

### Modify Git Hooks

Edit files in `.husky/` directory:

- `prepare-commit-msg` - Runs before editing commit message
- `commit-msg` - Validates commit message format
- `post-commit` - Runs after successful commit

## 🔍 Validation Rules

### Commit Message Validation

- ✅ Must follow conventional commit format
- ✅ Subject line ≤ 50 characters
- ✅ Body lines ≤ 72 characters
- ✅ Blank line between subject and body
- ✅ Imperative mood ("add" not "added")

### Automatic Checks

- **Pre-commit**: Linting and formatting
- **Commit-msg**: Format validation
- **Post-commit**: Changelog generation

## 📊 Changelog Features

### What Gets Included

- ✅ All conventional commits
- ✅ Commit links to GitHub
- ✅ Breaking changes highlighted
- ✅ Version comparisons
- ✅ Release dates
- ✅ Contributor information

### What Gets Excluded

- ❌ Merge commits
- ❌ Revert commits
- ❌ Non-conventional commits (marked as chores)
- ❌ Commits with `[skip ci]`

## 🚀 GitHub Integration

### Automatic Releases

The GitHub Action (`.github/workflows/changelog.yml`) will:

1. **Detect new commits** on main branch
2. **Generate changelog** automatically
3. **Create GitHub releases** with release notes
4. **Tag versions** appropriately

### Manual Release Process

```bash
# 1. Make your changes and commit
git add .
git commit -m "feat: add awesome new feature"

# 2. Push to trigger automation
git push origin main

# 3. GitHub Action will:
#    - Update changelog
#    - Create release
#    - Tag version
```

## 🎯 Best Practices

### Commit Messages

1. **Be descriptive** but concise
2. **Use imperative mood** ("add" not "added")
3. **Include scope** when relevant
4. **Reference issues** in footer
5. **Explain why**, not just what

### Changelog Management

1. **Review generated entries** before releases
2. **Add manual entries** for important context
3. **Keep unreleased section** clean
4. **Use semantic versioning** consistently

### Release Workflow

1. **Feature development** on feature branches
2. **Conventional commits** throughout development
3. **Merge to main** triggers automation
4. **Review and publish** releases

## 🔧 Troubleshooting

### Common Issues

#### Commit Rejected

```bash
❌ Invalid commit message format!
```

**Solution**: Follow conventional commit format

```bash
git commit -m "feat: your feature description"
```

#### Changelog Not Updating

**Check**:

- Git hooks are installed: `npm run setup-hooks`
- Scripts are executable: `ls -la scripts/`
- No errors in hook execution

#### Version Not Incrementing

**Check**:

- Commit follows conventional format
- No syntax errors in package.json
- Git working directory is clean

### Reset Setup

```bash
# Reinstall hooks
rm -rf .husky
npm run setup-hooks

# Reset git config
git config --unset commit.template
git config commit.template .gitmessage
```

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Husky Documentation](https://typicode.github.io/husky/)

## 🎉 You're All Set!

Your changelog will now update automatically with every commit. Just follow the conventional commit format, and watch your changelog grow!

**Happy committing! 🚀**
