import { Stack, useRouter, useSegments } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AuthGate({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { token, initialized } = useAuth();

  React.useEffect(() => {
    if (!initialized) return;
    const first = segments[0] as string | undefined;
    const inAuthGroup = first === "login" || first === "register"; // simplified gating
    if (!token && !inAuthGroup) router.replace("/login");
    if (token && inAuthGroup) router.replace("/");
  }, [segments, token, initialized]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </AuthProvider>
  );
}
