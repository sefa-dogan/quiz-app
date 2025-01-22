import { QuestionContext } from "./store/quiz-context.jsx";
import { useContext, useReducer,useEffect } from "react";
import { questions } from "./store/questions.js";

import Header from "./components/Header.jsx";

var _questions = questions;


function App() {
  
  function produceRandomId() {
    let randomId =Math.floor(Math.random() * 10 + 1) 
    if(_questions[randomId].isAnswerCorrect === undefined)
      return randomId
    else produceRandomId();
        
  }
  function handleDispatchQuestionsReduce(state, action) {
        
    const randomId = produceRandomId();
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
      return {
        ...updatedQuestions,
      };
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
        return {
          ...updatedQuestions,
        };
      }else
    }
  }

  const [questionsReduce, dispatchQuestionsReduce] = useReducer(
    handleDispatchQuestionsReduce,
    questions
  );
  
  useEffect(()=>{
    dispatchQuestionsReduce({
      type:"START"
    })
  },[])

  function handleOnNextQuestion() {
    dispatchQuestionsReduce({
      type:"NEXT"
    })
  }

  const questionCtx = {
    question: questionReduce,
  };
  return (
    <QuestionContext.Provider value={questionCtx}>
      <Header />
    </QuestionContext.Provider>
  );
}

export default App;
