import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import Card from './common/Card';

const CalendarView: React.FC<{ events: CalendarEvent[] }> = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const daysInMonth = endOfMonth.getDate();

    const getEventsForDay = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return events.filter(event => {
            const eventStart = new Date(event.start);
            return eventStart.toDateString() === date.toDateString();
        });
    };
    
    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <Card>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => changeMonth(-1)} className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">&larr;</button>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">&rarr;</button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                    {days.map(day => (
                        <div key={day} className="font-semibold text-slate-600 dark:text-slate-400 text-sm py-2">{day}</div>
                    ))}
                    
                    {Array.from({ length: startDay }).map((_, index) => (
                        <div key={`empty-${index}`} className="border border-slate-200/50 dark:border-slate-700/50 rounded-md h-28"></div>
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                        const day = dayIndex + 1;
                        const dayEvents = getEventsForDay(day);
                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                        
                        return (
                            <div key={day} className={`border border-slate-200/50 dark:border-slate-700/50 rounded-md h-28 p-1.5 flex flex-col ${isToday ? 'bg-primary/10' : ''}`}>
                                <span className={`font-semibold text-xs ${isToday ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>{day}</span>
                                <div className="mt-1 space-y-1 overflow-y-auto text-left">
                                    {dayEvents.map(event => (
                                        <div 
                                            key={event.id} 
                                            className="text-white text-xs p-1 rounded-md truncate" 
                                            title={event.title}
                                            style={{ backgroundColor: event.color || '#0891b2' }}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};

export default CalendarView;