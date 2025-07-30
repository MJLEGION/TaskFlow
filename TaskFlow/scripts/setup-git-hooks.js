#!/usr/bin/env node

/**
 * Setup script for Git hooks and changelog automation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up Git hooks and changelog automation...\n');

// 1. Install Husky
console.log('📦 Installing Husky...');
try {
  execSync('npx husky install', { stdio: 'inherit' });
  console.log('✅ Husky installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install Husky:', error.message);
  process.exit(1);
}

// 2. Make scripts executable
console.log('🔐 Making scripts executable...');
const scriptsDir = path.join(__dirname);
const scripts = [
  'update-changelog.js',
  'prepare-commit-msg.js',
  'commit-msg.js',
  'setup-git-hooks.js'
];

scripts.forEach(script => {
  const scriptPath = path.join(scriptsDir, script);
  if (fs.existsSync(scriptPath)) {
    try {
      fs.chmodSync(scriptPath, '755');
      console.log(`✅ Made ${script} executable`);
    } catch (error) {
      console.warn(`⚠️  Could not make ${script} executable:`, error.message);
    }
  }
});

// 3. Make Husky hooks executable
console.log('\n🔐 Making Husky hooks executable...');
const hooksDir = path.join(process.cwd(), '.husky');
if (fs.existsSync(hooksDir)) {
  const hooks = fs.readdirSync(hooksDir).filter(file => !file.startsWith('_') && !file.includes('.'));
  hooks.forEach(hook => {
    const hookPath = path.join(hooksDir, hook);
    try {
      fs.chmodSync(hookPath, '755');
      console.log(`✅ Made ${hook} hook executable`);
    } catch (error) {
      console.warn(`⚠️  Could not make ${hook} hook executable:`, error.message);
    }
  });
}

// 4. Set up Git commit template
console.log('\n📝 Setting up Git commit message template...');
try {
  const templatePath = path.join(process.cwd(), '.gitmessage');
  execSync(`git config commit.template ${templatePath}`, { stdio: 'inherit' });
  console.log('✅ Git commit template configured');
} catch (error) {
  console.warn('⚠️  Could not set Git commit template:', error.message);
}

// 5. Create initial changelog if it doesn't exist
console.log('\n📄 Checking changelog...');
const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
if (!fs.existsSync(changelogPath)) {
  const initialChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Automated changelog generation
- Conventional commit validation

`;
  
  fs.writeFileSync(changelogPath, initialChangelog);
  console.log('✅ Created initial CHANGELOG.md');
} else {
  console.log('✅ CHANGELOG.md already exists');
}

// 6. Test the setup
console.log('\n🧪 Testing the setup...');
try {
  // Test changelog generation
  const ChangelogGenerator = require('./update-changelog.js');
  console.log('✅ Changelog generator is working');
  
  console.log('\n🎉 Setup completed successfully!\n');
  
  console.log('📋 What was configured:');
  console.log('   ✅ Husky Git hooks');
  console.log('   ✅ Conventional commit validation');
  console.log('   ✅ Automatic changelog generation');
  console.log('   ✅ Git commit message template');
  console.log('   ✅ Executable permissions for scripts');
  
  console.log('\n🚀 How to use:');
  console.log('   📝 Make commits: git commit -m "feat: add new feature"');
  console.log('   📄 Generate changelog: npm run changelog');
  console.log('   🏷️  Create release: npm run release');
  console.log('   📋 View commit template: git config --get commit.template');
  
  console.log('\n💡 Commit message format:');
  console.log('   <type>[optional scope]: <description>');
  console.log('   Examples:');
  console.log('   • feat(auth): add user login functionality');
  console.log('   • fix(api): resolve task creation bug');
  console.log('   • docs: update README installation steps');
  
  console.log('\n🔗 Learn more about conventional commits:');
  console.log('   https://www.conventionalcommits.org/\n');
  
} catch (error) {
  console.error('❌ Setup test failed:', error.message);
  console.log('\n⚠️  Some features may not work correctly. Please check the error above.');
}

console.log('🎯 Ready to start making conventional commits!\n');