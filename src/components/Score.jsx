import { useContext } from "react"
import { QuestionContext } from "../store/quiz-context.jsx"

export default function Score() {

  const { questions } = useContext(QuestionContext)
  return (
    <ul>
      {questions.map((q) => {
        return <>
          <span className={q.isAnswerCorrect ? "trueAnswer" : "wrongAnswer"} key={q.id}>{q.options[q.userAnswerId].option}</span>
          <br />
        </>
      })}
    </ul>
  );
}
