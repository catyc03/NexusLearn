import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const SettingsPage: React.FC = () => {
    const { currentUser, updateUser } = useAuth();
    const [name, setName] = useState(currentUser?.name || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (currentUser?.name) {
            setName(currentUser.name);
        }
    }, [currentUser]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!currentUser) {
            setError("You must be logged in to update settings.");
            setIsLoading(false);
            return;
        }

        try {
            await updateUser({ name });
            setSuccess('Your profile has been updated successfully!');
        } catch (err: any) {
            setError(err.message || "Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Settings</h1>
            <Card>
                <form onSubmit={handleSave}>
                    <div className="p-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">My Profile</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Update your personal information.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 md:pt-3">Email Address</label>
                            <div className="md:col-span-2">
                                <Input 
                                    id="email"
                                    type="email"
                                    value={currentUser?.email || ''}
                                    disabled
                                    className="bg-slate-100 dark:bg-slate-700/50 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 md:pt-3">Full Name</label>
                            <div className="md:col-span-2">
                                <Input 
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Jane Doe"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-4 flex justify-end items-center gap-4 rounded-b-xl">
                        {success && <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <LoadingSpinner /> : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SettingsPage;