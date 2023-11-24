// Import the Decimal.js library
import Decimal from 'decimal.js';

// Encapsulate addition function
function add(a: number, b: number): number {
  const num1 = new Decimal(a);
  const num2 = new Decimal(b);
  return num1.plus(num2).toNumber();
}

// Encapsulate subtraction function
function subtract(a: number, b: number): number {
  const num1 = new Decimal(a);
  const num2 = new Decimal(b);
  return num1.minus(num2).toNumber();
}

// Encapsulate multiplication function
function multiply(a: number, b: number): number {
  const num1 = new Decimal(a);
  const num2 = new Decimal(b);
  return num1.times(num2).toNumber();
}

// Encapsulate division function
function divide(a: number, b: number): number {
  const num1 = new Decimal(a);
  const num2 = new Decimal(b);
  return num1.dividedBy(num2).toNumber();
}

// Export encapsulated functions
export default { add, subtract, multiply, divide };
