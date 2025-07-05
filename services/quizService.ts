/**
 * @fileoverview This service is responsible for generating math questions
 * for the quizzes based on the selected operation and difficulty stage.
 */
import type { Operation, Question } from '../types';

/**
 * Generates a random integer between a given minimum and maximum (inclusive).
 * @param {number} min - The minimum possible value.
 * @param {number} max - The maximum possible value.
 * @returns {number} A random integer within the specified range.
 */
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a new math question based on the specified operation and stage.
 * @param {Operation} operation - The type of math problem (e.g., 'addition').
 * @param {number} stage - The difficulty level for the problem.
 * @returns {Question} An object containing the question text and the correct answer.
 */
export const generateQuestion = (operation: Operation, stage: number): Question => {
  let num1: number, num2: number;

  switch (operation) {
    case 'addition':
      if (stage === 1) { // Basic single-digit addition
        num1 = getRandomInt(0, 5);
        num2 = getRandomInt(0, 5);
      } else if (stage === 2) { // Intermediate addition
        num1 = getRandomInt(0, 10);
        num2 = getRandomInt(0, 10);
      } else { // Stage 3: Advanced addition
        num1 = getRandomInt(0, 20);
        num2 = getRandomInt(0, 20);
      }
      return { text: `${num1} + ${num2} = ?`, answer: num1 + num2 };

    case 'subtraction':
      if (stage === 1) { // Subtraction with minuend up to 10
        num1 = getRandomInt(1, 10); // Minuend
        num2 = getRandomInt(0, num1); // Subtrahend, ensures non-negative result
      } else { // Stage 2: Subtraction with minuend up to 20
        num1 = getRandomInt(1, 20);
        num2 = getRandomInt(0, num1);
      }
      return { text: `${num1} - ${num2} = ?`, answer: num1 - num2 };

    case 'multiplication':
      if (stage === 1) { // Times tables 1-5
        num1 = getRandomInt(1, 5);
        num2 = getRandomInt(1, 5);
      } else if (stage === 2) { // Times tables 6-10
        num1 = getRandomInt(6, 10);
        num2 = getRandomInt(1, 10);
      } else { // Stage 3: Mixed times tables 1-10
        num1 = getRandomInt(1, 10);
        num2 = getRandomInt(1, 10);
      }
      return { text: `${num1} × ${num2} = ?`, answer: num1 * num2 };
    
    default:
      // Fallback case, should not be reached in normal operation.
      return { text: `1 + 1 = ?`, answer: 2 };
  }
};
