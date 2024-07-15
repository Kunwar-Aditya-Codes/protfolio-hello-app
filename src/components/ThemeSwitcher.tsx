'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (darkMode !== null) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [darkMode]);

  if (darkMode === null) return null;

  return (
    <div>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? (
          <Moon className='size-6  text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-400' />
        ) : (
          <Sun className='size-6  text-zinc-500 hover:text-zinc-800' />
        )}
      </button>
    </div>
  );
};
export default ThemeSwitcher;
