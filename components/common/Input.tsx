import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// FIX: Update the Input component to forward refs to the underlying input element. This fixes an issue where a ref could not be attached to the custom Input component.
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
    const baseClasses = 'block w-full px-4 py-2.5 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 dark:focus:ring-primary/30 sm:text-sm disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed transition duration-200';

    return (
        <input
            ref={ref}
            className={`${baseClasses} ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;
