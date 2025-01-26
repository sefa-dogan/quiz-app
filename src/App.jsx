
import QuestionContextProvider from "./store/quiz-context.jsx";


import Header from "./components/Header.jsx";
import Quiz from "./components/Quiz.jsx";


function App() {
  

  return (
    <QuestionContextProvider>
      <Header />
      <Quiz /> 
    </QuestionContextProvider>
  );
}

export default App;
