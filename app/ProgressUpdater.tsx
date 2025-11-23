import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Progress type
export type Progress = {
  completed: number;             // total quizzes done
  totalCorrectAnswers: number;   // cumulative correct answers
  totalQuestionsAnswered: number; // cumulative questions answered
  accuracy: number;              // overall accuracy %
  streak: number;                // consecutive days
  lastCompleted?: string;        // last date completed
};

// Get user progress
export const getUserProgress = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (snap.exists()) return snap.data() as Progress;

  // first-time user
  return {
    completed: 0,
    totalCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
    accuracy: 0,
    streak: 0,
  };
};

// Update user progress
export const updateUserProgress = async (
  userId: string,
  correctAnswers: number,
  totalQuestions: number
) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  let completed = 1;
  let totalCorrectAnswers = correctAnswers;
  let totalQuestionsAnswered = totalQuestions;
  let accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  let streak = 1;

  if (snap.exists()) {
    const current = snap.data() as Progress;

    // Update completed
    completed = current.completed + 1;

    // Update cumulative correct answers & total questions
    totalCorrectAnswers += current.totalCorrectAnswers;
    totalQuestionsAnswered += current.totalQuestionsAnswered;

    // Calculate overall accuracy
    accuracy = Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100);

    // Update streak
    if (current.lastCompleted) {
      const lastDate = new Date(current.lastCompleted);
      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) streak = current.streak;         // already did today
      else if (diffDays === 1) streak = current.streak + 1; // consecutive day
      else streak = 1;                                     // missed day
    }
  }

  const progressToSave = {
    completed,
    totalCorrectAnswers,
    totalQuestionsAnswered,
    accuracy,
    streak,
    lastCompleted: todayStr,
  };

  await setDoc(userRef, progressToSave);
  return progressToSave;
};
