import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { saveKey, getKey } from "./storage";

export default function ApiKeyScreen() {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");

  useEffect(() => {
    loadSavedKey();
  }, []);

  const loadSavedKey = async () => {
    const key = await getKey("GeminiAI_KEY");
    setSavedKey(key || "");
  };

  const handleSave = async () => {
    await saveKey("GeminiAI_KEY", apiKey.trim());
    loadSavedKey();
  };

  const handleClear = async () => {
    await saveKey("GeminiAI_KEY", "");
    loadSavedKey();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Key Settings</Text>

      <TextInput
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="Enter GeminiAI Key..."
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save API Key</Text>
      </TouchableOpacity>

      {savedKey !== "" ? (
        <>
          <Text style={styles.savedLabel}>Saved Key:</Text>
          <Text numberOfLines={1} style={styles.savedKey}>
            {savedKey}
          </Text>

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Clear Key</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ marginTop: 20, color: "#555" }}>No key saved.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#28C7DA",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "700" },
  savedLabel: { marginTop: 20, fontWeight: "600" },
  savedKey: {
    marginTop: 5,
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
    fontSize: 13,
  },
  clearButton: {
    marginTop: 12,
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearText: { color: "#fff", fontWeight: "700" },
});
