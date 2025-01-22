import { createContext } from "react";

export const QuestionContext = createContext({
  currentQuestion: {
    id: 0,
    isActive: true,
    question: "",
    answers: [{ id: 0, cevap: "" }],
    correntAnswerId: 0,
    isAnswerCorrect: undefined,
  },
});
