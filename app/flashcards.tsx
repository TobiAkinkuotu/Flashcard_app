import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// ---------- LOAD FILE CONTENT ----------
import { decode } from "base64-arraybuffer";
import { File, Directory, Paths } from 'expo-file-system';
import { fetch } from 'expo/fetch';
import JSZip from "jszip";
// import RNFS from 'react-native-fs';


const docDir = Paths.document;


const saveJson = async (fileName: string, data: any) => {
  // Create a File object
  const file = new File(docDir, fileName + '.json');
  await file.create();  // ensures the file exists

  const text = JSON.stringify(data);
  await file.write(text);
  console.log('Saved JSON to', file.uri);
};

const saveFile = async (fileName: string, data: any) => {
  // Create a File object
  const file = new File(docDir, fileName);
  await file.create();  // ensures the file exists

  await file.write(data);
  console.log('Saved File Into App', file.uri);
};

const readJson = async (fileName: string): Promise<any | null> => {
  const file = new File(docDir, fileName + '.json');
  const exists = file.exists;
  if (!exists) {
    return null;
  }

  const content = await file.text();  // returns string
  return JSON.parse(content);
};

const deleteJson = async (fileName: string) => {
  const file = new File(docDir, fileName + '.json');
  await file.delete();
  console.log('Deleted', file.uri);
};

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



  async function extractDocxText(base64: string) {
    const uint8 = decode(base64);

    const zip = await JSZip.loadAsync(uint8);
    const xml = await zip.file("word/document.xml")?.async("string");

    if (!xml) return "";

    return xml
      .replace(/<w:p[^>]*>/g, "\n")   // new paragraphs
      .replace(/<[^>]+>/g, "")        // remove XML tags
      .trim();
  }


  async function extractPdfOrImage(base64: string, mimeType: string, apiKey: string) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-2.5-pro",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "Extract all readable text from the attached file. " +
                    "If it is an image, perform OCR. Return ONLY plain text or generate text descirbing the image.",
                },
                {
                  inlineData: {
                    mimeType,
                    data: base64,
                  },
                },
              ],
            },
          ],
        }),
      }
  );
  const json = await res.json();

  if (json.error) {
    throw new Error("Gemini error: " + json.error.message);
  }

  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text.trim();
  }

  /**
 * Extracts the file extension from the file name.
 * @param {string} name - The file name (e.g., 'document.txt', 'notes.pdf').
 * @returns {string} The extension (e.g., 'txt', 'pdf').
 */
  const getFileExtension = (name: string) => {
    // Find the last dot in the file name
    const lastDotIndex = name.lastIndexOf('.');
    
    // If no dot is found or the dot is the first character (like '.htaccess'), return empty
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return '';
    }
    
    // Return the substring after the last dot, converted to lowercase
    return name.substring(lastDotIndex + 1).toLowerCase();
  };




  // ---------- LOAD FILE CONTENT (FIXED) ----------
  const loadFileText = async () => {
    const ext = fileUri.split(".").pop()?.toLowerCase();
    const file = new File(fileUri);
    const base64 = await file.base64();
    const apiKey = await SecureStore.getItemAsync("GeminiAI_KEY");

    if (apiKey && ext){
    if (ext === "txt") {
          return file.text();
    }

    if (ext === "pdf") {
      return await extractPdfOrImage(base64, "application/pdf", apiKey);
    }

    if (ext === "docx") {
      return await extractDocxText(base64);
    }

    if (["jpg", "jpeg", "png", "heic", "heif", "webp", "gif"].includes(ext)) {
          return await extractPdfOrImage(base64, `image/${ext === "jpg" ? "jpeg" : ext}`, apiKey);
      }
    }
    
  
    throw new Error("Unsupported file type");
  };


const generateFlashcards = async () => {
    setLoading(true);
    setError("");
    const file = new File(fileUri);
    const base64 = await file.base64();

    try {
      const apiKey = await SecureStore.getItemAsync("GeminiAI_KEY");

      if (!apiKey) {
        setError("No API key saved. Please go to settings and enter your key.");
        setLoading(false);
        return;
      }

      const text = await loadFileText();
      if (!text) throw new Error("No file content");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Turn the following document into flashcards. The final response MUST be a JSON array following the structure:
      [
        { "question": "...", "answer": "..." }
      ]

      DOCUMENT:

      ${text}
      `,
                  },
                ],
              },
            ],

            // ❗ correct field
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      const data = await response.json();
      console.log("data:", data);

      // The API will return the raw JSON inside candidates[0].content.parts[0].text
      let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Parse the model-generated JSON
      const parsed = JSON.parse(raw);
      saveJson(fileName, parsed);
      await saveFile(fileName, base64)


      setFlashcards(parsed);
    } catch (e) {
      console.error(e);
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
