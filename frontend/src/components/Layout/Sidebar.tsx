const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
  
    const menuItems = [
      { path: '/', label: 'Dashboard', icon: '📊' },
      { path: '/transactions', label: 'Transactions', icon: '💰' },
      { path: '/school-transactions', label: 'School Transactions', icon: '🏫' },
      { path: '/status-check', label: 'Status Check', icon: '🔍' },
    ];
  
    return (
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
            <span className="text-lg font-bold text-gray-800 dark:text-white">
              Menu
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={`flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  location.pathname === item.path
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  };
  
  export default Layout;