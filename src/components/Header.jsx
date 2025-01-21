import logoImg from "../assets/quiz-logo.png"

export default function Header() {
    return <header>
        <img src={logoImg} alt="Quiz app image" />
        <h1>Quiz</h1>
    </header>
}