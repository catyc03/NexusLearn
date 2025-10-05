import React, { useState } from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { BellIcon } from './icons/BellIcon';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { View } from '../App';
import { Reminder } from '../types';
import RemindersPopover from './RemindersPopover';
import { useAuth } from '../context/AuthContext';
import Button from './common/Button';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';

interface HeaderProps {
    activeView: View;
    setActiveView: (view: View) => void;
    reminders: Reminder[];
    setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, reminders, setReminders }) => {
    const [isRemindersOpen, setIsRemindersOpen] = useState(false);
    const { currentUser, logout } = useAuth();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
        { id: 'calendar', label: 'Calendar', icon: <CalendarDaysIcon className="w-5 h-5 mr-2" /> },
        { id: 'budget', label: 'Budget', icon: <CurrencyDollarIcon className="w-5 h-5 mr-2" /> },
        { id: 'settings', label: 'Settings', icon: <Cog6ToothIcon className="w-5 h-5 mr-2" /> },
    ];

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3">
                    <div className="flex items-center space-x-3">
                        <Logo className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">NexusLearn</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <nav className="flex space-x-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveView(item.id as View)}
                                    className={`flex items-center px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                                        activeView === item.id 
                                        ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow' 
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/50'
                                    }`}
                                    aria-current={activeView === item.id ? 'page' : undefined}
                                >
                                    {item.icon}
                                    <span className="hidden md:inline">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                        <div className="relative">
                            <button
                                onClick={() => setIsRemindersOpen(prev => !prev)}
                                className="p-2 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-300/60 dark:hover:bg-slate-700/60 transition-colors duration-200 relative"
                                aria-label="Toggle reminders"
                            >
                                <BellIcon className="w-6 h-6" />
                                {reminders.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-white text-xs font-bold">
                                        {reminders.length}
                                    </span>
                                )}
                            </button>
                            {isRemindersOpen && (
                                <RemindersPopover
                                    reminders={reminders}
                                    setReminders={setReminders}
                                    onClose={() => setIsRemindersOpen(false)}
                                />
                            )}
                        </div>
                        <ThemeToggle />
                         <div className="hidden sm:flex items-center pl-2 ml-2 border-l border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-slate-500 dark:text-slate-400">Signed in as</span>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[150px]" title={currentUser?.name || currentUser?.email}>
                                    {currentUser?.name || currentUser?.email}
                                </span>
                            </div>
                            <Button variant="secondary" onClick={logout} className="ml-3 px-3 py-1.5 text-xs">Logout</Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;