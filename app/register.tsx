import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "./context/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const ok = await register(name, email, password);
    setLoading(false);
    if (!ok) {
      setError("Registration failed");
      return;
    }
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.brand}>ACCOUNTS</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us and get started</Text>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonPrimaryText}>Register</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.altLink} onPress={() => router.push("/login")}> 
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const ORANGE = '#ff9800';
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 32, justifyContent: 'center' },
  brand: { textAlign: 'center', fontSize: 12, letterSpacing: 4, fontWeight: '600', color: ORANGE, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', color: '#222' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 24 },
  card: { backgroundColor: '#fafafa', borderRadius: 12, padding: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  input: { borderWidth: 1, borderColor: '#d0d0d0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14, backgroundColor: '#fff', fontSize: 15 },
  buttonPrimary: { backgroundColor: ORANGE, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  buttonPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  error: { color: '#d32f2f', marginBottom: 8, fontSize: 13 },
  link: { color: ORANGE, marginTop: 18, textAlign: 'center', fontWeight: '600' },
  altLink: { marginTop: 4 }
});
