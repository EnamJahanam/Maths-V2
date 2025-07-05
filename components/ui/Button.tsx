/**
 * @fileoverview A flexible and reusable button component with multiple style variants and sizes.
 */
import React from 'react';

/**
 * Props for the Button component. Extends standard HTML button attributes.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The content to be displayed inside the button. */
  children: React.ReactNode;
  /** The style variant of the button. */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** The size of the button. */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes to apply to the button. */
  className?: string;
}

/**
 * A styled button component that can be customized with different variants and sizes.
 * It's built with accessibility and consistent styling in mind.
 * @param {ButtonProps} props The properties for the button.
 * @returns {React.ReactElement} A button element.
 */
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  // Base classes for all button variants, defining layout, font, and transitions.
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Classes specific to each button variant (color, background, hover states).
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
  };

  // Classes for different button sizes (height, padding).
  // 'md' is designed to meet a minimum touch target size of 44px.
  const sizeClasses = {
    sm: 'h-9 px-3',
    md: 'px-4 py-2 min-h-[44px]',
    lg: 'h-12 px-6 text-base',
  };

  // Combine all classes to generate the final className string.
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
