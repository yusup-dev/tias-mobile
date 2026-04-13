export type CbtExam = {
  id: string;
  title: string;
  startedAt: string;
  endedAt: string;
  status: 'upcoming' | 'ongoing' | 'finished';
};

export type CbtQuestion = {
  id: string;
  examId: string;
  questionText: string;
  maxScore: number;
};

export type CbtAnswerScoreRequest = {
  examId: string;
  questionId: string;
  studentId: string;
  answerText: string;
};

export type CbtAnswerScoreResponse = {
  similarityScore: number;
  grade: string;
  feedback: string;
  referenceAnswerId?: string;
};