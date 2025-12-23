const { spawn } = require('child_process');
const { exec } = require('child_process');

// Start the React development server
const reactScripts = spawn('react-scripts', ['start'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BROWSER: 'none' }
});

// Wait 5 seconds then open the browser
setTimeout(() => {
  const url = 'http://localhost:3000';
  const command = process.platform === 'win32' 
    ? `start ${url}`
    : process.platform === 'darwin'
    ? `open ${url}`
    : `xdg-open ${url}`;
  
  exec(command, (error) => {
    if (error) {
      console.log(`Could not automatically open browser. Please navigate to ${url}`);
    }
  });
}, 5000);

// Handle process termination
process.on('SIGINT', () => {
  reactScripts.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  reactScripts.kill('SIGTERM');
  process.exit();
});

