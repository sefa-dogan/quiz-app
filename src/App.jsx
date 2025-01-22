import { QuestionContext } from "./store/quiz-context.jsx";
import { useReducer, useEffect } from "react";
import { questions } from "./store/questions.js";

import Header from "./components/Header.jsx";
import Quiz from "./components/Quiz.jsx"

var _questions = questions;


function App() {

  function getRandomId(state) {
    let randomId = Math.floor(Math.random() * 10)
    if (state[randomId].isAnswerCorrect === undefined)
      return randomId
    else getRandomId(state);

  }
  function handleDispatchQuestionsReduce(state, action) {
    let updatedQuestions;
    const randomId = getRandomId(state);
    if (action.type === "START") {
      const currentQuestion = { ...state[randomId] };
      currentQuestion.isActive = true;
      updatedQuestions = [
        ...state.filter((q) => {
          if (q.id !== randomId) {
            q.isActive = false;
            return q;
          }
        }),
        currentQuestion,
      ];
      return [
        ...updatedQuestions,
      ];
    } else if (action.type === "NEXT") {
      if (state[randomId].isAnswerCorrect !== undefined) {
        const currentQuestion = { ...state[randomId] };
        currentQuestion.isActive = true;
        updatedQuestions = [
          ...state.filter((q) => {
            if (q.id !== randomId) {
              q.isActive = false;
              return q;
            }
          }),
          currentQuestion,
        ];
        return [
          ...updatedQuestions,
        ];
      } else {
        return state;
      }
    }
  }

  const [questionsReduce, dispatchQuestionsReduce] = useReducer(
    handleDispatchQuestionsReduce,
    questions
  );

  useEffect(() => {
    dispatchQuestionsReduce({
      type: "START"
    })
  }, [])

  function handleOnNextQuestion() {
    dispatchQuestionsReduce({
      type: "NEXT"
    })
  }
  function handleIsAnswerCorrectOrNot(questionId, answerId) {

  }
  const questionCtx = {
    questions: questionsReduce,
    handleOnNextQuestion: handleOnNextQuestion
  };
  return (
    <QuestionContext.Provider value={questionCtx}>
      <Header />
      <Quiz />
    </QuestionContext.Provider>
  );
}

export default App;
