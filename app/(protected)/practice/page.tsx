
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Trophy,
  XCircle,
  Target,
  Play,
} from "lucide-react";

type Question = {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    id: 1,
    subject: "Physics",
    question: "What is Newton's second law of motion?",
    options: [
      "Force equals mass × acceleration",
      "Energy equals mass × speed",
      "Force equals mass ÷ acceleration",
      "Mass equals force × acceleration",
    ],
    correctAnswer: 0,
    explanation:
      "Newton's second law states that the net force acting on an object is equal to its mass multiplied by its acceleration (F = ma).",
  },
  {
    id: 2,
    subject: "Mathematics",
    question: "What is the value of x in 2x + 6 = 14?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
    explanation:
      "Subtract 6 from both sides: 2x = 8. Divide by 2 to get x = 4.",
  },
  {
    id: 3,
    subject: "Chemistry",
    question: "What is the chemical symbol for oxygen?",
    options: ["Ox", "O", "Og", "Oy"],
    correctAnswer: 1,
    explanation:
      "O is the chemical symbol for oxygen. Oxygen has atomic number 8.",
  },
  {
    id: 4,
    subject: "Biology",
    question: "Where does photosynthesis mainly occur in plant cells?",
    options: [
      "Mitochondria",
      "Nucleus",
      "Chloroplasts",
      "Ribosomes",
    ],
    correctAnswer: 2,
    explanation:
      "Photosynthesis mainly occurs in chloroplasts, which contain chlorophyll to absorb light energy.",
  },
  {
    id: 5,
    subject: "Mathematics",
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "14"],
    correctAnswer: 2,
    explanation: "12 × 12 = 144, so the square root of 144 is 12.",
  },
  {
    id: 6,
    subject: "Physics",
    question: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Pascal", "Newton"],
    correctAnswer: 3,
    explanation:
      "The SI unit of force is the Newton (N), named after physicist Isaac Newton.",
  },
  {
    id: 7,
    subject: "Chemistry",
    question: "What is the pH of a neutral solution at 25°C?",
    options: ["0", "5", "7", "14"],
    correctAnswer: 2,
    explanation:
      "A neutral aqueous solution has a pH of 7 at 25°C.",
  },
  {
    id: 8,
    subject: "English",
    question: "Which word is a noun?",
    options: ["Quickly", "Beautiful", "Happiness", "Run"],
    correctAnswer: 2,
    explanation:
      "Happiness is a noun because it names a state or quality.",
  },
  {
    id: 9,
    subject: "Mathematics",
    question: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 2,
    explanation:
      "15% of 200 = (15 ÷ 100) × 200 = 30.",
  },
  {
    id: 10,
    subject: "Physics",
    question: "What type of energy does a moving object possess?",
    options: [
      "Potential energy",
      "Kinetic energy",
      "Chemical energy",
      "Nuclear energy",
    ],
    correctAnswer: 1,
    explanation:
      "A moving object possesses kinetic energy, which depends on its mass and velocity.",
  },
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
];

const QUIZ_DURATION = 15 * 60;

export default function PracticePage() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [quizNumber, setQuizNumber] = useState(1);

  const filteredQuestions = useMemo(() => {
    if (selectedSubject === "All Subjects") return questions;
    return questions.filter((q) => q.subject === selectedSubject);
  }, [selectedSubject]);

  const question = filteredQuestions[currentQuestion];

  const score = filteredQuestions.reduce((total, q, index) => {
    return total + (answers[index] === q.correctAnswer ? 1 : 0);
  }, 0);

  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    if (timeLeft <= 0) {
      setQuizSubmitted(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [quizStarted, quizSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const startQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(QUIZ_DURATION);
    setQuizSubmitted(false);
    setQuizStarted(true);
  };

  const selectAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex,
    }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) =>
      Math.min(prev + 1, filteredQuestions.length - 1)
    );
  };

  const previousQuestion = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizSubmitted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(QUIZ_DURATION);
    setQuizNumber((prev) => prev + 1);
  };

  const percentage = Math.round(
    (score / filteredQuestions.length) * 100
  );

  const isPassing = percentage >= 50;

  // Quiz landing page
  if (!quizStarted) {
    return (
      <div className="space-y-7 pb-10">
        <section>
          <p className="mb-2 text-sm font-medium text-[#76a92e]">
            Practice makes progress 🌱
          </p>
          <h1 className="text-2xl font-bold text-[#214d32] sm:text-3xl">
            Weekly Practice
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Test your knowledge and improve your academic performance.
          </p>
        </section>

        {/* Overview */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e7eddc] bg-white p-5">
            <Target className="text-[#4f862d]" size={22} />
            <p className="mt-3 text-2xl font-bold text-[#214d32]">10</p>
            <p className="text-sm text-gray-500">Practice questions</p>
          </div>
          <div className="rounded-2xl border border-[#e7eddc] bg-white p-5">
            <Clock3 className="text-[#4f862d]" size={22} />
            <p className="mt-3 text-2xl font-bold text-[#214d32]">15 min</p>
            <p className="text-sm text-gray-500">Time limit</p>
          </div>
          <div className="rounded-2xl border border-[#e7eddc] bg-white p-5">
            <Award className="text-[#4f862d]" size={22} />
            <p className="mt-3 text-2xl font-bold text-[#214d32]">50%</p>
            <p className="text-sm text-gray-500">Passing score</p>
          </div>
        </section>

        {/* Quiz card */}
        <section className="overflow-hidden rounded-3xl bg-[#214d32] p-6 text-white sm:p-8">
          <div className="flex items-center gap-2 text-sm text-green-200">
            <Trophy size={19} />
            Weekly challenge
          </div>

          <h2 className="mt-4 text-2xl font-bold">
            Are you ready to test yourself?
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-green-100">
            Answer questions from your subjects, check your results,
            and learn from explanations after completing the quiz.
          </p>

          <div className="mt-6 max-w-sm">
            <label className="mb-2 block text-sm font-semibold text-green-100">
              Choose a subject
            </label>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-[#214d32] outline-none focus:ring-2 focus:ring-[#d9ed9b]"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-green-200">
              {filteredQuestions.length} questions available for this selection.
            </p>
          </div>

          <button
            onClick={startQuiz}
            disabled={filteredQuestions.length === 0}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d9ed9b] px-6 py-3 font-bold text-[#214d32] transition hover:bg-[#c9e47d] disabled:opacity-50"
          >
            <Play size={18} />
            Start practice
          </button>
        </section>

        {/* Instructions */}
        <section className="rounded-2xl border border-[#e7eddc] bg-white p-5">
          <h3 className="font-bold text-[#214d32]">
            Before you begin
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="text-[#76a92e]" size={17} />
              Select one answer for each question.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="text-[#76a92e]" size={17} />
              You can move between questions before submitting.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="text-[#76a92e]" size={17} />
              Unanswered questions count as incorrect.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="text-[#76a92e]" size={17} />
              Your answers are scored automatically.
            </p>
          </div>
        </section>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f862d] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </div>
    );
  }

  // Results page
  if (quizSubmitted) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-10">
        <div className="rounded-3xl border border-[#e7eddc] bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf5e2] text-[#4f862d]">
            {isPassing ? <Trophy size={38} /> : <Target size={38} />}
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#214d32]">
            {isPassing ? "Excellent work! 🎉" : "Keep practicing! 🌱"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You've completed Weekly Practice #{quizNumber}.
          </p>

          <div className="mx-auto mt-7 flex h-36 w-36 flex-col items-center justify-center rounded-full border-[10px] border-[#dceacb]">
            <span className="text-4xl font-bold text-[#214d32]">
              {percentage}%
            </span>
            <span className="text-xs text-gray-400">Your score</span>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#f5f8f0] p-3">
              <p className="text-2xl font-bold text-[#214d32]">
                {score}
              </p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="rounded-xl bg-[#f5f8f0] p-3">
              <p className="text-2xl font-bold text-[#214d32]">
                {filteredQuestions.length - score}
              </p>
              <p className="text-xs text-gray-500">Incorrect</p>
            </div>
            <div className="rounded-xl bg-[#f5f8f0] p-3">
              <p className="text-2xl font-bold text-[#214d32]">
                {answeredCount}
              </p>
              <p className="text-xs text-gray-500">Answered</p>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-600">
            {isPassing
              ? "You passed this practice quiz. Keep up the good work!"
              : "Review the explanations below and try again. Every attempt helps you improve."}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#214d32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#315f3e]"
            >
              <RotateCcw size={16} />
              Try again
            </button>

            <Link
              href="/dashboard"
              className="rounded-xl border border-[#dce8ce] px-5 py-3 text-sm font-semibold text-[#4f862d] hover:bg-[#f5f8f0]"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        {/* Answer review */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#214d32]">
            Review your answers
          </h2>

          {filteredQuestions.map((q, index) => {
            const selected = answers[index];
            const correct = selected === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-[#e7eddc] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#76a92e]">
                      Question {index + 1} · {q.subject}
                    </p>
                    <h3 className="mt-2 font-bold text-[#214d32]">
                      {q.question}
                    </h3>
                  </div>

                  {correct ? (
                    <CheckCircle2 className="shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="shrink-0 text-red-500" />
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Your answer:{" "}
                  <span className="font-semibold text-gray-700">
                    {selected === undefined
                      ? "Not answered"
                      : q.options[selected]}
                  </span>
                </p>

                <p className="mt-2 text-sm text-green-700">
                  Correct answer: {q.options[q.correctAnswer]}
                </p>

                <div className="mt-4 rounded-xl bg-[#f5f8f0] p-4">
                  <p className="text-xs font-bold text-[#4f862d]">
                    Explanation
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    );
  }

  // Active quiz
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#76a92e]">
            WEEKLY PRACTICE
          </p>
          <h1 className="mt-1 text-xl font-bold text-[#214d32]">
            {selectedSubject}
          </h1>
        </div>

        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 font-bold ${
            timeLeft < 60
              ? "bg-red-50 text-red-600"
              : "bg-[#edf5e2] text-[#4f862d]"
          }`}
        >
          <Clock3 size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-[#e7eddc] bg-white p-5">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-[#214d32]">
            Question {currentQuestion + 1} of {filteredQuestions.length}
          </span>
          <span className="text-gray-500">
            {Math.round(
              ((currentQuestion + 1) / filteredQuestions.length) * 100
            )}%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf2e7]">
          <div
            className="h-full rounded-full bg-[#76a92e] transition-all"
            style={{
              width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filteredQuestions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              aria-label={`Go to question ${index + 1}`}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                index === currentQuestion
                  ? "bg-[#214d32] text-white"
                  : answers[index] !== undefined
                  ? "bg-[#dceacb] text-[#315f3e]"
                  : "bg-[#f2f5ee] text-gray-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <section className="rounded-2xl border border-[#e7eddc] bg-white p-5 sm:p-8">
        <span className="inline-block rounded-full bg-[#edf5e2] px-3 py-1 text-xs font-semibold text-[#4f862d]">
          {question.subject}
        </span>

        <h2 className="mt-5 text-lg font-bold leading-7 text-[#214d32] sm:text-xl">
          {question.question}
        </h2>

        <p className="mt-2 text-xs text-gray-400">
          Choose one correct answer.
        </p>

        <div className="mt-6 space-y-3">
          {question.options.map((option, index) => {
            const selected = answers[currentQuestion] === index;

            return (
              <button
                key={option}
                onClick={() => selectAnswer(index)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-[#76a92e] bg-[#edf5e2] text-[#214d32]"
                    : "border-[#e7eddc] bg-white text-gray-600 hover:bg-[#f7faef]"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    selected
                      ? "bg-[#4f862d] text-white"
                      : "bg-[#f0f3eb] text-gray-500"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="text-sm font-medium">{option}</span>

                {selected && (
                  <CheckCircle2
                    className="ml-auto shrink-0 text-[#4f862d]"
                    size={19}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-[#dce8ce] px-5 py-3 text-sm font-semibold text-[#4f862d] hover:bg-[#f5f8f0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {currentQuestion < filteredQuestions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="inline-flex items-center gap-2 rounded-xl bg-[#214d32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#315f3e]"
          >
            Next question
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={submitQuiz}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4f862d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3e7022]"
          >
            Submit quiz
            <CheckCircle2 size={17} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{answeredCount} of {filteredQuestions.length} answered</span>
        <button
          onClick={submitQuiz}
          className="font-semibold text-red-500 hover:underline"
        >
          Finish quiz now
        </button>
      </div>
    </div>
  );
}
