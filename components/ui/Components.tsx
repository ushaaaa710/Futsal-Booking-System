import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';

// --- Utilities ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Button ---
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-black hover:bg-primaryDark font-bold',
      secondary: 'bg-secondary text-white hover:bg-neutral-700',
      outline: 'border border-primary text-primary hover:bg-primary/10',
      danger: 'bg-danger text-white hover:bg-red-600',
      ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-none border border-neutral-700 bg-surface px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
              icon && 'pl-10',
              error && 'border-danger focus:border-danger focus:ring-danger',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-danger mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// --- Card ---
export const Card = ({ className, children, ...props }: HTMLMotionProps<"div">) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn('bg-surface border border-neutral-800 p-6 rounded-none shadow-lg', className)}
    {...props}
  >
    {children}
  </motion.div>
);

// --- Badge ---
export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger', className?: string }) => {
  const variants = {
    default: 'bg-neutral-800 text-gray-300 border-neutral-700',
    success: 'bg-green-900/30 text-green-400 border-green-900',
    warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-900',
    danger: 'bg-red-900/30 text-red-400 border-red-900'
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-1 text-xs font-medium border rounded-none uppercase tracking-wider', variants[variant], className)}>
      {children}
    </span>
  );
};

// --- Modal ---
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-surface border border-neutral-700 w-full max-w-lg shadow-2xl rounded-none relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- Skeleton ---
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-neutral-800 rounded-none", className)} />
);

// --- Star Rating ---
export const StarRating = ({ rating, setRating, readOnly = false }: { rating: number, setRating?: (r: number) => void, readOnly?: boolean }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && setRating && setRating(star)}
          disabled={readOnly}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
        >
          <svg
            className={`w-5 h-5 ${star <= rating ? 'text-warning fill-warning' : 'text-gray-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      ))}
    </div>
  );
};