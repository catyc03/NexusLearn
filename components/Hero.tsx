import React from 'react';
import Card from './common/Card';
import { useAuth } from '../context/AuthContext';

const Hero: React.FC = () => {
    const { currentUser } = useAuth();

    return (
        <Card className="relative overflow-hidden bg-slate-800 text-white shadow-2xl">
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}
            ></div>
            <div className="relative p-8 md:p-12">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                    {currentUser?.name ? `Welcome, ${currentUser.name}!` : 'Welcome, Student!'}
                </h1>
                <p className="mt-2 md:mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">
                    Your personalized dashboard to conquer the semester. Let's get started.
                </p>
                <div className="mt-6">
                    <span className="inline-block bg-secondary/80 text-white text-sm font-semibold px-4 py-2 rounded-full">
                        "The beautiful thing about learning is that no one can take it away from you." – B.B. King
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default Hero;