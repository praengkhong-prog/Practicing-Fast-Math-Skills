export interface PracticeResult {
  id: string;
  user_id: string;
  mode: 'add' | 'subtract' | 'multiply' | 'divide' | 'mix';
  level: 'easy' | 'medium' | 'hard';
  score: number;
  total_questions: number;
  time_taken: number;
  created_at: string;
}

export interface PracticeSession {
  mode: string;
  level: string;
  showTips: boolean;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  startTime: number;
  questions: Question[];
}

export interface Question {
  id: string;
  operand1: number;
  operand2: number;
  operator: string;
  correctAnswer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  timeSpent?: number;
}

export class PracticeModel {
  static generateQuestion(mode: string, level: string): Question {
    const ranges = {
      easy: { min: 1, max: 10 },
      medium: { min: 10, max: 50 },
      hard: { min: 50, max: 100 }
    };

    const range = ranges[level as keyof typeof ranges];
    const operand1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    const operand2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    let operator: string;
    let correctAnswer: number;

    switch (mode) {
      case 'add':
        operator = '+';
        correctAnswer = operand1 + operand2;
        break;
      case 'subtract':
        operator = '-';
        correctAnswer = operand1 - operand2;
        break;
      case 'multiply':
        operator = '×';
        correctAnswer = operand1 * operand2;
        break;
      case 'divide':
        operator = '÷';
        correctAnswer = Math.floor(operand1 / operand2);
        break;
      default:
        const operations = ['+', '-', '×', '÷'];
        operator = operations[Math.floor(Math.random() * operations.length)];
        correctAnswer = this.calculateAnswer(operand1, operand2, operator);
    }

    return {
      id: crypto.randomUUID(),
      operand1,
      operand2,
      operator,
      correctAnswer
    };
  }

  private static calculateAnswer(operand1: number, operand2: number, operator: string): number {
    switch (operator) {
      case '+': return operand1 + operand2;
      case '-': return operand1 - operand2;
      case '×': return operand1 * operand2;
      case '÷': return Math.floor(operand1 / operand2);
      default: return 0;
    }
  }

  static calculateScore(session: PracticeSession): number {
    const correctAnswers = session.questions.filter(q => q.isCorrect).length;
    return Math.round((correctAnswers / session.totalQuestions) * 100);
  }
}