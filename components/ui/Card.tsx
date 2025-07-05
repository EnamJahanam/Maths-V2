/**
 * @fileoverview Provides a set of reusable Card components for creating
 * consistent and styled content containers, following a common UI pattern.
 */
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The main Card container component. It provides a styled wrapper with a border,
 * background, and shadow.
 * @param {CardProps} props The properties for the card.
 * @returns {React.ReactElement} A styled div element.
 */
const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};

/**
 * A sub-component for the header section of a Card.
 * It typically contains a title and adds a bottom border.
 * @param {CardProps} props The properties for the card header.
 * @returns {React.ReactElement} A styled div for the card header.
 */
export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`pb-4 border-b border-slate-200 mb-4 ${className}`}>{children}</div>;
};

/**
 * A sub-component for the title within a CardHeader.
 * Provides consistent styling for card titles.
 * @param {CardProps} props The properties for the card title.
 * @returns {React.ReactElement} An h2 element with title styling.
 */
export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
    return <h2 className={`text-xl font-semibold text-slate-800 ${className}`}>{children}</h2>;
};

/**
 * A sub-component for the main content area of a Card.
 * This is where the primary content of the card should be placed.
 * @param {CardProps} props The properties for the card content.
 * @returns {React.ReactElement} A div for the card's content.
 */
export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export default Card;
