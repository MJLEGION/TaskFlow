#!/usr/bin/env node

/**
 * Git hook to help with conventional commit messages
 * This script runs before commit message editing
 */

const fs = require('fs');
const path = require('path');

const commitMsgFile = process.argv[2];
const commitSource = process.argv[3];

// Only run for regular commits (not merge, squash, etc.)
if (commitSource) {
  process.exit(0);
}

// Read the current commit message
let commitMsg = '';
try {
  commitMsg = fs.readFileSync(commitMsgFile, 'utf8');
} catch (error) {
  console.error('Error reading commit message file:', error);
  process.exit(1);
}

// If the commit message is empty or just whitespace, add template
if (!commitMsg.trim()) {
  const template = `# Follow conventional commit format:
# <type>[optional scope]: <description>
#
# Types: feat, fix, docs, style, refactor, test, chore, perf, build, ci, revert
# 
# Examples:
# feat(auth): add user login functionality
# fix(api): resolve task creation bug
# docs: update README installation steps
# 
# Uncomment and edit the line below:
# feat: 

`;

  fs.writeFileSync(commitMsgFile, template);
}

// Check if the commit message follows conventional commit format
const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert)(\(.+\))?: .{1,50}/;

if (commitMsg.trim() && !commitMsg.startsWith('#')) {
  const lines = commitMsg.split('\n');
  const firstLine = lines[0];
  
  if (!conventionalCommitRegex.test(firstLine)) {
    console.log('\n⚠️  Commit message does not follow conventional commit format!');
    console.log('📝 Expected format: <type>[optional scope]: <description>');
    console.log('💡 Examples:');
    console.log('   feat(auth): add user login functionality');
    console.log('   fix(api): resolve task creation bug');
    console.log('   docs: update README installation steps');
    console.log('\n🔗 Learn more: https://www.conventionalcommits.org/');
    console.log('\n✏️  Edit your commit message to follow this format.\n');
  }
}

process.exit(0);