import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Slot, router, usePathname } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Auth screens (NO layout shown)
const authRoutes = ["/login", "/signup"];

// Header + Subtitle config per screen
const routeConfig: Record<
  string,
  { title: string; subtitle: string; icon: any }
> = {
  "/": { title: "Home", subtitle: "Welcome back!", icon: "home" },
  "/index": { title: "Home", subtitle: "Welcome back!", icon: "home" },
  "/home": { title: "Home", subtitle: "Welcome back!", icon: "home" },
  "/account": {
    title: "My Account",
    subtitle: "Manage your profile and settings",
    icon: "person-circle-outline",
  },
  "/ai": {
    title: "AI Assistant",
    subtitle: "Ask your questions here",
    icon: "sparkles-outline",
  },
  "/docs": {
    title: "Documents",
    subtitle: "Access all flash cards and documents",
    icon: "folder-open-outline",
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "View your recent alerts",
    icon: "notifications-outline",
  },
  "/help": {
    title: "Help Center",
    subtitle: "Find answers and support",
    icon: "help-circle-outline",
  },
};

// MAIN LAYOUT
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // 🔹 If route is auth (login/signup) OR pathname not ready, render only Slot
  console.log(pathname)
  // if (!pathname || authRoutes.includes(pathname)) {
  //   return <Slot />;
  // }

  // Page bounce animation on navigation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.12,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pathname]);

  const isActive = (route: string) =>
    pathname === route || (route === "/" && pathname === "/index");

  const go = (route: string) => {
    setMenuOpen(false);
    router.push(route);
  };

  const getHeader = () => {
    return (
      routeConfig[pathname] || {
        title: "Resources",
        subtitle: "Upload and learn from Resources",
        icon: "folder-open-outline",
      }
    );
  };

  const { title, subtitle, icon } = getHeader();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={icon}
              size={20}
              color="#000"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.iconsRow}>
          <TouchableOpacity
            accessibilityLabel="Notifications"
            style={{ marginLeft: 10 }}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Menu"
            onPress={() => setMenuOpen((s) => !s)}
            style={{ marginLeft: 10 }}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={25}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* OVERLAY */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* MENU DROPDOWN */}
      {menuOpen && (
        <View style={styles.menuContainer}>
          <MenuItem icon="home-outline" label="Home" onPress={() => go("/home")} />
          <MenuItem icon="person-circle-outline" label="Account" onPress={() => go("/account")} />
          <MenuItem icon="sparkles-outline" label="AI" onPress={() => go("/ai")} />
          <MenuItem icon="document-text-outline" label="Docs" onPress={() => go("/docs")} />
          <MenuItem icon="help-circle-outline" label="Help" onPress={() => go("/help")} />
        </View>
      )}

      {/* CONTENT */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* BOTTOM NAV */}
      <SafeAreaView style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <NavItem route="/home" icon="home-outline" label="Home" active={isActive("/home")} />
          <NavItem route="/ai" icon="sparkles-outline" label="AI" active={isActive("/ai")} />
          <NavItem route="/docs" icon="document-text-outline" label="Docs" active={isActive("/docs")} />
          <NavItem route="/account" icon="person-circle-outline" label="Account" active={isActive("/account")} />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

/* -----------------------
        NAV ITEM
------------------------ */
function NavItem({ route, icon, label, active }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start(() => {
      router.push(route);
    });
  };

  return (
    <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} activeOpacity={0.7} style={styles.navItem}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={icon} size={26} color={active ? "#FFA800" : "#555"} />
      </Animated.View>
      <Text style={[styles.navText, active && styles.activeNavText]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* -----------------------
        MENU ITEM
------------------------ */
function MenuItem({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Ionicons name={icon} size={18} color="#333" />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* -----------------------
        STYLES
------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },

  headerTitle: { color: "#000", fontSize: 18, fontWeight: "700" },
  headerSubtitle: { color: "#000", fontSize: 12, opacity: 0.9 },

  iconsRow: { flexDirection: "row", alignItems: "center" },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
  },

  menuContainer: {
    position: "absolute",
    right: 12,
    top: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 6,
    width: 180,
    elevation: 6,
    zIndex: 20,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },

  menuText: { fontSize: 14, color: "#333", fontWeight: "500" },

  content: { flex: 1, padding: 12, marginBottom: 70 },

  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    elevation: 10,
    zIndex: 10,
  },

  bottomNav: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: { alignItems: "center" },

  navText: { fontSize: 11, marginTop: 4, color: "#555", fontWeight: "500" },

  activeNavText: { color: "#FFA800", fontWeight: "700" },
});
