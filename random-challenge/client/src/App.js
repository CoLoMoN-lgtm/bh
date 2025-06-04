// src/App.js
import React, { useState } from 'react';
import { useAuth } from './components/AuthProvider';
import Login from './components/Login';
import RandomChallengeApp from './components/RandomChallengeApp';
import UserProfile from './components/UserProfile';
import { User, LogOut, Menu, X } from 'lucide-react';

function App() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('challenges'); // 'challenges' or 'profile'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setCurrentPage('challenges');
    setIsMobileMenuOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen">
      {/* Навігаційна панель */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800">Випадковий виклик</h1>
            </div>
            
            {/* Desktop навігація (показується на екранах >= 1024px) */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('challenges')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'challenges'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Челенджі
              </button>
              
              <button
                onClick={() => setCurrentPage('profile')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  currentPage === 'profile'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User size={16} className="mr-1" />
                Профіль
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                Вийти
              </button>
            </div>

            {/* Mobile menu button (показується на екранах < 1024px) */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-label="Відкрити меню"
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
                <button
                  onClick={() => handlePageChange('challenges')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentPage === 'challenges'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Челенджі
                </button>
                
                <button
                  onClick={() => handlePageChange('profile')}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentPage === 'profile'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={20} className="mr-2" />
                  Профіль
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} className="mr-2" />
                  Вийти
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Основний контент */}
      <main>
        {currentPage === 'challenges' ? (
          <RandomChallengeApp />
        ) : (
          <UserProfile onBack={() => setCurrentPage('challenges')} />
        )}
      </main>
    </div>
  );
}

export default App;
