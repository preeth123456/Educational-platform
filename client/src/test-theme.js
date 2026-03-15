// Test theme toggle functionality
function testThemeToggle() {
  const root = document.documentElement;
  
  // Check current theme
  const isDark = root.classList.contains('dark-theme');
  console.log('Current theme is dark:', isDark);
  
  // Toggle theme
  if (isDark) {
    root.classList.remove('dark-theme');
    console.log('Switched to light theme');
  } else {
    root.classList.add('dark-theme');
    console.log('Switched to dark theme');
  }
  
  // Verify change
  const newIsDark = root.classList.contains('dark-theme');
  console.log('New theme is dark:', newIsDark);
}

// Run test
testThemeToggle();