// app/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { Link } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { getUserProgress, Progress } from "../lib/ProgressUpdater";

export default function HomeScreen() {
  const [progress, setProgress] = useState<Progress>({
    completed: 0,
    accuracy: 0,
    streak: 0,
    totalCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
    lastCompleted: "",
  });

  const router = useRouter();
  const userId = "user876";

  useFocusEffect(
    useCallback(() => {
      const fetchProgress = async () => {
        try {
          const data = await getUserProgress(userId);
          if (data) setProgress(data);
        } catch (e) {
          console.error("Failed to fetch progress", e);
        }
      };

      fetchProgress();
    }, [userId])
  );
  
  


  // Fake items list
  const flashcards = [
    {
      id: 1,
      title: "Basic Math Flashcards",
      subtitle: "Addition, Subtraction, Multiplication",
      name: "math-flashcards.json",
      data: JSON.stringify([
        {question:  'what is 2 + 2', answer: '2 + 2 = 4'},
        {question:  'what is 2 * 2', answer: '2 * 2 = 4'},
        {question:  'what is 5 + 8', answer: '5 + 8 = 4'},
        {question:  'what is 100 + 250', answer: '100 + 250 = 350'},
        {question:  'what is 1000/20', answer: '1000/20 = 50'}
      ]),
    },
    {
      id: 2,
      title: "History Quiz: World War II",
      subtitle: "Test your knowledge on key events.",
      name: "ww2-quiz.json",
      data: JSON.stringify([
        {question: 'who was the first president of the USA', answer: 'George Washington was the first president of the USA'},
        {question: 'in what year did World War II end', answer: 'World War II ended in 1945'},
        {question: 'what ancient civilization built the pyramids of Giza', answer: 'The ancient Egyptians built the pyramids of Giza'},
        {question: 'what war was fought between the North and South regions of the USA', answer: 'The American Civil War was fought between the North and South regions of the USA'},
        {question: 'who was the first woman to win a Nobel Prize', answer: 'Marie Curie was the first woman to win a Nobel Prize'}
      ])
    },
  ];

  const notes = [
    {
      id: 1,
      title: "Physics Chapter 1 Notes",
      subtitle: "Page 1/30",
      name: "physics-notes.txt",
      data: "Kinematics is the branch of classical mechanics that describes the motion of points, bodies, and systems of bodies without considering the forces that cause them to move. In one dimension, motion is restricted to a straight line.",
    },
    {
      id: 2,
      title: "English (Part Of Speech) Notes",
      subtitle: "Completed 3 days ago",
      name: "english-vocab.txt",
      data: "The Parts of Speech are the fundamental categories of words in the English language, defining how a word functions grammatically in a sentence. There are typically eight main parts of speech.",
    },
  ];

  const openFile = (item: any) => {
    router.push({
      pathname: "/file_viewer",
      params: {
        name: item.name,
        data: item.data,
      },
    });
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.welcome}>Welcome back, Scholar!</Text>
          <Text style={styles.smallText}>Your Progress</Text>

          {/* Progress Row */}
          <View style={styles.progressRow}>
            <View style={styles.progressCard}>
              <Text style={styles.progressValue}>{progress.completed}</Text>
              <Text style={styles.progressLabel}>Completed✅</Text>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.progressValue}>{progress.accuracy}%</Text>
              <Text style={styles.progressLabel}>Accuracy📊</Text>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.progressValue}>{progress.streak} Days</Text>
              <Text style={styles.progressLabel}>🔥Streak</Text>
            </View>
          </View>

          {/* Recommended Flashcards */}
          <Text style={styles.sectionTitle}>Recommended for you</Text>

          {flashcards.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => openFile(item)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Previous Notes / Activities */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="timer-outline" size={20} /> Previous Activities
          </Text>

          {notes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.activityCard}
              onPress={() => openFile(item)}
            >
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  content: { flex: 1 },
  welcome: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  smallText: { fontSize: 12, color: "#777", marginBottom: 8 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressCard: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  progressValue: { fontSize: 18, fontWeight: "bold" },
  progressLabel: { fontSize: 12, color: "#555", marginTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  cardTitle: { fontWeight: "bold", marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: "#555" },
  activityCard: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  activityTitle: { fontWeight: "bold" },
  activitySubtitle: { fontSize: 12, color: "#777", marginTop: 4 },
});