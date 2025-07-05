/**
 * @fileoverview A reusable and styled input component with a label and error message support.
 */
import React from 'react';

/**
 * Props for the Input component. Extends standard HTML input attributes.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The label text to display above the input. */
  label?: string;
  /** Additional CSS classes to apply to the input element. */
  className?: string;
  /** An error message to display below the input. */
  error?: string;
}

/**
 * A styled form input component that supports labels, error messages, and ref forwarding.
 * `React.forwardRef` is used to allow parent components to get a direct reference to the
 * underlying HTML input element, which is useful for actions like programmatically focusing the input.
 * @param {InputProps} props The properties for the input.
 * @param {React.Ref<HTMLInputElement>} ref The forwarded ref.
 * @returns {React.ReactElement} A div containing the label, input, and error message.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
        <input
          id={id}
          ref={ref}
          className={`flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);

// Set a display name for the component, which is useful for debugging.
Input.displayName = 'Input';

export default Input;
