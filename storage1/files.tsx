// import AsyncStorage from "@react-native-async-storage/async-storage";

// const KEY = "uploaded_files";

// export async function saveFileRecord(file: any) {
//   let existing = await AsyncStorage.getItem(KEY);
//   let list = existing ? JSON.parse(existing) : [];

//   list.unshift(file); // newest at the top

//   await AsyncStorage.setItem(KEY, JSON.stringify(list));
// }

// export async function getFileRecords() {
//   let existing = await AsyncStorage.getItem(KEY);
//   return existing ? JSON.parse(existing) : [];
// }