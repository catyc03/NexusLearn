
import React from 'react';
import Logo from './Logo';
import { TwitterIcon } from './icons/TwitterIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-100 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Logo className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">NexusLearn</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Your AI-powered learning companion.
                        </p>
                         <p className="text-slate-400 dark:text-slate-500 text-xs pt-2">
                            Powered by Gemini API
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                         <div>
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Navigate</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">Focus Helper</a></li>
                                <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">Budget Planner</a></li>
                            </ul>
                        </div>
                         <div>
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Resources</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">About Us</a></li>
                                <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="md:justify-self-end">
                        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Connect</h3>
                        <div className="flex mt-4 space-x-4">
                            <a href="#" className="text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                                <TwitterIcon className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                                <GitHubIcon className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                                <LinkedInIcon className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} NexusLearn. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
