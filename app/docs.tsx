
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
};

const deleteFile = async (fileName: string) => {
  const file = new File(docDir, fileName);
  await file.delete();
  console.log('Deleted', file.uri);
};


const DOUBLE_TAP_DELAY = 300; // ms

const FileItem = ({ name, uri, selected, onPress }: Props) => {
  const [lastTap, setLastTap] = React.useState<number | null>(null);

  const handlePress = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      // DOUBLE TAP DETECTED
      Alert.alert("Opening File...", `Page has not been created to preview ${name} 😕`);
    } else {
      // SINGLE TAP → normal onPress
      setLastTap(now);
      onPress && onPress();
    }
  };

  const getFileExtension = (uri: string) => uri.split('.').pop();
  const icon_type =
    getFileExtension(uri) === "json"
      ? "layers-outline"
      : "document-text-outline";

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.fileItem, selected && styles.selectedItem]}
    >
      <Ionicons name={icon_type} size={28} color="#0A7F42" />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.fileTitle}>{name}</Text>
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

const FilesList: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const items = await docDir.list();

        const filesWithInfo: FileInfo[] = await Promise.all(
          items.map(async (item) => {
            return {
              name: item.name,
              uri: item.uri,
            };
          })
        );

        setFiles(filesWithInfo);
      } catch (e) {
        console.error('Error loading files:', e);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (files.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No files found in document directory.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={files}
      keyExtractor={(item) => item.uri}
      renderItem={({ item }) => (
      <FileItem
        name={item.name}
        uri={item.uri}
        selected={selectedUri === item.uri}
        onPress={() => setSelectedUri(item.uri)}
      />
      )}
    />
  );
};



export default function ResourcesScreen() {
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

      <FilesList />
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
