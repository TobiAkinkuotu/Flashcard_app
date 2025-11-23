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

// Configuration for header content based on route
const routeConfig: Record<string, { title: string; subtitle: string; icon: any}> = {
  "/": { title: "Home", subtitle: "Welcome back!", icon: "home"},
  "/index": { title: "Home", subtitle: "Welcome back!", icon: "home"},
  "/account": { title: "My Account", subtitle: "Manage your profile and settings", icon: "person-circle-outline"},
  "/ai": { title: "AI Assistant", subtitle: "Ask your questions here", icon: "sparkles-outline"},
  "/docs": { title: "Documents", subtitle: "Access all flash cards and documents", icon: "folder-open-outline"},
  "/notifications": { title: "Notifications", subtitle: "View your recent alerts", icon: "notifications-outline"},
  "/help": { title: "Help Center", subtitle: "Find answers and support", icon: "help-circle-outline"},
  "/flashcard_": { title: "FlashCards", subtitle: "test your knowledge on documents.", icon: "layers-outline"},
  // Add other routes as needed
  // Default for unknown routes:
  // default: { title: "Resources", subtitle: "Upload and learn from Resources" },
};

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // scale animation for active tab (kept as is)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.12, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  }, [pathname]);

  const isActive = (route: string) => pathname === route || (route === '/' && pathname === '/index'); // Handle '/' and '/index' as active for home

  // navigate and close menu
  const go = (route: string) => {
    setMenuOpen(false);
    router.push(route);
  };

  const getHeaderContent = () => {
    const key = pathname in routeConfig ? pathname : '/';
    return routeConfig[key] || { title: "Resources", subtitle: "Upload and learn from Resources" };
  };

  const { title, subtitle, icon } = getHeaderContent();

  return (
    // Use SafeAreaView for the main container
    <SafeAreaView style={styles.container}> 
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* The icon is now dynamic based on the active route's primary intent, but keeping folder-open-outline for 'Resources' feel or you can make it dynamic too */}
            <Ionicons name={icon} size={20} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.headerTitle}>{title}</Text> {/* 👈 Dynamic Title */}
          </View>
          <Text style={styles.headerSubtitle}>{subtitle}</Text> {/* 👈 Dynamic Subtitle */}
        </View>

        <View style={styles.iconsRow}>
          <TouchableOpacity accessibilityLabel="Notifications" style={{ marginLeft: 10 }} onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Menu"
            onPress={() => setMenuOpen((s) => !s)}
            style={{ marginLeft: 10 }}
          >
            <MaterialCommunityIcons name="dots-vertical" size={25} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay to close when tapping outside */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Dropdown Menu */}
      {menuOpen && (
      <View style={styles.menuContainer}>
      {/* Menu items adjusted to use correct routes */}
      <MenuItem icon="home-outline" label="Home" onPress={() => go("/")} /> 
      <MenuItem icon="information-circle-outline" label="Account" onPress={() => go("/account")} />
      <MenuItem icon="code-slash-outline" label="AI" onPress={() => go("/ai")} />
      <MenuItem icon="document-text-outline" label="Docs" onPress={() => go("/docs")} />
      <MenuItem icon="help-circle-outline" label="Help" onPress={() => go("/help")} />
</View>
      )}

      {/* Content: Must be flexible to push the SafeAreaView's bottom edge down */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Bottom navigation - Wrapped in a separate SafeAreaView */}
      <SafeAreaView style={styles.bottomNavContainer}> 
        <View style={styles.bottomNav}>
          <NavItem route="/" icon="home-outline" label="Home" active={isActive("/")} />
          <NavItem route="/ai" icon="sparkles-outline" label="AI" active={isActive("/ai")} />
          <NavItem route="/docs" icon="document-text-outline" label="Docs" active={isActive("/docs")} />
          <NavItem route="/account" icon="person-circle-outline" label="Account" active={isActive("/account")} />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

/* NavItem */
/* NavItem – fluid animation version (kept as is) */
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
    <TouchableOpacity
      onPressIn={pressIn}
      onPressOut={pressOut}
      activeOpacity={0.7}
      style={styles.navItem}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={icon as any}
          size={26}
          color={active ? "#FFA800" : "#555"}
        />
      </Animated.View>

      <Text style={[styles.navText, active && styles.activeNavText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}


/* MenuItem (kept as is) */
function MenuItem({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Ionicons name={icon as any} size={18} color="#333" />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Styles */
const styles = StyleSheet.create({
  // Main container is now SafeAreaView, so it handles top inset automatically
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  header: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    // Changed paddingTop to be relative to the Safe Area, usually the main SafeAreaView handles it, 
    // but in case the header needs to fill the space, we set a smaller padding here.
    paddingTop: 12, 
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    zIndex: 10,
  },

  headerTitle: { color: "#000", fontSize: 18, fontWeight: "700" },
  headerSubtitle: { color: "#000", fontSize: 12, opacity: 0.9, marginTop: 1 },

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
    top: 60, // Adjusted top value for slightly less padding
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 6,
    width: 180,
    elevation: 6,
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: 8,
  },

  // Content needs to have a bottom margin equal to the height of the bottom nav to prevent overlap
  content: { flex: 1, padding: 12, marginBottom: 70 }, 

  // New container for bottom navigation to ensure safe area at the bottom
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff", // Match this with your bottomNav background
    elevation: 10,
    zIndex: 10,
  },

  // The bottomNav itself is now inside the SafeAreaView, so it's only responsible for internal layout
  bottomNav: {
    height: 65, // Fixed height for the actual navigation bar content
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
