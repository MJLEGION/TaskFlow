#!/usr/bin/env node

/**
 * Git commit-msg hook to validate conventional commit format
 * This script runs after the commit message is written
 */

const fs = require('fs');
const chalk = require('chalk');

const commitMsgFile = process.argv[2];

// Read the commit message
let commitMsg = '';
try {
  commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();
} catch (error) {
  console.error(chalk.red('Error reading commit message file:'), error);
  process.exit(1);
}

// Skip validation for merge commits, revert commits, etc.
if (
  commitMsg.startsWith('Merge') ||
  commitMsg.startsWith('Revert') ||
  commitMsg.startsWith('Initial commit') ||
  commitMsg.includes('skip-validation')
) {
  process.exit(0);
}

// Skip if commit message is empty or just comments
if (!commitMsg || commitMsg.startsWith('#')) {
  console.error(chalk.red('❌ Commit message cannot be empty!'));
  process.exit(1);
}

// Conventional commit regex
const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert)(\(.+\))?: .{1,50}$/;

const lines = commitMsg.split('\n');
const firstLine = lines[0];

// Validate the first line (subject)
if (!conventionalCommitRegex.test(firstLine)) {
  console.log('\n' + chalk.red('❌ Invalid commit message format!'));
  console.log('\n' + chalk.yellow('📝 Your commit message:'));
  console.log(chalk.gray('   "' + firstLine + '"'));
  
  console.log('\n' + chalk.yellow('✅ Expected format:'));
  console.log(chalk.green('   <type>[optional scope]: <description>'));
  
  console.log('\n' + chalk.yellow('📋 Valid types:'));
  console.log(chalk.cyan('   feat     ') + '- A new feature');
  console.log(chalk.cyan('   fix      ') + '- A bug fix');
  console.log(chalk.cyan('   docs     ') + '- Documentation only changes');
  console.log(chalk.cyan('   style    ') + '- Code style changes (formatting, etc.)');
  console.log(chalk.cyan('   refactor ') + '- Code refactoring');
  console.log(chalk.cyan('   test     ') + '- Adding or updating tests');
  console.log(chalk.cyan('   chore    ') + '- Maintenance tasks');
  console.log(chalk.cyan('   perf     ') + '- Performance improvements');
  console.log(chalk.cyan('   build    ') + '- Build system changes');
  console.log(chalk.cyan('   ci       ') + '- CI configuration changes');
  console.log(chalk.cyan('   revert   ') + '- Revert a previous commit');
  
  console.log('\n' + chalk.yellow('💡 Examples:'));
  console.log(chalk.green('   feat(auth): add user login functionality'));
  console.log(chalk.green('   fix(api): resolve task creation bug'));
  console.log(chalk.green('   docs: update README installation steps'));
  console.log(chalk.green('   style: fix code formatting in TaskCard'));
  console.log(chalk.green('   refactor(hooks): extract common API logic'));
  
  console.log('\n' + chalk.yellow('📏 Rules:'));
  console.log('   • Subject line must be 50 characters or less');
  console.log('   • Use imperative mood ("add" not "added")');
  console.log('   • No period at the end');
  console.log('   • Scope is optional but recommended');
  
  console.log('\n' + chalk.blue('🔗 Learn more: https://www.conventionalcommits.org/'));
  console.log('\n' + chalk.red('❌ Commit rejected. Please fix your commit message and try again.\n'));
  
  process.exit(1);
}

// Validate subject line length
if (firstLine.length > 50) {
  console.log('\n' + chalk.red('❌ Commit subject line is too long!'));
  console.log(chalk.yellow('📏 Current length: ') + firstLine.length + ' characters');
  console.log(chalk.yellow('📏 Maximum length: ') + '50 characters');
  console.log('\n' + chalk.yellow('💡 Try to make your description more concise:'));
  console.log(chalk.gray('   "' + firstLine + '"'));
  console.log('\n' + chalk.red('❌ Commit rejected. Please shorten your commit message.\n'));
  process.exit(1);
}

// Validate body (if present)
if (lines.length > 1) {
  // Check for blank line after subject
  if (lines[1] !== '') {
    console.log('\n' + chalk.red('❌ Missing blank line after subject!'));
    console.log(chalk.yellow('💡 Add a blank line between subject and body:'));
    console.log(chalk.green('   feat(auth): add user login'));
    console.log(chalk.green('   '));
    console.log(chalk.green('   This commit adds user authentication...'));
    console.log('\n' + chalk.red('❌ Commit rejected. Please fix formatting.\n'));
    process.exit(1);
  }
  
  // Check body line length
  for (let i = 2; i < lines.length; i++) {
    if (lines[i].length > 72) {
      console.log('\n' + chalk.red('❌ Body line too long!'));
      console.log(chalk.yellow('📏 Line ' + (i + 1) + ' length: ') + lines[i].length + ' characters');
      console.log(chalk.yellow('📏 Maximum length: ') + '72 characters');
      console.log('\n' + chalk.red('❌ Commit rejected. Please wrap long lines.\n'));
      process.exit(1);
    }
  }
}

// Success!
console.log(chalk.green('✅ Commit message format is valid!'));
process.exit(0);