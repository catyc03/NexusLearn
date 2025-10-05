import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BudgetPlanner from './components/BudgetPlanner';
import Footer from './components/Footer';
import useLocalStorage from './hooks/useLocalStorage';
import { CalendarEvent, Reminder } from './types';
import CalendarView from './components/CalendarView';
import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import SettingsPage from './components/SettingsPage';

export type View = 'dashboard' | 'budget' | 'calendar' | 'settings';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useLocalStorage<View>('activeView', 'dashboard');
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('calendarEvents', []);
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        reminders={reminders}
        setReminders={setReminders}
      />
      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        {activeView === 'dashboard' && (
          <Dashboard 
            setEvents={setEvents}
            setReminders={setReminders}
          />
        )}
        {activeView === 'budget' && <BudgetPlanner />}
        {activeView === 'calendar' && <CalendarView events={events} />}
        {activeView === 'settings' && <SettingsPage />}
      </main>
      <Footer />
    </div>
  );
};

export default App;