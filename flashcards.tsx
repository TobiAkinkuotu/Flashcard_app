import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

// ---------- TYPES ----------
type Flashcard = {
  question: string;
  answer: string;
};

// ---------- COMPONENT ----------
export default function FlashcardsScreen() {
  const { uri, name } = useLocalSearchParams();

  const fileUri = typeof uri === "string" ? uri : "";
  const fileName = typeof name === "string" ? name : "";

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------- LOAD FILE CONTENT ----------
  const loadFileText = async () => {
    try {
      const res = await fetch(fileUri);
      return await res.text();
    } catch (e) {
      setError("Failed to load file.");
      return "";
    }
  };

  // ---------- SEND TO OPENAI ----------
  const generateFlashcards = async () => {
    setLoading(true);
    setError("");

    try {
      const apiKey = await SecureStore.getItemAsync("OPENAI_KEY");

      if (!apiKey) {
        setError("No API key saved. Please go to settings and enter your key.");
        setLoading(false);
        return;
      }

      const text = await loadFileText();
      if (!text) throw new Error("No file content");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You generate flashcards. Return ONLY a JSON array of objects with 'question' and 'answer'.",
            },
            {
              role: "user",
              content: `Turn the following document into flashcards:\n\n${text}`,
            },
          ],
        }),
      });

      const data = await response.json();
      let raw = data.choices?.[0]?.message?.content || "";

      const parsed = JSON.parse(raw);
      setFlashcards(parsed);
    } catch (e) {
      setError("Failed to generate flashcards.");
    }

    setLoading(false);
  };

  useEffect(() => {
    generateFlashcards();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Flashcards from: {fileName}</Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#28C7DA" />
          <Text style={{ marginTop: 10, color: "#555" }}>Generating...</Text>
        </View>
      )}

      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && flashcards.length > 0 && (
        <ScrollView style={styles.cardList}>
          {flashcards.map((card: Flashcard, index: number) => (
            <View key={index} style={styles.card}>
              <Text style={styles.q}>Q: {card.question}</Text>
              <Text style={styles.a}>A: {card.answer}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Retry button */}
      {!loading && (
        <TouchableOpacity style={styles.retryButton} onPress={generateFlashcards}>
          <Text style={styles.retryText}>Regenerate Flashcards</Text>
        </TouchableOpacity>
      )}

      {/* NEW SETTINGS BUTTON */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/api-key")}
      >
        <Text style={styles.settingsText}>Open API Key Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 14 },

  center: { alignItems: "center", justifyContent: "center", flex: 1 },

  errorBox: {
    backgroundColor: "#ffe6e6",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffb3b3",
    marginBottom: 12,
  },
  errorText: { color: "#b30000", fontWeight: "600" },

  cardList: { marginTop: 10 },
  card: {
    backgroundColor: "#F4F4F4",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  q: { fontWeight: "700", fontSize: 15, color: "#1a1a1a" },
  a: { marginTop: 6, color: "#444", fontSize: 14 },

  retryButton: {
    backgroundColor: "#28C7DA",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  retryText: { color: "#fff", fontWeight: "700" },

  settingsButton: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  settingsText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
