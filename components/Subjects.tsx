import React, { useState } from 'react';
import { Subject, StudyPlan } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon } from './icons/PlusIcon';
import SubjectCard from './SubjectCard';
import SubjectFormModal from './SubjectFormModal';
import { generateStudyPlan } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';

interface SubjectsProps {
    subjects: Subject[];
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
    onPlanGenerated: (subject: Subject, plan: StudyPlan) => void;
}

const Subjects: React.FC<SubjectsProps> = ({ subjects, setSubjects, onPlanGenerated }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [generatingFor, setGeneratingFor] = useState<string | null>(null); // subjectId
    const [error, setError] = useState('');

    const handleSaveSubject = (subject: Subject) => {
        if (editingSubject) {
            setSubjects(subjects.map(s => s.id === subject.id ? subject : s));
        } else {
            setSubjects([subject, ...subjects]);
        }
        setEditingSubject(null);
        setIsFormOpen(false);
    };

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setIsFormOpen(true);
    };

    const handleDelete = (subjectId: string) => {
        setSubjects(subjects.filter(s => s.id !== subjectId));
    };
    
    const handleGeneratePlan = async (subject: Subject) => {
        setGeneratingFor(subject.id);
        setError('');
        try {
            const plan = await generateStudyPlan(subject.title, subject.description);
            onPlanGenerated(subject, plan);
        } catch (err: any) {
            setError(err.message || 'An error occurred while generating the plan.');
        } finally {
            setGeneratingFor(null);
        }
    };

    return (
        <Card>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Subjects</h2>
                    <Button onClick={() => { setEditingSubject(null); setIsFormOpen(true); }}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Subject
                    </Button>
                </div>

                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <div className="space-y-4">
                    {subjects.length > 0 ? (
                        subjects.map(subject => (
                            <SubjectCard 
                                key={subject.id} 
                                subject={subject}
                                onEdit={() => handleEdit(subject)}
                                onDelete={() => handleDelete(subject.id)}
                                onGeneratePlan={() => handleGeneratePlan(subject)}
                                isGenerating={generatingFor === subject.id}
                                setSubjects={setSubjects}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                            <p className="text-slate-500 dark:text-slate-400">No subjects added yet.</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500">Click "Add Subject" to get started!</p>
                        </div>
                    )}
                </div>
            </div>
            {isFormOpen && (
                <SubjectFormModal
                    isOpen={isFormOpen}
                    onClose={() => { setIsFormOpen(false); setEditingSubject(null); }}
                    onSave={handleSaveSubject}
                    subject={editingSubject}
                />
            )}
        </Card>
    );
};

export default Subjects;