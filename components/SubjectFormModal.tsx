import React, { useState, useEffect } from 'react';
import Modal from './common/Modal';
import Input from './common/Input';
import Button from './common/Button';
import { Subject } from '../types';

interface SubjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (subject: Subject) => void;
    subject: Subject | null;
}

const colorPalette = [
    '#38bdf8', // sky-400
    '#fb923c', // orange-400
    '#4ade80', // green-400
    '#a78bfa', // violet-400
    '#f472b6', // pink-400
    '#2dd4bf', // teal-400
];

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({ isOpen, onClose, onSave, subject }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(colorPalette[0]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (subject) {
            setTitle(subject.title);
            setDescription(subject.description);
            setColor(subject.color || colorPalette[0]);
        } else {
            setTitle('');
            setDescription('');
            setColor(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
        }
        setError('');
    }, [subject, isOpen]);

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('Subject title is required.');
            return;
        }
        onSave({
            id: subject ? subject.id : `subj-${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            goals: subject ? subject.goals : [],
            progress: subject ? subject.progress : 0,
            color: color,
        });
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            title={subject ? 'Edit Subject' : 'Add New Subject'}
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Subject</Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Title</label>
                    <Input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Advanced Calculus" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="e.g., A brief overview of the course content"
                        rows={4}
                        className="block w-full px-4 py-2.5 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 dark:focus:ring-primary/30 sm:text-sm transition duration-200"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject Color</label>
                    <div className="flex space-x-3">
                        {colorPalette.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full transition-transform duration-200 ${color === c ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-primary' : ''}`}
                                style={{ backgroundColor: c }}
                                aria-label={`Select color ${c}`}
                            />
                        ))}
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </Modal>
    );
};

export default SubjectFormModal;