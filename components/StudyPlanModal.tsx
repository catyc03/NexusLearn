import React, { useState } from 'react';
import Modal from './common/Modal';
import Button from './common/Button';
import { HistoricalStudyPlan, CalendarEvent, Reminder, Subject } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { BellIcon } from './icons/BellIcon';

interface StudyPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: HistoricalStudyPlan;
    subjects: Subject[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let currentList: React.ReactElement[] = [];

    const flushList = () => {
        if (currentList.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-6 my-2 space-y-1 text-slate-600 dark:text-slate-400">{currentList}</ul>);
            currentList = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('* ') || line.startsWith('- ')) {
            currentList.push(<li key={index}>{line.substring(2)}</li>);
        } else {
            flushList();
            if (line.startsWith('## ')) {
                elements.push(<h2 key={index} className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2">{line.substring(3)}</h2>);
            } else if (line.startsWith('### ')) {
                elements.push(<h3 key={index} className="text-lg font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-1">{line.substring(4)}</h3>);
            } else if (line.trim() !== '') {
                elements.push(<p key={index} className="text-slate-600 dark:text-slate-400 leading-relaxed">{line}</p>);
            }
        }
    });

    flushList(); 
    return <div className="prose max-w-none dark:prose-invert">{elements}</div>;
};

const StudyPlanModal: React.FC<StudyPlanModalProps> = ({ isOpen, onClose, plan, subjects, setEvents, setReminders }) => {
    const [feedback, setFeedback] = useState('');

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleAddToCalendar = () => {
        const now = new Date();
        // Simple event: starts now, lasts 1 hour. A more complex implementation could parse the plan.
        const startTime = now;
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        const subject = subjects.find(s => s.title === plan.subjectTitle);

        const newEvent: CalendarEvent = {
            id: `event-${Date.now()}`,
            title: `Study: ${plan.subjectTitle}`,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            planId: plan.id,
            color: subject?.color,
        };
        setEvents(prev => [...prev, newEvent]);
        showFeedback('Added to your in-app calendar!');
    };

    const handleSetReminder = () => {
       // Simple reminder: 10 minutes from now.
       const remindTime = new Date(new Date().getTime() + 10 * 60 * 1000);
       const newReminder: Reminder = {
           id: `reminder-${Date.now()}`,
           subjectTitle: plan.subjectTitle,
           remindAt: remindTime.toISOString(),
           planId: plan.id,
       };
       setReminders(prev => [...prev, newReminder].sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime()));
       showFeedback('Reminder set in your reminder box!');
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Study Plan: ${plan.subjectTitle}`}
            footer={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                     <div className="text-sm text-green-600 dark:text-green-400 h-5 transition-opacity duration-300">
                        {feedback}
                    </div>
                    <div className="flex gap-3">
                         <Button variant="secondary" onClick={handleSetReminder}>
                            <BellIcon className="w-4 h-4 mr-2" />
                            Set Reminder
                        </Button>
                        <Button onClick={handleAddToCalendar}>
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Add to Calendar
                        </Button>
                    </div>
                </div>
            }
        >
            <FormattedContent content={plan.plan.plan} />

            {plan.plan.sources && plan.plan.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">Further Reading</h3>
                    <ul className="space-y-2">
                        {plan.plan.sources.map((source, index) => (
                            <li key={index}>
                                <a 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-light/80 underline underline-offset-2 transition-colors"
                                >
                                    {source.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Modal>
    );
};

export default StudyPlanModal;