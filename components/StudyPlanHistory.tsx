import React from 'react';
import { HistoricalStudyPlan } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface StudyPlanHistoryProps {
    history: HistoricalStudyPlan[];
    onViewPlan: (plan: HistoricalStudyPlan) => void;
}

const StudyPlanHistory: React.FC<StudyPlanHistoryProps> = ({ history, onViewPlan }) => {
    return (
        <Card>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">My Plans History</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                     {history.length > 0 ? (
                        history.map(item => (
                            <div key={item.id} className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg">
                                <p className="font-semibold text-slate-700 dark:text-slate-200">{item.subjectTitle}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {new Date(item.date).toLocaleDateString()}
                                    </p>
                                    <Button variant="secondary" onClick={() => onViewPlan(item)} className="px-3 py-1 text-xs">
                                        Review
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                            <p className="text-slate-500 dark:text-slate-400">No plans generated yet.</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500">Your plan history will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default StudyPlanHistory;