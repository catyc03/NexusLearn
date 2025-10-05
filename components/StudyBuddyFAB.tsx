import React, { useState } from 'react';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import StudyBuddy from './StudyBuddy';
import { Subject } from '../types';

interface StudyBuddyFABProps {
    subjects: Subject[];
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const StudyBuddyFAB: React.FC<StudyBuddyFABProps> = ({ subjects, setSubjects }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out z-50"
                aria-label="Open Study Buddy"
            >
                <ChatBubbleIcon className="w-8 h-8" />
            </button>
            <StudyBuddy 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                subjects={subjects} 
                setSubjects={setSubjects} 
            />
        </>
    );
};

export default StudyBuddyFAB;