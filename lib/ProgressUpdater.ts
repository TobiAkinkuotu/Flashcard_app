// lib/ProgressUpdater.ts
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type Progress = {
  completed: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
  accuracy: number;
  streak: number;
  lastCompleted?: string;
};

// Get user progress (with safe defaults)
export const getUserProgress = async (userId: string): Promise<Progress> => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  const defaults: Progress = {
    completed: 0,
    totalCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
    accuracy: 0,
    streak: 0,
    lastCompleted: "",
  };

  if (!snap.exists()) return defaults;

  const data = snap.data() as any;

  return {
    completed: Number(data.completed) || 0,
    totalCorrectAnswers: Number(data.totalCorrectAnswers) || 0,
    totalQuestionsAnswered: Number(data.totalQuestionsAnswered) || 0,
    accuracy: Number(data.accuracy) || 0,
    streak: Number(data.streak) || 0,
    lastCompleted: data.lastCompleted || "",
  };
};

// Update progress with a new quiz session
export const updateUserProgress = async (
  userId: string,
  totalCorrectAnswers: number,
  totalQuestionsAnswered: number
) => {
  // 🔐 Make sure incoming values are valid numbers
  const deltaCorrect =
    Number.isFinite(Number(totalCorrectAnswers)) && Number(totalCorrectAnswers) >= 0
      ? Number(totalCorrectAnswers)
      : 0;

  const deltaAnswered =
    Number.isFinite(Number(totalQuestionsAnswered)) && Number(totalQuestionsAnswered) >= 0
      ? Number(totalQuestionsAnswered)
      : 0;

  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  let newData: Progress;

  if (!snap.exists()) {
    // First ever quiz
    const accuracy =
      deltaAnswered === 0 ? 0 : Math.round((deltaCorrect / deltaAnswered) * 100);

    newData = {
      completed: 1,
      totalCorrectAnswers: deltaCorrect,
      totalQuestionsAnswered: deltaAnswered,
      accuracy,
      streak: 1,
      lastCompleted: todayStr,
    };
  } else {
    const current = snap.data() as any;

    // Safely read previous values
    const currentCompleted = Number(current.completed) || 0;
    const currentCorrect = Number(current.totalCorrectAnswers) || 0;
    const currentAnswered = Number(current.totalQuestionsAnswered) || 0;
    const currentStreak = Number(current.streak) || 0;
    const lastCompleted = current.lastCompleted as string | undefined;

    // New totals
    const newTotalCorrect = currentCorrect + deltaCorrect;
    const newTotalAnswered = currentAnswered + deltaAnswered;

    const accuracy =
      newTotalAnswered === 0 ? 0 : Math.round((newTotalCorrect / newTotalAnswered) * 100);

    // 🔥 Streak logic
    let streak = 1;

    if (lastCompleted) {
      const last = new Date(lastCompleted);
      const diffDays =
        (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays < 1) {
        // Same day → keep streak as is
        streak = currentStreak;
      } else if (diffDays < 2) {
        // Next day → continue streak
        streak = currentStreak + 1;
      } else {
        // Gap ≥ 2 days → reset streak
        streak = 1;
      }
    }

    newData = {
      completed: currentCompleted + 1,
      totalCorrectAnswers: newTotalCorrect,
      totalQuestionsAnswered: newTotalAnswered,
      accuracy,
      streak,
      lastCompleted: todayStr,
    };
  }

  console.log("🔥 Saving user progress (cumulative)", userId, newData);
  await setDoc(userRef, newData);
  console.log("✅ Saved (cumulative)");

  return newData;
};
