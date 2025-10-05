import React from 'react';
import { Reminder } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface RemindersPopoverProps {
    reminders: Reminder[];
    setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
    onClose: () => void;
}

const RemindersPopover: React.FC<RemindersPopoverProps> = ({ reminders, setReminders, onClose }) => {
    const handleDismiss = (id: string) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    const handleClearAll = () => {
        setReminders([]);
        onClose();
    };
    
    return (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-30">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">Reminders</h3>
                {reminders.length > 0 && (
                    <button onClick={handleClearAll} className="text-xs text-primary dark:text-primary-light hover:underline">
                        Clear All
                    </button>
                )}
            </div>
            <div className="max-h-64 overflow-y-auto">
                {reminders.length > 0 ? (
                    <ul>
                        {reminders.map(reminder => (
                            <li key={reminder.id} className="p-3 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center group">
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{reminder.subjectTitle}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {new Date(reminder.remindAt).toLocaleString(undefined, {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <button onClick={() => handleDismiss(reminder.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity" aria-label="Dismiss reminder">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        You have no reminders.
                    </p>
                )}
            </div>
        </div>
    );
};

export default RemindersPopover;