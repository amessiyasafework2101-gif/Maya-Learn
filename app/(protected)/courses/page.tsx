
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Atom,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FlaskConical,
  Languages,
  Search,
  Sparkles,
  BookMarked,
} from "lucide-react";

type Course = {
  id: number;
  name: string;
  description: string;
  chapters: number;
  completedChapters: number;
  progress: number;
  category: string;
  color: string;
  iconColor: string;
  icon: typeof Calculator;
};

const courses: Course[] = [
  {
    id: 1,
    name: "Mathematics",
    description: "Build your problem-solving and mathematical skills.",
    chapters: 12,
    completedChapters: 8,
    progress: 65,
    category: "In Progress",
    color: "bg-lime-100",
    iconColor: "text-lime-700",
    icon: Calculator,
  },
  {
    id: 2,
    name: "Physics",
    description: "Understand the laws and principles of the physical world.",
    chapters: 10,
    completedChapters: 4,
    progress: 42,
    category: "In Progress",
    color: "bg-blue-100",
    iconColor: "text-blue-700",
    icon: Atom,
  },
  {
    id: 3,
    name: "Chemistry",
    description: "Explore matter, reactions, and chemical structures.",
    chapters: 11,
    completedChapters: 11,
    progress: 100,
    category: "Completed",
    color: "bg-purple-100",
    iconColor: "text-purple-700",
    icon: FlaskConical,
  },
  {
    id: 4,
    name: "English",
    description: "Improve your grammar, vocabulary, and communication.",
    chapters: 8,
    completedChapters: 2,
    progress: 30,
    category: "In Progress",
    color: "bg-orange-100",
    iconColor: "text-orange-700",
    icon: Languages,
  },
];

const filters = ["All Courses", "In Progress", "Completed"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Courses");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All Courses" ||
        course.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const completedCount = courses.filter(
    (course) => course.progress === 100
  ).length;

  const inProgressCount = courses.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;

  return (
    <div className="space-y-7 pb-10">
      {/* Page heading */}
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-[#76a92e]">
              Your learning space 🌱
            </p>
            <h1 className="text-2xl font-bold text-[#214d32] sm:text-3xl">
              My Courses
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your subjects and continue your learning journey.
            </p>
          </div>

          <Link
            href="/questions"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#214d32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315f3e]"
          >
            <Sparkles size={17} />
            Ask Maya AI
          </Link>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total courses"
          value={courses.length}
          icon={BookOpen}
        />
        <SummaryCard
          label="In progress"
          value={inProgressCount}
          icon={Clock3}
        />
        <SummaryCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle2}
        />
      </section>

      {/* Search and filters */}
      <section className="space-y-4">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your courses..."
            className="w-full rounded-xl border border-[#e7eddc] bg-white py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#76a92e] focus:ring-2 focus:ring-[#76a92e]/10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeFilter === filter
                  ? "bg-[#214d32] text-white"
                  : "border border-[#e7eddc] bg-white text-gray-600 hover:bg-[#f4f8ed]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Course list */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-[#214d32]">
            {activeFilter}
          </h2>
          <span className="text-xs text-gray-400">
            {filteredCourses.length} courses found
          </span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dce8ce] bg-white py-16 text-center">
            <BookOpen className="mx-auto text-[#76a92e]" size={35} />
            <h3 className="mt-4 font-bold text-[#214d32]">
              No courses found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another search or select a different filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveFilter("All Courses");
              }}
              className="mt-4 text-sm font-semibold text-[#4f862d] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredCourses.map((course) => {
              const Icon = course.icon;

              return (
                <article
                  key={course.id}
                  className="group rounded-2xl border border-[#e7eddc] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-2xl p-3 ${course.color} ${course.iconColor}`}>
                      <Icon size={27} />
                    </div>

                    {course.progress === 100 ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Completed
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#edf5e2] px-3 py-1 text-xs font-semibold text-[#4f862d]">
                        In Progress
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#214d32]">
                    {course.name}
                  </h3>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">
                    {course.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookMarked size={14} />
                      {course.chapters} chapters
                    </span>
                    <span>
                      {course.completedChapters}/{course.chapters} completed
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf2e7]">
                    <div
                      className="h-full rounded-full bg-[#76a92e] transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="mt-2 text-right text-xs font-bold text-[#4f862d]">
                    {course.progress}% complete
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center justify-center gap-1 rounded-xl bg-[#214d32] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#315f3e]"
                    >
                      Open course
                      <ChevronRight size={15} />
                    </Link>

                    <Link
                      href={`/questions?course=${course.id}`}
                      className="flex items-center justify-center gap-1 rounded-xl border border-[#dce8ce] px-3 py-3 text-xs font-semibold text-[#4f862d] transition hover:bg-[#f4f8ed]"
                    >
                      <Sparkles size={14} />
                      Ask AI
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof BookOpen;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e7eddc] bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-[#edf5e2] p-3 text-[#4f862d]">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#214d32]">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
