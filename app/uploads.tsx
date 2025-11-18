import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";

export default function UploadsScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "*/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedFile(file);

      // Navigate to viewer screen and pass the file info
      router.push({
        pathname: "/viewer",
        params: {
          name: file.name,
          uri: file.uri,
          size: file.size?.toString() ?? "0",
        },
      });
    } catch (error) {
      console.log("File pick error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="upload-file" size={56} color="#0077B6" />
        <Text style={styles.title}>Upload Document</Text>
        <Text style={styles.subtitle}>Pick a file from your device</Text>

        <TouchableOpacity style={styles.pickButton} onPress={pickFile}>
          <Text style={styles.pickText}>Pick a file</Text>
        </TouchableOpacity>

        {selectedFile && (
          <Text style={{ marginTop: 12, color: "#333", fontSize: 14 }}>
            Selected: {selectedFile.name}
          </Text>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back to Resources</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  card: {
    marginTop: 24,
    backgroundColor: "#E8F6FF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: { marginTop: 12, fontSize: 20, fontWeight: "700", color: "#0077B6" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#555", textAlign: "center" },
  pickButton: {
    marginTop: 18,
    backgroundColor: "#0077B6",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  pickText: { color: "#fff", fontWeight: "600" },
  backButton: { marginTop: 16 },
  backText: { color: "#0077B6", fontWeight: "600" },
});
