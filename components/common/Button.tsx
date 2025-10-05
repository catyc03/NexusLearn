import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center px-5 py-2.5 border text-sm font-semibold rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'text-white bg-primary hover:bg-primary-dark border-transparent focus:ring-primary/30 dark:focus:ring-primary/50',
        secondary: 'text-primary bg-primary/10 hover:bg-primary/20 border-transparent focus:ring-primary/30 dark:text-primary-light dark:bg-primary/20 dark:hover:bg-primary/30',
    };

    return (
        <button
            type="button"
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;