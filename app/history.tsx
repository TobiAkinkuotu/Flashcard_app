// app/history.tsx
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateUserProgress } from "../lib/ProgressUpdater";


const historyQuiz = [
  { question: "In which year did World War II begin?", answer: "1939" },
  { question: "Which country was invaded by Germany to start the war?", answer: "Poland" },
  { question: "Who was the British Prime Minister during most of WWII?", answer: "Winston Churchill" },
  { question: "What was the name of the German air force?", answer: "Luftwaffe" },
  { question: "Which two cities were atomic bombs dropped on in 1945?", answer: "Hiroshima and Nagasaki" },
  { question: "Which country switched sides from Axis to Allies in 1943?", answer: "Italy" },
];

export default function HistoryQuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const userId = "user876";
  const card = historyQuiz[currentIndex];

  const checkAnswer = () => {
    if (checked) return;
    Keyboard.dismiss();
    setChecked(true);

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = card.answer.trim().toLowerCase();

    setAnsweredCount(prev => prev + 1);
    if (normalizedUser === normalizedCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const nextCard = async () => {
    Keyboard.dismiss();

    const isLast = currentIndex === historyQuiz.length - 1;

    if (isLast) {
      try {
        console.log("📊 Finishing quiz with:", { correctCount, answeredCount });
await updateUserProgress(userId, correctCount, answeredCount);

        await updateUserProgress(userId, correctCount, answeredCount);
        Alert.alert(
          "Quiz Completed!",
          `You got ${correctCount} out of ${answeredCount} correct.`,
          [{ text: "OK", onPress: restartQuiz }]
        );
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Could not save progress.");
      }
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setUserAnswer("");
    setChecked(false);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setChecked(false);
    setCorrectCount(0);
    setAnsweredCount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History Quiz: World War II</Text>

      <View style={styles.card}>
        <Text style={styles.question}>{card.question}</Text>

        <TextInput
          style={styles.input}
          placeholder="Type your answer..."
          value={userAnswer}
          onChangeText={setUserAnswer}
          editable={!checked}
        />

        {!checked ? (
          <TouchableOpacity style={styles.button} onPress={checkAnswer}>
            <Text style={styles.buttonText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.correctLabel}>Correct answer: {card.answer}</Text>
            <TouchableOpacity style={styles.button} onPress={nextCard}>
              <Text style={styles.buttonText}>
                {currentIndex === historyQuiz.length - 1 ? "Finish Quiz" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.counter}>
        Question {currentIndex + 1} / {historyQuiz.length}
      </Text>
      <Text style={styles.counter}>
        Correct: {correctCount} / Answered: {answeredCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { width: "90%", padding: 20, backgroundColor: "#fff", borderRadius: 10, elevation: 2 },
  question: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginTop: 20 },
  button: { backgroundColor: "#FF9800", padding: 12, borderRadius: 8, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  correctLabel: { fontSize: 18, marginTop: 10, textAlign: "center", color: "green" },
  counter: { marginTop: 10, fontSize: 14 },
});
