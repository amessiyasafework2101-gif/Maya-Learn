
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";

// Temporary sample data — replace with Firestore data later.
const stats = [
  {
    title: "Enrolled Courses",
    value: "04",
    description: "Keep learning",
    icon: BookOpen,
  },
  {
    title: "Study Streak",
    value: "07 days",
    description: "You're on fire!",
    icon: Flame,
  },
  {
    title: "Completed Lessons",
    value: "28",
    description: "Great progress",
    icon: CheckCircle2,
  },
  {
    title: "Average Score",
    value: "86%",
    description: "Keep improving",
    icon: Trophy,
  },
];

const courses = [
  {
    id: 1,
    name: "Mathematics",
    chapter: "Chapter 3: Functions",
    progress: 65,
    color: "bg-lime-100 text-lime-700",
    icon: Calculator,
  },
  {
    id: 2,
    name: "Physics",
    chapter: "Chapter 2: Motion",
    progress: 42,
    color: "bg-blue-100 text-blue-700",
    icon: GraduationCap,
  },
  {
    id: 3,
    name: "Chemistry",
    chapter: "Chapter 4: Chemical Bonding",
    progress: 80,
    color: "bg-purple-100 text-purple-700",
    icon: Sparkles,
  },
];

const activities = [
  {
    title: "Completed Mathematics lesson",
    time: "Today · 9:30 AM",
    icon: CheckCircle2,
  },
  {
    title: "Practiced Physics questions",
    time: "Yesterday · 4:15 PM",
    icon: Target,
  },
  {
    title: "Reached a 7-day study streak",
    time: "Yesterday · 8:00 AM",
    icon: Flame,
  },
];

const upcomingTasks = [
  {
    title: "Mathematics Weekly Quiz",
    date: "Tomorrow",
    duration: "30 minutes",
  },
  {
    title: "Physics Practice Test",
    date: "Friday",
    duration: "45 minutes",
  },
];

export default function DashboardPage() {
  const weeklyProgress = 65;

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#214d32] p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-green-200">
            Your learning journey continues 🌱
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome back, Student!
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-green-100">
            Every lesson brings you one step closer to your goals.
            Let's make today a productive study day.
          </p>

          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d9ed9b] px-5 py-3 text-sm font-semibold text-[#214d32] transition hover:bg-[#c9e47d]"
          >
            Continue learning
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[#76a92e]/20 blur-2xl" />
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#214d32]">
            Your overview
          </h2>
          <p className="text-sm text-gray-500">
            A quick look at your learning progress.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#e7eddc] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-[#edf5e2] p-3 text-[#4f862d]">
                    <Icon size={21} />
                  </div>
                  <TrendingUp size={18} className="text-[#76a92e]" />
                </div>

                <p className="mt-4 text-2xl font-bold text-[#214d32]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {stat.title}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Courses */}
        <section className="space-y-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#214d32]">
                Continue learning
              </h2>
              <p className="text-sm text-gray-500">
                Pick up where you left off.
              </p>
            </div>

            <Link
              href="/courses"
              className="flex items-center gap-1 text-sm font-semibold text-[#4f862d] hover:underline"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="space-y-3">
            {courses.map((course) => {
              const Icon = course.icon;

              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-[#e7eddc] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-xl p-3 ${course.color}`}>
                      <Icon size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#214d32]">
                        {course.name}
                      </h3>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {course.chapter}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-[#4f862d]">
                      {course.progress}%
                    </span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf2e7]">
                    <div
                      className="h-full rounded-full bg-[#76a92e]"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-gray-400">
                    <span>Course progress</span>
                    <Link
                      href="/courses"
                      className="font-semibold text-[#4f862d] hover:underline"
                    >
                      Continue <ArrowRight className="ml-1 inline" size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Weekly goal */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#214d32]">
              Weekly goal
            </h2>
            <p className="text-sm text-gray-500">
              Stay consistent with your studies.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7eddc] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#76a92e ${weeklyProgress * 3.6}deg, #edf2e7 0deg)`,
                }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-3xl font-bold text-[#214d32]">
                    {weeklyProgress}%
                  </span>
                  <span className="text-xs text-gray-400">Completed</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="font-bold text-[#214d32]">
                6.5 / 10 hours
              </p>
              <p className="mt-1 text-xs text-gray-500">
                You've completed 6.5 study hours this week.
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-[#f4f8ed] p-3 text-center">
              <p className="text-sm font-semibold text-[#4f862d]">
                You're doing great! 🌟
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Just 3.5 hours left to reach your goal.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Quick access */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#214d32]">
            Quick access
          </h2>
          <p className="text-sm text-gray-500">
            Your study tools are just one click away.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/questions"
            className="group flex items-center gap-4 rounded-2xl border border-[#e7eddc] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="rounded-xl bg-[#edf5e2] p-4 text-[#4f862d]">
              <MessageCircle size={26} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#214d32]">
                Ask Maya AI
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Ask questions and get study assistance.
              </p>
            </div>
            <ArrowRight className="text-[#76a92e] transition group-hover:translate-x-1" />
          </Link>

          <Link
            href="/practice"
            className="group flex items-center gap-4 rounded-2xl border border-[#e7eddc] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="rounded-xl bg-[#edf5e2] p-4 text-[#4f862d]">
              <Target size={26} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#214d32]">
                Weekly practice
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Practice questions and test your knowledge.
              </p>
            </div>
            <ArrowRight className="text-[#76a92e] transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Activity and upcoming tasks */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#e7eddc] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Clock3 className="text-[#4f862d]" size={20} />
            <h2 className="font-bold text-[#214d32]">
              Recent activity
            </h2>
          </div>

          <div className="space-y-5">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div key={activity.title} className="flex gap-3">
                  <div className="rounded-full bg-[#edf5e2] p-2 text-[#4f862d]">
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e7eddc] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <CalendarDays className="text-[#4f862d]" size={20} />
            <h2 className="font-bold text-[#214d32]">
              Upcoming practice
            </h2>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.title}
                className="rounded-xl bg-[#f7faef] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#214d32]">
                      {task.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <Clock3 size={13} />
                      {task.duration}
                    </p>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-[#e6efd9] px-3 py-1 text-xs font-semibold text-[#4f862d]">
                    {task.date}
                  </span>
                </div>
              </div>
            ))}

            <Link
              href="/practice"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#dce8ce] py-3 text-sm font-semibold text-[#4f862d] transition hover:bg-[#f7faef]"
            >
              View practice schedule
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
