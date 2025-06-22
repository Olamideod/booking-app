const { execSync } = require('child_process');

try {
  console.log('Starting build process...');
  const output = execSync('npm run build', { encoding: 'utf8' });
  console.log('Build output:', output);
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed with error:', error.message);
  console.error('Build output:', error.stdout);
} 