import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE } from "./config";
import { useAuth } from "./context/AuthContext";

export default function Index() {
  const router = useRouter();
  const { logout } = useAuth?.() || { logout: async () => {} }; // fallback if context not ready
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Emily Johnson");
  const [avatarUrl, setAvatarUrl] = useState("https://i.pravatar.cc/200?img=5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { token } = useAuth?.() || { token: null };

  const handleEditProfile = () => {
    setEditing(true);
    setSuccess(false);
    setError(null);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleCancel = () => {
    setEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!token) {
      setError("No auth token set");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/api/account/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, avatarUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed (${res.status})`);
      }
      setSuccess(true);
      setEditing(false);
    } catch (e: any) {
      setError(e.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Account</Text>
          <Text style={styles.headerSubtitle}>Manage Account</Text>
        </View>
        <MaterialIcons name="more-vert" size={24} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
          </View>
          {editing ? (
            <>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                style={styles.input}
                autoCapitalize="words"
              />
              <TextInput
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                placeholder="Avatar URL"
                style={styles.input}
                autoCapitalize="none"
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email}>Logged in as: (email hidden)</Text>
            </>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && <Text style={styles.successText}>Profile updated</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Subscription</Text>
          <View style={styles.subscriptionRow}>
            <Ionicons name="star" size={16} color="#1e88e5" />
            <Text style={styles.subscriptionTier}>Premium</Text>
            <Text style={styles.subscriptionMeta}>(Renews 12/24)</Text>
          </View>
        </View>

        {editing ? (
          <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSave}
              style={[styles.button, styles.buttonPrimary, { marginBottom: 10 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleCancel}
              style={[styles.button, styles.buttonLight]}
              disabled={loading}
            >
              <Text style={[styles.buttonText, styles.buttonTextDark]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleEditProfile}
            style={[styles.button, styles.buttonLight]}
          >
            <Text style={[styles.buttonText, styles.buttonTextDark]}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleLogout}
          style={[styles.button, styles.buttonPrimary]}
        >
          <View style={styles.buttonContentRow}>
            <Text style={styles.buttonText}>Logout</Text>
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.tabBar}>
        <View style={styles.tabItem}>
          <Ionicons name="home-outline" size={22} color="#666" />
          <Text style={styles.tabLabel}>Home</Text>
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="sparkles-outline" size={22} color="#666" />
          <Text style={styles.tabLabel}>AI</Text>
        </View>
        <View style={styles.tabItemActive}>
          <Ionicons name="person" size={22} color="#ff9800" />
          <Text style={styles.tabLabelActive}>Account</Text>
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="document-text-outline" size={22} color="#666" />
          <Text style={styles.tabLabel}>Docs</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const ORANGE = "#ff9800";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#ffe0b2",
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: ORANGE,
    overflow: "hidden",
    marginBottom: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    color: "#888",
  },
  section: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 6,
  },
  subscriptionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subscriptionTier: {
    color: "#1e88e5",
    fontWeight: "700",
    marginLeft: 6,
  },
  subscriptionMeta: {
    color: "#999",
    marginLeft: 6,
    fontSize: 12,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonLight: {
    backgroundColor: "#e0e0e0",
  },
  buttonPrimary: {
    backgroundColor: ORANGE,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonTextDark: {
    color: "#333",
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e5e5",
    backgroundColor: "#fafafa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemActive: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },
  tabLabelActive: {
    color: ORANGE,
    fontSize: 11,
    marginTop: 2,
    fontWeight: "700",
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#222',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: 4,
    fontSize: 12,
  },
  successText: {
    color: '#2e7d32',
    marginTop: 4,
    fontSize: 12,
  },
});

