import { createContext } from "react";

export const QuestionContext = createContext({
  questions: [{
    id: 0,
    isActive: true,
    question: "",
    options: [{ id: 0, option: "" }],
    correntAnswerId: 0,
    isAnswerCorrect: undefined,
  }],
});
