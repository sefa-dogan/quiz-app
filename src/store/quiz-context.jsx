import { createContext, useReducer, useEffect, useRef } from "react";
import { questions } from "./questions.js";

export const QuestionContext = createContext({
  questions: [{
    id: 0,
    isActive: true,
    question: "",
    options: [{ id: 0, option: "" }],
    correntAnswerId: 0,
    isAnswerCorrect: undefined,
  }],
  handleOnNextQuestion: () => { },
  isDone: false,
});


export default function QuestionContextProvider({ children }) {

  const isDone = useRef(false);
  function getRandomId(state) {
    const isDone = handleDoneQuiz(state);
    if (isDone) {
      let randomId = Math.floor(Math.random() * 10);
      let question = getQuestion(state, randomId);
      return question.isAnswerCorrect === undefined
        ? randomId
        : getRandomId(state);
    }
  }

  function handleQuestionsReduce(state, action) {
    const { type, userAnswer } = action;
    let updatedQuestions;

    if (type === "START") {
      const randomId = getRandomId(state);
      const firstQuestion = {
        ...getQuestion(state, randomId),
      };
      firstQuestion.isActive = true;
      updatedQuestions = [
        ...state.filter((q) => {
          if (q.id !== randomId) {
            q.isActive = false;
            return q;
          }
        }),
        firstQuestion,
      ];
      return updatedQuestions;
    } else if (type === "NEXT") {
      const prevQuestion = {
        ...getQuestion(state, userAnswer.questionId),
        userAnswerId: userAnswer.answerId,
        isActive: false
      };
      prevQuestion.isAnswerCorrect =
        prevQuestion.correctAnswerId === userAnswer.answerId;
      updatedQuestions = [
        ...state.filter((q) => q.id !== userAnswer.questionId),
        prevQuestion,
      ];
      const randomId = getRandomId(updatedQuestions);
      if (randomId !== undefined) {
        isDone.current = false;
        const nextQuestion = {
          ...getQuestion(updatedQuestions, randomId),
        };
        nextQuestion.isActive = true;
        updatedQuestions = [
          ...updatedQuestions.filter((q) => q.id !== randomId && q
          ),
          nextQuestion,
        ];
      } else
        isDone.current = true;
      return updatedQuestions;
    }
  }

  const [questionsReduce, dispatchQuestionsReduce] = useReducer(
    handleQuestionsReduce,
    questions
  );

  function getQuestion(questions, id) {
    return questions.find((q) => q.id === id);
  }
  useEffect(() => {
    dispatchQuestionsReduce({
      type: "START",
    });
  }, []);

  function handleOnNextQuestion(questionId, answerId) {
    dispatchQuestionsReduce({
      type: "NEXT",
      userAnswer: {
        questionId,
        answerId,
      },
    });
  }
  function handleDoneQuiz(questions) {
    return questions.find((q) => q.isAnswerCorrect === undefined);
  }
  const questionCtx = {
    questions: questionsReduce,
    handleOnNextQuestion: handleOnNextQuestion,
    isDone: isDone.current,
  };

  return <QuestionContext.Provider value={questionCtx}>
    {children}
  </QuestionContext.Provider>
}