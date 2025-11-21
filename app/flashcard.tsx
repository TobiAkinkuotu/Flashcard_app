import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { updateUserProgress } from "./ProgressUpdater";

// Flashcard data
const flashcards = [
  { question: "5 + 3", answer: "8" },
  { question: "10 - 4", answer: "6" },
  { question: "7 × 6", answer: "42" },
  { question: "12 ÷ 3", answer: "4" },
];

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const { cards, filename } = useLocalSearchParams();

  const userId = "user876"; // match Firebase rule
  const flashcards = JSON.parse(cards)
  const card = flashcards[currentIndex];

  // Check the user's answer
  const checkAnswer = () => {
    Keyboard.dismiss();
    setChecked(true);
    setAnsweredCount(answeredCount + 1);

    if (userAnswer.trim() === card.answer) {
      setCorrectCount(correctCount + 1);
    }
  };

  // Go to next card or finish quiz
  const nextCard = async () => {
    Keyboard.dismiss();

    // Last card → save progress
    if (currentIndex === flashcards.length - 1) {
      try {
        await updateUserProgress(userId, correctCount, answeredCount);
        Alert.alert(
          "Quiz Completed!",
          `Progress saved!\nScore: ${correctCount}/${answeredCount}`,
          [{ text: "OK", onPress: restartQuiz }]
        );
      } catch (error) {
        console.error("Error saving progress:", error);
        Alert.alert("Error", "Could not save progress. Try again.");
      }
      return;
    }

    // Move to next card
    setCurrentIndex(currentIndex + 1);
    setUserAnswer("");
    setChecked(false);
  };

  // Restart the quiz
  const restartQuiz = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setChecked(false);
    setCorrectCount(0);
    setAnsweredCount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{filename} Flashcards</Text>

      <View style={styles.card}>
        <Text style={styles.question}>{card.question}</Text>

        <TextInput
          style={styles.input}
          placeholder="Type your answer..."
          value={userAnswer}
          onChangeText={setUserAnswer}
          keyboardType="numeric"
          editable={!checked} // disable input after checking
        />

        {!checked ? (
          <TouchableOpacity style={styles.button} onPress={checkAnswer}>
            <Text style={styles.buttonText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.correctLabel}>
              Correct answer: {card.answer}
            </Text>

            <TouchableOpacity style={styles.button} onPress={nextCard}>
              <Text style={styles.buttonText}>
                {currentIndex === flashcards.length - 1 ? "Finish Quiz" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.counter}>
        Card {currentIndex + 1} / {flashcards.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "bold" },
  card: { width: "80%", padding: 20, backgroundColor: "#fff", borderRadius: 10, elevation: 2 },
  question: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginTop: 20 },
  button: { backgroundColor: "#2196f3", padding: 12, borderRadius: 8, marginTop: 20, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  correctLabel: { fontSize: 18, marginTop: 10, textAlign: "center" },
  counter: { marginTop: 20, fontSize: 14 },
});
