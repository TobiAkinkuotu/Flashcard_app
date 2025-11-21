import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  // Use the auth hook once; remove optional chaining fallback pattern
  const { token, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  // Removed subscription-related state for simplified backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // token now provided above

  const handleEditProfile = () => {
    setEditing(true);
    setSuccess(false);
    setError(null);
  };

  const uploadAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!token) return;
    setAvatarError(null);
    setUploadingAvatar(true);
    try {
      const name = asset.fileName || 'avatar.jpg';
      const type = asset.mimeType || 'image/jpeg';
      const form = new FormData();
      form.append('avatar', { uri: asset.uri, name, type } as any);
      const res = await fetch(`${API_BASE}/api/account/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Upload failed');
      }
      const data = await res.json();
      if (data.user?.avatarUrl) {
        const raw = data.user.avatarUrl as string;
        const full = raw.startsWith('http') ? raw : `${API_BASE}${raw}`;
        setAvatarUrl(full);
      } else {
        // Fallback: refresh /me
        const me = await fetch(`${API_BASE}/api/account/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (me.ok) {
          const m = await me.json();
          const raw = m.user?.avatarUrl as string | undefined;
          if (raw) setAvatarUrl(raw.startsWith('http') ? raw : `${API_BASE}${raw}`);
        }
      }
    } catch (e:any) {
      setAvatarError(e.message || 'Upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const pickAndUploadAvatar = async () => {
    if (!token) return;
    setAvatarError(null);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setAvatarError('Permission denied');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (result.canceled || !result.assets.length) return;
      await uploadAsset(result.assets[0]);
    } catch (e:any) {
      setAvatarError(e.message || 'Upload failed');
    }
  };

  const takePhotoAndUploadAvatar = async () => {
    if (!token) return;
    setAvatarError(null);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        setAvatarError('Camera permission denied');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (result.canceled || !result.assets.length) return;
      await uploadAsset(result.assets[0]);
    } catch (e:any) {
      setAvatarError(e.message || 'Upload failed');
    }
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
      // Re-fetch user to update local state with any server-side modifications
      const meRes = await fetch(`${API_BASE}/api/account/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const data = await meRes.json();
        const u = data.user;
        setName(u.name);
        setEmail(u.email);
        setAvatarUrl(u.avatarUrl || avatarUrl || null);
      }
      setSuccess(true);
      setEditing(false);
    } catch (e: any) {
      setError(e.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/api/account/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const u = data.user;
        setName(u.name);
        setEmail(u.email);
        setAvatarUrl(u.avatarUrl || "https://i.pravatar.cc/200?img=5");
        // Subscription removed from backend; no longer set tier/renewal
      } catch (e) {
        // silent
      }
    };
    fetchProfile();
  }, [token]);

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
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}> 
                <Text style={{ fontSize: 18, color: '#555' }}>?</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.avatarButton} onPress={pickAndUploadAvatar} disabled={uploadingAvatar}>
            {uploadingAvatar ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.avatarButtonText}>Change Avatar</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.avatarButton, { backgroundColor: '#607d8b' }]} onPress={takePhotoAndUploadAvatar} disabled={uploadingAvatar}>
            {uploadingAvatar ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.avatarButtonText}>Take Photo</Text>}
          </TouchableOpacity>
          {editing ? (
            <>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                style={styles.input}
                autoCapitalize="words"
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{name}</Text>
              {email && <Text style={styles.email}>Logged in as: {email}</Text>}
            </>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && <Text style={styles.successText}>Profile updated</Text>}
          {avatarError && <Text style={styles.errorText}>{avatarError}</Text>}
        </View>

        {/* Subscription section removed */}

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
  avatarButton: {
    backgroundColor: ORANGE,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  avatarButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
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
  // Removed subscription styles
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

