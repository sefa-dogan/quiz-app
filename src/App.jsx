import { QuestionContext } from "./store/quiz-context.jsx";
import { useReducer, useEffect } from "react";
import { questions } from "./store/questions.js";

import Header from "./components/Header.jsx";
import Quiz from "./components/Quiz.jsx";

var _questions = questions;

function App() {
  function getRandomId(state) {
    let randomId = Math.floor(Math.random() * 10);
    let question = getQuestion(state, randomId);
    console.log(question);
    if (question.isAnswerCorrect === undefined) {
      console.log(randomId);
      return randomId;
    } else return getRandomId(state);
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
        // ...state.find((q) => q.id === userAnswer.questionId),
        ...getQuestion(state, userAnswer.questionId),
      };
      prevQuestion.isAnswerCorrect =
        prevQuestion.correctAnswerId === userAnswer.answerId;
      updatedQuestions = [
        ...state.filter((q) => q.id !== userAnswer.questionId),
        prevQuestion,
      ];
      const randomId = getRandomId(updatedQuestions);
      console.log("gelen random id", randomId);
      // if (state[randomId].isAnswerCorrect !== undefined) {
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
      return updatedQuestions;
      // } else {
      //   return state;
      // }
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
  const questionCtx = {
    questions: questionsReduce,
    handleOnNextQuestion: handleOnNextQuestion,
  };
  return (
    <QuestionContext.Provider value={questionCtx}>
      <Header />
      <Quiz />
    </QuestionContext.Provider>
  );
}

export default App;
