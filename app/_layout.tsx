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
  Platform,
} from "react-native";

// --- LIGHT THEME CONFIGURATION ---
const HEADER_COLOR = "#9000ffff";    // Deep Cyan/Blue for the header
const PRIMARY_BG = "#FFFFFF";      // Pure White for main background elements
const SECONDARY_BG = "#F9F9F9";    // Very light gray for content area background
const ACCENT_COLOR = "#FFA800";    // Vibrant Gold/Orange for active elements
const TEXT_COLOR = "#333333";      // Dark Gray for primary text (in light areas)
const SUBTITLE_COLOR = "#C0C0C0";  // Light Gray for secondary text (on dark header)
const BORDER_COLOR = "#E0E0E0";    // Light border color

// Configuration for header content based on route
const routeConfig = {
  "/": { title: "Home", subtitle: "Your centralized learning space", icon: "home"},
  "/index": { title: "Recallr Hub", subtitle: "Your centralized learning space", icon: "home"},
  "/account": { title: "Profile", subtitle: "Manage your account settings", icon: "person-circle-outline"},
  "/ai": { title: "Juno AI", subtitle: "Chat with your intelligent assistant", icon: "sparkles"},
  "/docs": { title: "Document Library", subtitle: "Access all flash cards and documents", icon: "folder-open-outline"},
  "/notifications": { title: "Notifications", subtitle: "View your recent alerts", icon: "notifications-outline"},
  "/help": { title: "Support", subtitle: "Find answers and help documentation", icon: "help-circle-outline"},
  "/flashcard_": { title: "FlashCards", subtitle: "Test your knowledge on documents.", icon: "layers-outline"},
};

// --- MAIN LAYOUT COMPONENT ---
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Scale animation for active tab selection
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [pathname]);

  const isActive = (route) => pathname === route || (route === '/' && pathname === '/index');

  // Navigate and close menu
  const go = (route) => {
    setMenuOpen(false);
    router.push(route);
  };

  const getHeaderContent = () => {
    const key = pathname in routeConfig ? pathname : '/';
    return routeConfig[key] || routeConfig["/"];
  };

  const { title, subtitle, icon } = getHeaderContent();

  return (
    // Root container to contain everything and define the overflow color
    <View style={styles.rootContainer}> 
      
      {/* Header Background View: Fills the entire top area (including status bar) */}
      <View style={styles.headerBackground}>
        {/* Header Content: Pushed down by SafeAreaView to sit below the status bar */}
        <SafeAreaView>
            <View style={styles.headerContentWrapper}>
                <View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {/* Icon color for dark header */}
                        <Ionicons name={icon} size={22} color={ACCENT_COLOR} style={{ marginRight: 8 }} />
                        {/* Text color for dark header */}
                        <Text style={styles.headerTitle}>{title}</Text>
                    </View>
                    {/* Subtitle color for dark header */}
                    <Text style={styles.headerSubtitle}>{subtitle}</Text>
                </View>

                <View style={styles.iconsRow}>
                    <TouchableOpacity 
                        accessibilityLabel="Notifications" 
                        style={styles.headerButton} 
                        onPress={() => router.push("/notifications")}
                    >
                        <Ionicons name="notifications-outline" size={24} color={PRIMARY_BG} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        accessibilityLabel="Menu"
                        onPress={() => setMenuOpen((s) => !s)}
                        style={styles.headerButton}
                    >
                        <MaterialCommunityIcons name="dots-vertical" size={26} color={PRIMARY_BG} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
      </View>


      {/* Overlay to close when tapping outside */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          {/* Overlay is positioned absolutely over the content area */}
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Dropdown Menu: Positioned relative to the viewport */}
      {menuOpen && (
      <View style={styles.menuContainer}>
          <MenuItem icon="home-outline" label="Home" onPress={() => go("/")} /> 
          <MenuItem icon="person-circle-outline" label="Account" onPress={() => go("/account")} />
          <MenuItem icon="sparkles-outline" label="AI Assistant" onPress={() => go("/ai")} />
          <MenuItem icon="document-text-outline" label="Documents" onPress={() => go("/docs")} />
          <MenuItem icon="help-circle-outline" label="Help" onPress={() => go("/help")} />
      </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Bottom navigation - Wrapped in a separate SafeAreaView */}
      <SafeAreaView style={styles.bottomNavContainer}> 
        <View style={styles.bottomNav}>
          <NavItem route="/" icon="home-outline" label="Home" active={isActive("/")} scaleAnim={scaleAnim} />
          <NavItem route="/ai" icon="sparkles-outline" label="AI" active={isActive("/ai")} scaleAnim={scaleAnim} />
          <NavItem route="/docs" icon="document-text-outline" label="Docs" active={isActive("/docs")} scaleAnim={scaleAnim} />
          <NavItem route="/account" icon="person-circle-outline" label="Account" active={isActive("/account")} scaleAnim={scaleAnim} />
        </View>
      </SafeAreaView>
    </View>
  );
}

// --- NAV ITEM COMPONENT ---
function NavItem({ route, icon, label, active, scaleAnim }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
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
      if (!active) {
          router.push(route);
      }
    });
  };

  return (
    <TouchableOpacity
      onPressIn={pressIn}
      onPressOut={pressOut}
      activeOpacity={0.8}
      style={styles.navItem}
    >
      <Animated.View style={{ transform: [{ scale: active ? scaleAnim : scale }] }}>
        <Ionicons
          name={icon}
          size={28}
          color={active ? ACCENT_COLOR : SUBTITLE_COLOR}
        />
      </Animated.View>

      <Text style={[styles.navText, active && styles.activeNavText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}


// --- MENU ITEM COMPONENT ---
function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Ionicons name={icon} size={20} color={ACCENT_COLOR} />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  rootContainer: { 
    flex: 1, 
    // Setting this background color is only useful if the content itself has transparent areas.
    // However, the headerBackground handles the primary color bleed.
    backgroundColor: SECONDARY_BG, 
  },

  headerBackground: {
    backgroundColor: HEADER_COLOR,
    // Subtle shadow cast down from the header
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
  
  headerContentWrapper: {
    // This wrapper replaces the old styles.header and provides internal padding/layout
    paddingHorizontal: 20,
    paddingTop: 8, // Reduced padding since SafeAreaView handles the top inset
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: { 
    color: PRIMARY_BG, // White text on dark header
    fontSize: 22, 
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  headerSubtitle: { 
    color: SUBTITLE_COLOR, // Light gray subtitle on dark header
    fontSize: 13, 
    opacity: 0.9, 
    marginTop: 4,
    fontWeight: '500'
  },

  iconsRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  headerButton: {
    marginLeft: 15,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle button background
  },

  overlay: {
    position: "absolute",
    top: 0, // Overlay spans the whole viewport
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 8,
  },

  menuContainer: {
    position: "absolute",
    right: 18,
    // Position menu to appear just below the header bar, relative to the viewport top
    top: Platform.OS === 'ios' ? 100 : 70, 
    backgroundColor: PRIMARY_BG,
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    elevation: 10,
    zIndex: 20,
    shadowColor: TEXT_COLOR, 
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  menuText: {
    fontSize: 16,
    color: TEXT_COLOR,
    fontWeight: "600",
  },

  // Content starts immediately below the fixed header
  content: { 
    flex: 1, 
    padding: 16, 
    marginBottom: 80, 
    backgroundColor: SECONDARY_BG, // Light background for the content area
  }, 

  // Bottom Nav Container (Wrapper for SafeArea)
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: PRIMARY_BG, 
    elevation: 8, 
    zIndex: 10,
    borderTopWidth: 1,
    borderColor: BORDER_COLOR,
  },

  // The actual navigation bar styling
  bottomNav: {
    height: 75, 
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: { 
    alignItems: "center",
    padding: 8,
    minWidth: 70, 
  },
  navText: { 
    fontSize: 12, 
    marginTop: 4, 
    color: SUBTITLE_COLOR, 
    fontWeight: "600" 
  },
  activeNavText: { 
    color: ACCENT_COLOR, 
    fontWeight: "800" 
  },
});

