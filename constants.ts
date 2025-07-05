/**
 * @fileoverview This file defines constants used throughout the application,
 * making it easy to manage and update configuration data in one place.
 */
import type { Operation } from './types';

/**
 * A record containing detailed configuration for each mathematical operation.
 * - `name`: The display name of the operation.
 * - `stages`: The number of difficulty stages available.
 * - `color`: A Tailwind CSS background color class for styling UI elements related to this operation.
 */
export const OPERATIONS: Record<Operation, { name: string; stages: number; color: string }> = {
  addition: { name: 'Addition', stages: 3, color: 'bg-blue-500' },
  subtraction: { name: 'Subtraction', stages: 2, color: 'bg-green-500' },
  multiplication: { name: 'Multiplication', stages: 3, color: 'bg-red-500' },
};

/**
 * An array of available timer options (in seconds) for each quiz question.
 * This allows students to choose their desired challenge level.
 */
export const TIMER_OPTIONS = [8, 4, 3];
