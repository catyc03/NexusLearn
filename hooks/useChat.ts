import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, GenerateContentResponse } from '@google/genai';
import { ChatMessage, Subject } from '../types';
import useLocalStorage from './useLocalStorage';

// This check is for client-side, so we guard it
if (typeof process.env.API_KEY === 'undefined') {
    console.error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const colorPalette = [
    '#38bdf8', // sky-400
    '#fb923c', // orange-400
    '#4ade80', // green-400
    '#a78bfa', // violet-400
    '#f472b6', // pink-400
    '#2dd4bf', // teal-400
];

const addSubjectTool: FunctionDeclaration = {
    name: 'addSubject',
    description: 'Adds a new subject to the student\'s list of subjects.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: 'The title of the subject, e.g., "Quantum Mechanics".'
            },
            description: {
                type: Type.STRING,
                description: 'A brief description of the subject. (Optional)'
            }
        },
        required: ['title']
    }
};

export const useChat = (subjects: Subject[], setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>) => {
    const [messages, setMessages] = useLocalStorage<ChatMessage[]>('studyBuddyChatHistory', []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);

    useEffect(() => {
        const subjectList = subjects.length > 0 ? subjects.map(s => s.title).join(', ') : 'no specific subjects listed yet';
        const systemInstruction = `You are Study Buddy, an AI assistant for students. Be friendly, encouraging, and helpful. The student is currently studying the following subjects: ${subjectList}. Tailor your answers to these subjects if possible. Keep your answers concise. If the user mentions a new subject they are studying, ask if they would like to add it to their subject list. If they agree, call the 'addSubject' function to add it for them.`;
        
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
                tools: [{ functionDeclarations: [addSubjectTool] }]
            },
        });
    }, [subjects]);

    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || !chatRef.current) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            text: messageText,
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await chatRef.current.sendMessageStream({ message: messageText });
            
            let modelResponse = '';
            const modelMessageId = `model-${Date.now()}`;
            setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);
            
            let collectedFunctionCalls: any[] = [];

            for await (const chunk of result) {
                 if (chunk.text) {
                    modelResponse += chunk.text;
                    setMessages(prev => prev.map(msg => msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg));
                }
                if (chunk.functionCalls) {
                    collectedFunctionCalls.push(...chunk.functionCalls);
                }
            }
            
            if (collectedFunctionCalls.length > 0) {
                 // Keep loading for the function call turn
                setIsLoading(true);

                const fc = collectedFunctionCalls[0];
                let functionResponsePayload;

                if (fc.name === 'addSubject') {
                    const { title, description } = fc.args;
                    if (title) {
                        const newSubject: Subject = {
                            id: `subj-${Date.now()}`,
                            title: title,
                            description: description || '',
                            goals: [],
                            progress: 0,
                            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
                        };
                        setSubjects(prev => [newSubject, ...prev]);
                    }
                    
                    functionResponsePayload = {
                        parts: [{
                            functionResponse: {
                                name: 'addSubject',
                                response: { result: `Successfully added subject: ${title}` },
                            }
                        }]
                    };
                }

                if (functionResponsePayload) {
                    const result2 = await chatRef.current.sendMessageStream(functionResponsePayload);
                    let modelResponse2 = '';
                    const modelMessageId2 = `model-${Date.now()}-2`;
                    setMessages(prev => [...prev, { id: modelMessageId2, role: 'model', text: '' }]);

                    for await (const chunk of result2) {
                        modelResponse2 += chunk.text;
                        setMessages(prev => prev.map(msg => msg.id === modelMessageId2 ? { ...msg, text: modelResponse2 } : msg));
                    }
                }
            }

        } catch (e: any) {
            console.error("Chat error:", e);
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                role: 'model',
                text: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
            setError('Failed to get response from AI.');
        } finally {
            setIsLoading(false);
        }
    }, [setSubjects]);

    return { messages, isLoading, error, sendMessage };
};