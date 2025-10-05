import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import Logo from './Logo';
import LoadingSpinner from './common/LoadingSpinner';

const AuthPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                     <div className="flex items-center space-x-3">
                        <Logo className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">NexusLearn</h1>
                    </div>
                </div>
                <Card>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
                            {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
                        </h2>
                        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                            {isLoginView ? 'Log in to continue your learning journey.' : 'Join to start planning your success.'}
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    placeholder="you@example.com" 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    placeholder="••••••••" 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <div>
                                <Button type="submit" className="w-full text-base" disabled={isLoading}>
                                    {isLoading ? <LoadingSpinner /> : (isLoginView ? 'Log In' : 'Sign Up')}
                                </Button>
                            </div>
                        </form>
                         <div className="mt-6 text-center">
                            <button onClick={() => {setIsLoginView(!isLoginView); setError('')}} className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-light/80">
                                {isLoginView ? 'Don\'t have an account? Sign up' : 'Already have an account? Log in'}
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AuthPage;
