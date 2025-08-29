import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { azkarData } from "../azkarData";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function AzkarDetails() {
  const { type, color, title } = useLocalSearchParams<{ type: string; color?: string; title?: string }>();
  const router = useRouter();

  const azkar = azkarData[type || ""] || [];

  return (
    <LinearGradient
      colors={["#016A70", "#A2C579"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.5 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{title}</Text>
        <View style={{ width: 50 }} /> 
      </View>

      <ScrollView
  style={{ width: "100%", maxHeight: "83%" }} 
  contentContainerStyle={{ padding: 16 }}
>
  {azkar.map((zekr, i) => (
    <View
      key={i}
      style={[
        styles.card,
        { backgroundColor: color || "#fff" },
      ]}
    >
      <Text style={styles.text}>{zekr}</Text>
    </View>
  ))}
</ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 15, 
    marginBottom: 20,
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "right", 
    fontWeight: "bold",
    color: "#fff",
    writingDirection: "rtl",
  },
});
