// app/_layout.tsx  (or app/layout.tsx if that's your project layout file)
import React, { useEffect, useRef, useState } from "react";
import { Slot, router, usePathname } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // scale animation for active tab
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.12, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  }, [pathname]);

  const isActive = (route: string) => pathname === route;

  // navigate and close menu
  const go = (route: string) => {
    setMenuOpen(false);
    router.push(route);
  };

return (  
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="folder-open-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.headerTitle}>Resources</Text>
          </View>
          <Text style={styles.headerSubtitle}>Upload and learn from Resources</Text>
        </View>

        <View style={styles.iconsRow}>
          <TouchableOpacity accessibilityLabel="Search">
            <Ionicons name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity accessibilityLabel="Notifications" style={{ marginLeft: 10 }}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Menu"
            onPress={() => setMenuOpen((s) => !s)}
            style={{ marginLeft: 10 }}
          >
            <MaterialCommunityIcons name="dots-vertical" size={25} color="#fff" />
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
          <MenuItem icon="home-outline" label="Home" onPress={() => go("/")} />
          <MenuItem icon="information-circle-outline" label="About" onPress={() => go("/about")} />
          {/* Ionicons has 'code-slash-outline' — if you prefer another icon change it */}
          <MenuItem icon="code-slash-outline" label="API" onPress={() => go("/api")} />
          <MenuItem icon="document-text-outline" label="Docs" onPress={() => go("/docs")} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <NavItem route="/" icon="home-outline" label="Home" active={isActive("/")} />

       <NavItem route="/account" icon="person-circle-outline" label="Account" active={isActive("/account")} />

       <NavItem route="/ai" icon="sparkles-outline" label="AI" active={isActive("/ai")} />

       <NavItem route="/docs" icon="document-text-outline" label="Docs" active={isActive("/docs")} />

      </View>
    </View>
  );
}

/* NavItem */
/* NavItem – fluid animation version */
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


/* MenuItem */
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
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#FFA800",
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    zIndex: 10,
  },

  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerSubtitle: { color: "#fff", fontSize: 12, opacity: 0.9, marginTop: 1 },

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
    top: 86, // place below header (adjust if your header size is different)
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

  content: { flex: 1, padding: 12, marginBottom: 70 },

  bottomNav: {
    height: 65,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },

  navItem: { alignItems: "center" },
  navText: { fontSize: 11, marginTop: 4, color: "#555", fontWeight: "500" },
  activeNavText: { color: "#FFA800", fontWeight: "700" },
});
