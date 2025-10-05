import React, { useState } from 'react';
import Hero from './Hero';
import Subjects from './Subjects';
import StudyPlanHistory from './StudyPlanHistory';
import StudyPlanModal from './StudyPlanModal';
import useLocalStorage from '../hooks/useLocalStorage';
import { Subject, StudyPlan, HistoricalStudyPlan, CalendarEvent, Reminder } from '../types';
import StudyBuddyFAB from './StudyBuddyFAB';

interface DashboardProps {
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ setEvents, setReminders }) => {
    const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
    const [history, setHistory] = useLocalStorage<HistoricalStudyPlan[]>('studyPlanHistory', []);
    const [viewingPlan, setViewingPlan] = useState<HistoricalStudyPlan | null>(null);

    const handlePlanGenerated = (subject: Subject, plan: StudyPlan) => {
        const newPlan: HistoricalStudyPlan = {
            id: `plan-${Date.now()}`,
            subjectTitle: subject.title,
            date: new Date().toISOString(),
            plan: plan,
        };
        setHistory(prev => [newPlan, ...prev]);
        setViewingPlan(newPlan);
    };

    return (
        <div className="space-y-8">
            <Hero />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Subjects 
                        subjects={subjects}
                        setSubjects={setSubjects}
                        onPlanGenerated={handlePlanGenerated}
                    />
                </div>
                <div>
                    <StudyPlanHistory 
                        history={history}
                        onViewPlan={setViewingPlan}
                    />
                </div>
            </div>
            {viewingPlan && (
                <StudyPlanModal
                    isOpen={!!viewingPlan}
                    onClose={() => setViewingPlan(null)}
                    plan={viewingPlan}
                    subjects={subjects}
                    setEvents={setEvents}
                    setReminders={setReminders}
                />
            )}
            <StudyBuddyFAB subjects={subjects} setSubjects={setSubjects} />
        </div>
    );
};

export default Dashboard;