import React from 'react';

interface ProgressBarProps {
    progress: number;
    color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    const barColor = color || '#0891b2'; // Default to primary color

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div 
                className="h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ 
                    width: `${clampedProgress}%`,
                    backgroundColor: barColor
                }}
            ></div>
        </div>
    );
};

export default ProgressBar;