import { useContext } from "react";
import ProgressBar from "./ProgressBar.jsx";
import Question from "./Question.jsx";
import { QuestionContext } from "../store/quiz-context.jsx";
import Score from "../components/Score.jsx";

export default function Quiz() {
const { isDone } = useContext(QuestionContext)
  return (
    <>
      <ProgressBar />
      <Question />
      {isDone && <Score />}
    </>
  );
}

