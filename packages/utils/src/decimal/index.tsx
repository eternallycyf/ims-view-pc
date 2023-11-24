import Decimal from 'decimal.js';

/**
 * Encapsulates basic arithmetic operations using Decimal.js for precise decimal calculations.
 */
const Calculator = {
  /**
   * Adds two numbers with precision.
   * @param {number} a - The first number.
   * @param {number} b - The second number.
   * @returns {number} - The result of the addition.
   */
  add: (a: number, b: number): number => {
    const num1 = new Decimal(a);
    const num2 = new Decimal(b);
    return num1.plus(num2).toNumber();
  },

  /**
   * Subtracts the second number from the first with precision.
   * @param {number} a - The first number.
   * @param {number} b - The second number.
   * @returns {number} - The result of the subtraction.
   */
  subtract: (a: number, b: number): number => {
    const num1 = new Decimal(a);
    const num2 = new Decimal(b);
    return num1.minus(num2).toNumber();
  },

  /**
   * Multiplies two numbers with precision.
   * @param {number} a - The first number.
   * @param {number} b - The second number.
   * @returns {number} - The result of the multiplication.
   */
  multiply: (a: number, b: number): number => {
    const num1 = new Decimal(a);
    const num2 = new Decimal(b);
    return num1.times(num2).toNumber();
  },

  /**
   * Divides the first number by the second with precision.
   * @param {number} a - The numerator.
   * @param {number} b - The denominator.
   * @returns {number} - The result of the division.
   */
  divide: (a: number, b: number): number => {
    const num1 = new Decimal(a);
    const num2 = new Decimal(b);
    return num1.dividedBy(num2).toNumber();
  },
};

// Export encapsulated functions
export default Calculator;
