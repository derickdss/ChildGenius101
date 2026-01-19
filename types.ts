
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum MathOperation {
  ADDITION = '+',
  SUBTRACTION = '-',
  MULTIPLICATION = '×',
  DIVISION = '÷'
}

export interface UserStats {
  level: number;
  exp: number;
  problemsSolved: number;
  streak: number;
  history: {
    date: string;
    score: number;
  }[];
}

export interface MathProblem {
  id: string;
  question: string;
  answer: number;
  options: number[];
  explanation?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
