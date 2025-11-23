
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { File, Paths } from 'expo-file-system';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const docDir = Paths.document;
let files: any[] = [];
let filesList: any[] = [];

type FileInfo = {
  name: string;
  uri: string;
};

type Props = {
  name: string;
  uri: string;
  selected: boolean;
  onPress: () => void;
  onOpen:() => void;
  onDelete:() => void;
};

const deleteFile = async (fileName: string) => {
  const file = new File(docDir, fileName);
  await file.delete();
  console.log('Deleted', file.uri);
};


// BLOCK 1 — FILE ITEM COMPONENT
const DOUBLE_TAP_DELAY = 300; // ms

const FileItem = ({ name, uri, selected, onPress, onOpen, onDelete }: Props) => {
  const [lastTap, setLastTap] = React.useState<number | null>(null);

  const handlePress = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      onOpen && onOpen(); // double tap
    } else {
      setLastTap(now);
      onPress && onPress(); // single tap
    }
  };

  const handleLongPress = () => {
    Alert.alert(
      "Delete File",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete() },
      ]
    );
  };

  const getFileExtension = (uri: string) => uri.split(".").pop();
  let FlashCardName = 
  getFileExtension(uri) === "json"
      ? name.split(".")[0] + " (FlashCards)"
      : name;
  
  const icon_type =
    getFileExtension(uri) === "json"
      ? "layers-outline"
      : "document-text-outline";

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
      style={[styles.fileItem, selected && styles.selectedItem]}
    >
      <Ionicons name={icon_type} size={28} color="#0A7F42" />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.fileTitle}>{FlashCardName}</Text>
      </View>

      {selected ? (
        <View style={styles.checkboxActive}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </View>
      ) : (
        <View style={styles.checkboxInactive} />
      )}
    </Pressable>
  );
};

// BLOCK 2 — FILE LIST COMPONENT WITH SEARCH
const FilesList: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const items = await docDir.list();

        const filesWithInfo: FileInfo[] = items.map((item) => ({
          name: item.name,
          uri: item.uri,
        }));

        setFiles(filesWithInfo);
      } catch (e) {
        console.error("Error loading files:", e);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  // DELETE FUNCTION
  const deleteFile = async (name: string) => {
    try {
      const file = new File(docDir, name);
      await file.delete();

      setFiles((prev) => prev.filter((f) => f.name !== name));

      console.log("Deleted:", name);
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // FILTER BASED ON SEARCH
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (filteredFiles.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No matching files found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredFiles}
      keyExtractor={(item) => item.uri}
      renderItem={({ item }) => (
        <FileItem
          name={item.name}
          uri={item.uri}
          selected={selectedUri === item.uri}
          onPress={() => setSelectedUri(item.uri)}
          onDelete={() => deleteFile(item.name)}
          onOpen={() =>
            router.push({
              pathname: "/file_viewer",
              params: { name: item.name, uri: item.uri },
            })
          }
        />
      )}
    />
  );
};

// BLOCK 3 — FULL SCREEN
export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>
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

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search Files..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* File List */}
      <FilesList searchQuery={searchQuery} />
    </View>
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
