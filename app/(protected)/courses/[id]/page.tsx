
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CirclePlay,
  Clock3,
  Sparkles,
} from "lucide-react";

const courseData: Record<
  string,
  {
    name: string;
    description: string;
    chapters: string[];
  }
> = {
  "1": {
    name: "Mathematics",
    description: "Build your mathematical thinking and problem-solving skills.",
    chapters: [
      "Introduction to Mathematics",
      "Number Systems",
      "Functions",
      "Algebra and Equations",
      "Trigonometry",
      "Geometry",
      "Statistics",
      "Probability",
    ],
  },
  "2": {
    name: "Physics",
    description: "Understand the laws and principles of the physical world.",
    chapters: [
      "Introduction to Physics",
      "Motion",
      "Force and Newton's Laws",
      "Work and Energy",
      "Momentum",
      "Waves",
    ],
  },
  "3": {
    name: "Chemistry",
    description: "Explore matter, reactions, and chemical structures.",
    chapters: [
      "Introduction to Chemistry",
      "Atomic Structure",
      "Periodic Table",
      "Chemical Bonding",
      "Chemical Reactions",
      "Acids and Bases",
    ],
  },
  "4": {
    name: "English",
    description: "Improve your grammar, vocabulary, and communication.",
    chapters: [
      "Parts of Speech",
      "Sentence Structure",
      "Tenses",
      "Vocabulary Development",
      "Reading Comprehension",
      "Writing Skills",
    ],
  },
};

export default function CourseDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const course = courseData[id];

  if (!course) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center">
        <h1 className="text-xl font-bold text-[#214d32]">
          Course not found
        </h1>
        <Link
          href="/courses"
          className="mt-4 inline-block text-sm font-semibold text-[#4f862d]"
        >
          Return to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f862d] hover:underline"
      >
        <ArrowLeft size={17} />
        Back to courses
      </Link>

      <section className="rounded-3xl bg-[#214d32] p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-sm text-green-200">
          <BookOpen size={17} />
          My Courses
        </div>

        <h1 className="mt-4 text-3xl font-bold">{course.name}</h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-green-100">
          {course.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/questions?course=${id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d9ed9b] px-4 py-3 text-sm font-bold text-[#214d32] hover:bg-[#c9e47d]"
          >
            <Sparkles size={17} />
            Ask Maya AI
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#214d32]">
            Course chapters
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a chapter to begin learning.
          </p>
        </div>

        <div className="space-y-3">
          {course.chapters.map((chapter, index) => {
            const completed = index < 2;

            return (
              <div
                key={chapter}
                className="flex items-center gap-4 rounded-2xl border border-[#e7eddc] bg-white p-4 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5e2] font-bold text-[#4f862d]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[#214d32]">
                    {chapter}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <Clock3 size={13} />
                    Approx. 30 minutes
                  </p>
                </div>

                {completed ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
                    <CheckCircle2 size={17} />
                    <span className="hidden sm:inline">Completed</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#4f862d]">
                    <CirclePlay size={18} />
                    <span className="hidden sm:inline">Start</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
