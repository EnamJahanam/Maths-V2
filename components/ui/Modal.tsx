/**
 * @fileoverview A reusable modal dialog component for displaying content in a popup overlay.
 */
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * Props for the Modal component.
 */
interface ModalProps {
  /** Whether the modal is currently open and visible. */
  isOpen: boolean;
  /** A function to call when the modal should be closed (e.g., clicking the overlay or close button). */
  onClose: () => void;
  /** The title to be displayed at the top of the modal. */
  title: string;
  /** The content to be rendered inside the modal body. */
  children: ReactNode;
}

/**
 * A modal component that renders its children in a centered overlay.
 * It handles its own visibility based on the `isOpen` prop and provides
 * mechanisms for closing.
 * @param {ModalProps} props The properties for the modal.
 * @returns {React.ReactElement | null} The modal component, or null if it's not open.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // If the modal is not open, render nothing.
  if (!isOpen) return null;

  return (
    // The semi-transparent background overlay. Clicking this will close the modal.
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* The main modal content container. `e.stopPropagation()` prevents a click inside the modal from closing it. */}
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          {/* The close button (X icon). */}
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>
        {/* The body of the modal where child content is rendered. */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
