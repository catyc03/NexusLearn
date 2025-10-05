import React, { useState, useCallback } from 'react';
import { Subject, Goal } from '../types';
import Button from './common/Button';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import ProgressBar from './common/ProgressBar';
import Input from './common/Input';
import { PlusIcon } from './icons/PlusIcon';
import LoadingSpinner from './common/LoadingSpinner';

interface SubjectCardProps {
    subject: Subject;
    onEdit: () => void;
    onDelete: () => void;
    onGeneratePlan: () => void;
    isGenerating: boolean;
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onEdit, onDelete, onGeneratePlan, isGenerating, setSubjects }) => {
    const [newGoal, setNewGoal] = useState('');

    const updateSubject = useCallback((updatedSubject: Subject) => {
        setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
    }, [setSubjects]);

    const handleAddGoal = () => {
        if (!newGoal.trim()) return;
        const goal: Goal = { id: `goal-${Date.now()}`, text: newGoal.trim(), completed: false };
        const updatedGoals = [...subject.goals, goal];
        const newProgress = (updatedGoals.filter(g => g.completed).length / updatedGoals.length) * 100;
        updateSubject({ ...subject, goals: updatedGoals, progress: newProgress });
        setNewGoal('');
    };

    const handleToggleGoal = (goalId: string) => {
        const updatedGoals = subject.goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g);
        const newProgress = (updatedGoals.filter(g => g.completed).length / updatedGoals.length) * 100;
        updateSubject({ ...subject, goals: updatedGoals, progress: newProgress });
    };

    const handleDeleteGoal = (goalId: string) => {
        const updatedGoals = subject.goals.filter(g => g.id !== goalId);
        const newProgress = updatedGoals.length > 0 ? (updatedGoals.filter(g => g.completed).length / updatedGoals.length) * 100 : 0;
        updateSubject({ ...subject, goals: updatedGoals, progress: newProgress });
    };

    return (
        <div 
            className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-lg border border-l-4 border-slate-200 dark:border-slate-700"
            style={{ borderLeftColor: subject.color || 'transparent' }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{subject.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subject.description}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button onClick={onEdit} className="p-2 text-slate-500 hover:text-primary dark:hover:text-primary-light transition-colors" aria-label="Edit Subject"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-500 transition-colors" aria-label="Delete Subject"><TrashIcon className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Progress</span>
                    <span className="text-xs font-semibold" style={{ color: subject.color || '#0891b2'}}>{Math.round(subject.progress)}%</span>
                </div>
                <ProgressBar progress={subject.progress} color={subject.color} />
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Goals</h4>
                <div className="space-y-2">
                    {subject.goals.map(goal => (
                        <div key={goal.id} className="flex items-center justify-between bg-white dark:bg-slate-700/50 p-2 rounded-md">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={goal.completed} onChange={() => handleToggleGoal(goal.id)} className="form-checkbox h-4 w-4 rounded text-primary focus:ring-primary/50" style={{ color: subject.color }}/>
                                <span className={`text-sm ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>{goal.text}</span>
                            </label>
                             <button onClick={() => handleDeleteGoal(goal.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors" aria-label="Delete Goal"><TrashIcon className="w-3 h-3" /></button>
                        </div>
                    ))}
                </div>
                 <div className="flex items-center gap-2 mt-3">
                    <Input 
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Add a new goal..."
                        onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                        className="flex-grow py-1.5 text-sm"
                    />
                    <Button variant="secondary" onClick={handleAddGoal} className="py-1.5 px-3"><PlusIcon className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button onClick={onGeneratePlan} disabled={isGenerating} className="w-full">
                    {isGenerating ? <LoadingSpinner /> : 'Generate Study Plan'}
                </Button>
            </div>
        </div>
    );
};

export default SubjectCard;