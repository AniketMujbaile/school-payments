const Header: React.FC = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
    return (
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              School Payments Dashboard
            </h1>
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };