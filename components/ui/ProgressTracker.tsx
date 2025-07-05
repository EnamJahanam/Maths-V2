/**
 * @fileoverview A component to visualize progress as a circular percentage bar.
 */
import React from 'react';

/**
 * Props for the ProgressTracker component.
 */
interface ProgressTrackerProps {
  /** The progress percentage (0-100). */
  percentage: number;
  /** A label to display below the progress circle. */
  label: string;
  /** A Tailwind CSS text color class for the progress arc. */
  colorClass?: string;
  /** The size (width and height) of the SVG circle. */
  size?: number;
  /** The thickness of the progress circle's stroke. */
  strokeWidth?: number;
}

/**
 * A circular progress bar component.
 * It uses SVG and CSS stroke properties to create an animated circular indicator.
 * @param {ProgressTrackerProps} props The properties for the progress tracker.
 * @returns {React.ReactElement} A div containing the SVG progress circle and a label.
 */
const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  percentage,
  label,
  colorClass = 'text-indigo-600',
  size = 120,
  strokeWidth = 10,
}) => {
  // Calculate the radius of the circle, accounting for the stroke width.
  const radius = (size - strokeWidth) / 2;
  // Calculate the total circumference of the circle.
  const circumference = 2 * Math.PI * radius;
  // Calculate the stroke-dashoffset to represent the percentage.
  // A higher percentage means a smaller offset.
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* The background circle (the "track"). */}
          <circle
            className="text-slate-200"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* The foreground circle (the "progress"). */}
          <circle
            className={colorClass}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            // `strokeDasharray` creates a dashed line pattern. Here, the pattern is the full circumference.
            strokeDasharray={circumference}
            // `strokeDashoffset` moves the start of the dash pattern. This creates the "filling" effect.
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
        </svg>
        {/* The text label displaying the percentage in the center of the circle. */}
        <span className="absolute text-xl font-bold text-slate-700">{`${Math.round(percentage)}%`}</span>
      </div>
      <p className="text-sm font-medium text-slate-600 text-center">{label}</p>
    </div>
  );
};

export default ProgressTracker;
