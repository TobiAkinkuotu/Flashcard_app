
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView  } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ResourcesScreen() {
 const files = [
  {
    id: 1,
    title: "Physics Chapter 1 Notes",
    date: "2023-10-26",
    icon: "document-text-outline",
    selected: false
  },
  {
    id: 2,
    title: "Biology Chapter 5 Flashcards",
    date: "2023-10-25",
    icon: "layers-outline",
    selected: true
  },
  {
    id: 3,
    title: "History Exam Prep",
    date: "2023-10-20",
    icon: "document-text-outline",
    selected: false
  }
];
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
        <Text style={styles.headerSubtitle}>Upload and learn from Resources</Text>
      </View>

      {/* Upload Document Box */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => router.push("/uploads")}
      >
        <MaterialIcons name="upload-file" size={40} color="#0077B6" />
        <Text style={styles.uploadLabel}>Upload New Document</Text>
      </TouchableOpacity>

      {/* Convert Button */}
      <TouchableOpacity
        style={styles.convertButton}
        onPress={() => router.push("/flashcards")}
      >
        <Text style={styles.convertText}>Convert Selected to FlashCards</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 6 }} />
        <TextInput placeholder="Search Files..." style={styles.searchInput} />
      </View>

      {/* File Items */}
      {/* <View style={styles.fileItem}>
        <Ionicons name="document-text-outline" size={28} color="#333" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.fileTitle}>Physics Chapter 1 Notes</Text>
          <Text style={styles.fileDate}>Uploaded 2023-10-26</Text>
        </View>

        <View style={styles.checkboxInactive} />
      </View>

      <View style={[styles.fileItem, styles.selectedItem]}>
        <Ionicons name="layers-outline" size={28} color="#0A7F42" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.fileTitle}>Biology Chapter 5 Flashcards</Text>
          <Text style={styles.fileDate}>Uploaded 2023-10-25</Text>
        </View>

        <View style={styles.checkboxActive}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </View>
      </View>

      <View style={styles.fileItem}>
        <Ionicons name="document-text-outline" size={28} color="#333" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.fileTitle}>History Exam Prep</Text>
          <Text style={styles.fileDate}>Uploaded 2023-10-20</Text>
        </View>

        <View style={styles.checkboxInactive} />
      </View> */}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: "#E30613",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },

  uploadBox: {
    backgroundColor: "#E8F6FF",
    paddingVertical: 35,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  uploadLabel: {
    marginTop: 10,
    color: "#0077B6",
    fontWeight: "600",
  },

  convertButton: {
    backgroundColor: "#28C7DA",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  convertText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },

  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e3e3e3",
  },

  selectedItem: {
    borderColor: "#0A7F42",
    backgroundColor: "#E6F8EF",
  },

  fileTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  fileDate: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },

  checkboxInactive: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#aaa",
    borderRadius: 4,
  },

  checkboxActive: {
    width: 22,
    height: 22,
    backgroundColor: "#0A7F42",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
