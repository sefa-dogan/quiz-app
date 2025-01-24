import { QuestionContext } from "./store/quiz-context.jsx";
import { useReducer, useEffect, useRef } from "react";
import { questions } from "./store/questions.js";

import Header from "./components/Header.jsx";
import Quiz from "./components/Quiz.jsx";
import Score from "./components/Score.jsx";

var _questions = questions;

function App() {
  const isDone = useRef(false);
  function getRandomId(state) {
    if (handleDoneQuiz(state)) {
      let randomId = Math.floor(Math.random() * 10);
      let question = getQuestion(state, randomId);
      if (question.isAnswerCorrect === undefined) {
        return randomId;
      } else return getRandomId(state);
    }
  }

  function handleDispatchQuestionsReduce(state, action) {
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
      };
      prevQuestion.isAnswerCorrect =
        prevQuestion.correctAnswerId === userAnswer.answerId;
      updatedQuestions = [
        ...state.filter((q) => q.id !== userAnswer.questionId),
        prevQuestion,
      ];
      const randomId = getRandomId(updatedQuestions);
      if (randomId) {
        isDone.current = false;
        console.log(randomId);
        const nextQuestion = {
          ...getQuestion(updatedQuestions, randomId),
        };
        nextQuestion.isActive = true;
        updatedQuestions = [
          ...updatedQuestions.filter((q) => {
            if (q.id !== randomId) {
              q.isActive = false;
              return q;
            }
          }),
          nextQuestion,
        ];
      } else isDone.current = true;

      return updatedQuestions;
    }
  }

  const [questionsReduce, dispatchQuestionsReduce] = useReducer(
    handleDispatchQuestionsReduce,
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
  return (
    <QuestionContext.Provider value={questionCtx}>
      <Header />
      {!questionCtx.isDone ? <Quiz /> : <Score />}
    </QuestionContext.Provider>
  );
}

export default App;
