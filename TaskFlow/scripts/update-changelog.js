#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Automated Changelog Generator
 * This script generates changelog entries based on conventional commits
 */

class ChangelogGenerator {
  constructor() {
    this.changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    this.packagePath = path.join(process.cwd(), 'package.json');
    this.configPath = path.join(process.cwd(), '.changelogrc.json');
    
    this.config = this.loadConfig();
    this.currentVersion = this.getCurrentVersion();
  }

  loadConfig() {
    try {
      const configContent = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(configContent);
    } catch (error) {
      console.warn('No changelog config found, using defaults');
      return this.getDefaultConfig();
    }
  }

  getDefaultConfig() {
    return {
      types: {
        feat: { title: '✨ Features', semver: 'minor' },
        fix: { title: '🐛 Bug Fixes', semver: 'patch' },
        docs: { title: '📚 Documentation', semver: 'patch' },
        style: { title: '💄 Styles', semver: 'patch' },
        refactor: { title: '♻️ Code Refactoring', semver: 'patch' },
        perf: { title: '⚡ Performance Improvements', semver: 'patch' },
        test: { title: '✅ Tests', semver: 'patch' },
        build: { title: '🏗️ Build System', semver: 'patch' },
        ci: { title: '👷 Continuous Integration', semver: 'patch' },
        chore: { title: '🔧 Chores', semver: 'patch' }
      }
    };
  }

  getCurrentVersion() {
    try {
      const packageContent = fs.readFileSync(this.packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      return packageJson.version;
    } catch (error) {
      return '1.0.0';
    }
  }

  getCommitsSinceLastTag() {
    try {
      // Get the last tag
      const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
      
      // Get commits since last tag
      const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"%H|%s|%an|%ad" --date=short`, { encoding: 'utf8' });
      
      if (!commits) return [];
      
      return commits.split('\n').map(commit => {
        const [hash, subject, author, date] = commit.split('|');
        return { hash, subject, author, date };
      });
    } catch (error) {
      // If no tags exist, get all commits
      try {
        const commits = execSync('git log --pretty=format:"%H|%s|%an|%ad" --date=short', { encoding: 'utf8' });
        
        if (!commits) return [];
        
        return commits.split('\n').slice(0, 10).map(commit => {
          const [hash, subject, author, date] = commit.split('|');
          return { hash, subject, author, date };
        });
      } catch (err) {
        return [];
      }
    }
  }

  parseCommit(commit) {
    const conventionalCommitRegex = /^(\w+)(\(.+\))?: (.+)$/;
    const match = commit.subject.match(conventionalCommitRegex);
    
    if (!match) {
      return {
        type: 'chore',
        scope: null,
        description: commit.subject,
        hash: commit.hash.substring(0, 7),
        author: commit.author,
        date: commit.date,
        breaking: commit.subject.includes('BREAKING CHANGE')
      };
    }

    const [, type, scope, description] = match;
    
    return {
      type: type.toLowerCase(),
      scope: scope ? scope.slice(1, -1) : null,
      description,
      hash: commit.hash.substring(0, 7),
      author: commit.author,
      date: commit.date,
      breaking: commit.subject.includes('BREAKING CHANGE') || commit.subject.includes('!')
    };
  }

  groupCommitsByType(commits) {
    const grouped = {};
    
    commits.forEach(commit => {
      const parsed = this.parseCommit(commit);
      
      if (!grouped[parsed.type]) {
        grouped[parsed.type] = [];
      }
      
      grouped[parsed.type].push(parsed);
    });
    
    return grouped;
  }

  generateChangelogEntry(groupedCommits, version) {
    const date = new Date().toISOString().split('T')[0];
    let entry = `## [${version}] - ${date}\n\n`;
    
    // Handle breaking changes first
    const breakingChanges = [];
    Object.values(groupedCommits).flat().forEach(commit => {
      if (commit.breaking) {
        breakingChanges.push(commit);
      }
    });
    
    if (breakingChanges.length > 0) {
      entry += '### 💥 BREAKING CHANGES\n\n';
      breakingChanges.forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}**: ` : '';
        entry += `- ${scope}${commit.description} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });
      entry += '\n';
    }
    
    // Process each type
    Object.entries(this.config.types).forEach(([type, config]) => {
      if (groupedCommits[type] && groupedCommits[type].length > 0) {
        entry += `### ${config.title}\n\n`;
        
        groupedCommits[type].forEach(commit => {
          const scope = commit.scope ? `**${commit.scope}**: ` : '';
          entry += `- ${scope}${commit.description} ([${commit.hash}](../../commit/${commit.hash}))\n`;
        });
        
        entry += '\n';
      }
    });
    
    return entry;
  }

  updateChangelog(newEntry) {
    let changelogContent = '';
    
    try {
      changelogContent = fs.readFileSync(this.changelogPath, 'utf8');
    } catch (error) {
      // Create new changelog if it doesn't exist
      changelogContent = this.createNewChangelog();
    }
    
    // Find the position to insert the new entry
    const unreleasedIndex = changelogContent.indexOf('## [Unreleased]');
    const firstReleaseIndex = changelogContent.indexOf('## [', unreleasedIndex + 1);
    
    let updatedContent;
    
    if (unreleasedIndex !== -1 && firstReleaseIndex !== -1) {
      // Insert after unreleased section
      updatedContent = 
        changelogContent.substring(0, firstReleaseIndex) +
        newEntry +
        changelogContent.substring(firstReleaseIndex);
    } else if (unreleasedIndex !== -1) {
      // Insert after unreleased section (no other releases)
      const insertPosition = changelogContent.indexOf('\n', unreleasedIndex) + 1;
      updatedContent = 
        changelogContent.substring(0, insertPosition) +
        '\n' + newEntry +
        changelogContent.substring(insertPosition);
    } else {
      // Insert at the beginning after the header
      const headerEnd = changelogContent.indexOf('\n\n') + 2;
      updatedContent = 
        changelogContent.substring(0, headerEnd) +
        newEntry +
        changelogContent.substring(headerEnd);
    }
    
    fs.writeFileSync(this.changelogPath, updatedContent);
  }

  createNewChangelog() {
    return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

`;
  }

  calculateNextVersion(groupedCommits) {
    let versionBump = 'patch';
    
    // Check for breaking changes
    const hasBreaking = Object.values(groupedCommits).flat().some(commit => commit.breaking);
    if (hasBreaking) {
      versionBump = 'major';
    }
    
    // Check for features
    if (groupedCommits.feat && groupedCommits.feat.length > 0) {
      versionBump = versionBump === 'major' ? 'major' : 'minor';
    }
    
    const [major, minor, patch] = this.currentVersion.split('.').map(Number);
    
    switch (versionBump) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
      default:
        return this.currentVersion;
    }
  }

  run() {
    console.log('🔄 Generating changelog...');
    
    const commits = this.getCommitsSinceLastTag();
    
    if (commits.length === 0) {
      console.log('ℹ️  No new commits found since last release.');
      return;
    }
    
    console.log(`📝 Found ${commits.length} commits to process`);
    
    const groupedCommits = this.groupCommitsByType(commits);
    const nextVersion = this.calculateNextVersion(groupedCommits);
    
    const changelogEntry = this.generateChangelogEntry(groupedCommits, nextVersion);
    
    this.updateChangelog(changelogEntry);
    
    console.log(`✅ Changelog updated with version ${nextVersion}`);
    console.log(`📄 Updated: ${this.changelogPath}`);
    
    // Update package.json version
    this.updatePackageVersion(nextVersion);
  }

  updatePackageVersion(version) {
    try {
      const packageContent = fs.readFileSync(this.packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      packageJson.version = version;
      
      fs.writeFileSync(this.packagePath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`📦 Updated package.json version to ${version}`);
    } catch (error) {
      console.warn('⚠️  Could not update package.json version:', error.message);
    }
  }
}

// Run the changelog generator
if (require.main === module) {
  const generator = new ChangelogGenerator();
  generator.run();
}

module.exports = ChangelogGenerator;