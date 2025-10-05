import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import Input from './common/Input';
import { Subject } from '../types';
import { BotIcon } from './icons/BotIcon';

interface StudyBuddyProps {
    isOpen: boolean;
    onClose: () => void;
    subjects: Subject[];
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const StudyBuddy: React.FC<StudyBuddyProps> = ({ isOpen, onClose, subjects, setSubjects }) => {
    const { messages, isLoading, sendMessage } = useChat(subjects, setSubjects);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300); // Focus after transition
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput('');
        }
    };
    
    return (
        <>
            <style>{`
                .chat-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .chat-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .chat-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #94a3b8;
                    border-radius: 20px;
                    border: 3px solid transparent;
                }
                .dark .chat-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #475569;
                }

                @keyframes typing-bubble {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            `}</style>
             <div 
                className={`fixed inset-0 z-[60] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                {/* Backdrop for mobile */}
                <div 
                    className="absolute inset-0 bg-black/30 sm:hidden"
                    onClick={onClose}
                ></div>

                {/* Chat Window */}
                <div className={`
                    fixed bottom-0 right-0 h-full w-full 
                    sm:bottom-24 sm:right-6 sm:h-auto sm:w-auto 
                    flex items-end justify-center sm:justify-end
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-10'}`
                }>
                    <div 
                        className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col w-full h-full max-h-full sm:w-[400px] sm:h-auto sm:max-h-[calc(100vh-120px)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl sm:rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <BotIcon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Study Buddy</h3>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Close chat">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="flex-grow p-4 overflow-y-auto chat-scrollbar">
                            <div className="space-y-4">
                                {messages.length === 0 && (
                                     <div className="flex items-end gap-2 justify-start">
                                         <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg">
                                             <p className="text-sm font-semibold mb-2">Hello! I'm your AI Study Buddy.</p>
                                             {subjects.length > 0 ? (
                                                 <>
                                                     <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">I see you're focusing on these subjects. How can I help you today?</p>
                                                     <div className="flex flex-wrap gap-2">
                                                         {subjects.map(subject => (
                                                             <span 
                                                                key={subject.id} 
                                                                className="text-xs font-semibold text-white px-2.5 py-1 rounded-full shadow-md" 
                                                                style={{ 
                                                                    backgroundColor: subject.color,
                                                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                                                }}
                                                             >
                                                                 {subject.title}
                                                             </span>
                                                         ))}
                                                     </div>
                                                 </>
                                             ) : (
                                                  <p className="text-xs text-slate-600 dark:text-slate-400">Add some subjects on your dashboard, and I'll be able to help you even better!</p>
                                             )}
                                         </div>
                                     </div>
                                )}

                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`}>
                                            <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {(isLoading && messages[messages.length - 1]?.role !== 'model') || (isLoading && messages[messages.length -1]?.text === '') && (
                                    <div className="flex justify-start">
                                        <div className="px-4 py-2.5 rounded-2xl rounded-bl-lg bg-slate-200 dark:bg-slate-700">
                                            <div className="flex items-center space-x-1.5">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full" style={{animation: 'typing-bubble 1s infinite ease-in-out'}}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full" style={{animation: 'typing-bubble 1s infinite ease-in-out 0.2s'}}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full" style={{animation: 'typing-bubble 1s infinite ease-in-out 0.4s'}}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div ref={messagesEndRef} />
                        </div>

                        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Input 
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className="flex-grow"
                                    aria-label="Chat input"
                                />
                                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2.5 rounded-lg bg-primary text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors flex-shrink-0" aria-label="Send message">
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudyBuddy;