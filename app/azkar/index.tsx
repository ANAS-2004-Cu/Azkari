import React, { useState } from "react";
import { Text, TouchableOpacity, ScrollView, StyleSheet, View, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { azkarData } from "../azkarData";

export default function AzkarScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAzkar, setSelectedAzkar] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");

  const items = [
    { title: "أذكار الصباح", type: "sabah", color: "#fcb552ff", icon: <Ionicons name="sunny" size={30} color="white" /> },
    { title: "أذكار المساء", type: "masaa", color: "#6b084fff", icon: <Ionicons name="moon" size={30} color="white" /> },
    { title: "أذكار المسجد (ما بعد الصلاة)", type: "masjid", color: "#5DADE2", icon: <FontAwesome5 name="mosque" size={28} color="white" /> },
    { title: "أذكار الصلاة", type: "salah", color: "#e2e05dff", icon: <FontAwesome5 name="pray" size={30} color="white" /> },
    { title: "أذكار الأستيقاظ", type: "wakeup", color: "#68e25dff", icon: <Ionicons name="alarm-outline" size={30} color="white" /> },
    { title: "أذكار النوم", type: "sleep", color: "#e25ddbff", icon: <Ionicons name="bed-outline" size={30} color="white" /> },
  ];

  const openAzkar = (type: string, title: string) => {
    setSelectedAzkar(azkarData[type] || []);
    setSelectedTitle(title);
    setModalVisible(true);
  };

  return (
    <LinearGradient
      colors={["#016A70", "#A2C579"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.5 }}
    >
      <Text style={styles.header}>الأذكار</Text>

      <ScrollView style={{ flex: 1, width: "100%" }} contentContainerStyle={{ padding: 16 }}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: item.color }]}
            onPress={() => openAzkar(item.type, item.title)}
          >
            <View style={styles.row}>
              {item.icon}
              <Text style={styles.text}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

     
      <Modal visible={modalVisible} animationType="slide">
        <LinearGradient
          colors={["#016A70", "#A2C579"]}
          style={{ flex: 1 }}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedTitle}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {selectedAzkar.map((zekr, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.azkarText}>{zekr}</Text>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: {
    marginTop: 20,
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  azkarText: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: "right",
    fontWeight: "bold",
    color: "#fff",
    writingDirection: "rtl",
  },
});
