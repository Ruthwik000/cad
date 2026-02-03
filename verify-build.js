#!/usr/bin/env node

/**
 * Build Verification Script
 * Run this before deploying to Vercel to ensure everything is configured correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying build configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Verify required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'package.json',
  'webpack.config.js',
  'vercel.json',
  'src/index.tsx',
  'public/index.html',
  'public/loading.gif',
  'src/wasm/openscad.js',
  'src/wasm/openscad.wasm'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING!`);
    hasErrors = true;
  }
});

// Check 2: Verify package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

if (packageJson.scripts.build) {
  console.log(`  ✅ build script: ${packageJson.scripts.build}`);
} else {
  console.log('  ❌ build script missing!');
  hasErrors = true;
}

// Check 3: Verify vercel.json configuration
console.log('\n⚙️  Checking vercel.json...');
const vercelJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));

if (vercelJson.buildCommand === 'npm run build') {
  console.log('  ✅ buildCommand is correct');
} else {
  console.log('  ⚠️  buildCommand might be incorrect');
  hasWarnings = true;
}

if (vercelJson.outputDirectory === 'dist') {
  console.log('  ✅ outputDirectory is correct');
} else {
  console.log('  ❌ outputDirectory should be "dist"');
  hasErrors = true;
}

if (vercelJson.headers && vercelJson.headers.length > 0) {
  console.log('  ✅ CORS headers configured');
} else {
  console.log('  ⚠️  CORS headers not configured');
  hasWarnings = true;
}

// Check 4: Verify .env.example exists
console.log('\n🔐 Checking environment variables...');
if (fs.existsSync(path.join(__dirname, '.env.example'))) {
  console.log('  ✅ .env.example exists');
  const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_GROQ_API_KEY'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`  ✅ ${envVar} documented`);
    } else {
      console.log(`  ⚠️  ${envVar} not in .env.example`);
      hasWarnings = true;
    }
  });
} else {
  console.log('  ⚠️  .env.example not found');
  hasWarnings = true;
}

// Check 5: Verify .gitignore
console.log('\n🚫 Checking .gitignore...');
if (fs.existsSync(path.join(__dirname, '.gitignore'))) {
  const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
  if (gitignore.includes('.env')) {
    console.log('  ✅ .env is ignored');
  } else {
    console.log('  ❌ .env should be in .gitignore!');
    hasErrors = true;
  }
  if (gitignore.includes('node_modules')) {
    console.log('  ✅ node_modules is ignored');
  } else {
    console.log('  ⚠️  node_modules should be in .gitignore');
    hasWarnings = true;
  }
} else {
  console.log('  ❌ .gitignore not found!');
  hasErrors = true;
}

// Check 6: Verify webpack alias fix
console.log('\n🔧 Checking webpack configuration...');
const webpackConfig = fs.readFileSync(path.join(__dirname, 'webpack.config.js'), 'utf8');
if (webpackConfig.includes('alias')) {
  console.log('  ✅ Webpack alias configured (openscad.js fix)');
} else {
  console.log('  ⚠️  Webpack alias not found - may cause build issues');
  hasWarnings = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ VERIFICATION FAILED - Fix errors before deploying!');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  VERIFICATION PASSED WITH WARNINGS');
  console.log('   Review warnings above, but deployment should work.');
  process.exit(0);
} else {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('   Ready to deploy to Vercel.');
  console.log('\n📝 Next steps:');
  console.log('   1. Commit your changes: git add . && git commit -m "Ready for deployment"');
  console.log('   2. Push to GitHub: git push origin main');
  console.log('   3. Deploy on Vercel: https://vercel.com/new');
  console.log('   4. Add environment variables in Vercel dashboard');
  console.log('   5. Follow VERCEL_DEPLOYMENT_CHECKLIST.md');
  process.exit(0);
}
