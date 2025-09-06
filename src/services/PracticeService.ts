import { PracticeModel, PracticeSession, Question } from '@/models/Practice';

export class PracticeService {
  static initializeSession(mode: string, level: string, showTips: boolean): PracticeSession {
    const totalQuestions = 10;
    
    return {
      mode,
      level,
      showTips,
      currentQuestion: 0,
      totalQuestions,
      score: 0,
      startTime: Date.now(),
      questions: []
    };
  }

  static generateNextQuestion(session: PracticeSession): Question {
    return PracticeModel.generateQuestion(session.mode, session.level);
  }

  static submitAnswer(session: PracticeSession, questionId: string, userAnswer: number): PracticeSession {
    const updatedQuestions = session.questions.map(question => {
      if (question.id === questionId) {
        const isCorrect = question.correctAnswer === userAnswer;
        return {
          ...question,
          userAnswer,
          isCorrect,
          timeSpent: Date.now() - session.startTime
        };
      }
      return question;
    });

    const score = PracticeModel.calculateScore({
      ...session,
      questions: updatedQuestions
    });

    return {
      ...session,
      questions: updatedQuestions,
      score,
      currentQuestion: session.currentQuestion + 1
    };
  }

  static isSessionComplete(session: PracticeSession): boolean {
    return session.currentQuestion >= session.totalQuestions;
  }

  static saveResults(session: PracticeSession) {
    const results = JSON.parse(localStorage.getItem('bmb:results') || '[]');
    
    const result = {
      id: crypto.randomUUID(),
      mode: session.mode,
      level: session.level,
      score: session.score,
      totalQuestions: session.totalQuestions,
      timeTaken: Date.now() - session.startTime,
      date: new Date().toISOString(),
      questions: session.questions
    };

    results.push(result);
    localStorage.setItem('bmb:results', JSON.stringify(results));
    
    return result;
  }

  static getResults() {
    return JSON.parse(localStorage.getItem('bmb:results') || '[]');
  }
}