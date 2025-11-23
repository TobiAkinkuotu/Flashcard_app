import { useLocalSearchParams, router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import mammoth from "mammoth";
import { useEffect, useState } from "react";



export default function ViewerScreen() {
  const { name, uri, data} = useLocalSearchParams();

  const fileName = typeof name === "string" ? name : "";
  const fileUri = typeof uri === "string" ? uri : "";
//   const fileSize = typeof size === "string" ? Number(size) : 0;

  const isPDF = fileName.toLowerCase().endsWith(".pdf");
  const isFlashCards = fileName.toLowerCase().endsWith(".json")
  const isText = fileName.toLowerCase().endsWith(".txt");
  const isDocx = fileName.toLowerCase().endsWith(".docx");

  let [textContent, setTextContent] = useState("");
  const [FlashcardContent, setFCContent] = useState("");
  const [docxHtml, setDocxHtml] = useState("");
  let fileOpened = false;

  // Load TXT and DOCX content
  if (!data){
  useEffect(() => {
      if (isText && fileUri) {
        fetch(fileUri)
          .then((res) => res.text())
          .then((txt) => setTextContent(txt))
          .catch(() => setTextContent("Unable to load .txt file."));
      }

      if (isDocx && fileUri) {
        fetch(fileUri)
          .then((res) => res.arrayBuffer())
          .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
          .then((result) => setDocxHtml(result.value))
          .catch(() => setDocxHtml("<p>Unable to open .docx file.</p>"));

      }

      if (isFlashCards && fileUri){
        fetch(fileUri)
          .then((res) => res.text())
          .then((json) => router.push({
            pathname: "/flashcard_",
            params: {
              cards: json,
              filename: fileName
            },
          }))
          .catch(() => setFCContent("Unable to load flashcards."));


      }
    }, [fileUri]);
  }else{
    if (!fileOpened){
      fileOpened = true
      console.log("sample data given...")
      if (isText){
        console.log(data)
        textContent = data;
      }

      if (isFlashCards){
        router.push({
          pathname: "/flashcard_",
          params: {
            cards: data,
            filename: fileName
          },
      })
    }
    
    }
  }
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{fileName}</Text>
        {/* <Text style={styles.fileInfo}>{(fileSize / 1024).toFixed(1)} KB</Text> */}
      </View>

      {/* ===========================
          FILE PREVIEW SECTION 
         =========================== */}
      <View style={styles.previewBox}>

        {/* {isFlashCards && (
            // <View style={styles.container}>
            //     <Text style={styles.center}>flashcards page, not yet added! {FlashcardContent}</Text>
            // </View>
        )} */}

        {/* PDF Viewer */}
        {isPDF && (
          <WebView
            style={{ flex: 1 }}
            originWhitelist={["*"]}
            source={{ uri: fileUri }}
          />
        )}

        {/* DOCX Viewer */}
        {isDocx && (
          <WebView
            style={{ flex: 1 }}
            originWhitelist={["*"]}
            source={{ html: docxHtml }}
          />
        )}

        {/* TXT Viewer */}
        {isText && (
          <ScrollView style={{ padding: 10 }}>
            <Text style={styles.txt}>{textContent}</Text>
          </ScrollView>
        )}

        {/* Unsupported Files */}
        {!isPDF && !isDocx && !isText && !isFlashCards && (
          <View style={styles.unsupportedBox}>
            <Text style={styles.unsupportedText}>Cannot open selected file `file not supported`.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#111" },
  fileInfo: { marginTop: 4, color: "#777" },

  previewBox: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    overflow: "hidden",
  },

  txt: { fontSize: 15, color: "#333" },

  unsupportedBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  unsupportedText: { color: "#777", fontSize: 15 },

  convertButton: {
    backgroundColor: "#28C7DA",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  convertText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
