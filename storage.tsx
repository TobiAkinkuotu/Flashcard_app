import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveKey(key: string, value: string) {
  try {
    if (Platform.OS === "web") {
      return await AsyncStorage.setItem(key, value);
    }
    return await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.log("Failed to save key:", e);
    throw e;
  }
}

export async function getKey(key: string) {
  try {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.log("Failed to load key:", e);
    return null;
  }
}
