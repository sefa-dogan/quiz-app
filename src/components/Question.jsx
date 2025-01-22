import { QuestionContext } from "../store/quiz-context.jsx"
import { useContext } from "react"


export default function Question() {
    const { questions, handleOnNextQuestion } = useContext(QuestionContext)

    return <>

        {
            questions && questions.map(({ id, isActive, options, question }) => {
                return isActive && <div key={id}>
                    <p>{question}</p>
                    {options.map((option) => <button key={option.id} onClick={() => handleOnNextQuestion(id, option.id)}>{option.option}</button>)}
                </div>
            })
        }
    </>
}