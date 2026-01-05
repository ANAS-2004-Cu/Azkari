import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const downloadLinks = [
    {
      name: "Google Play",
      icon: "logo-google-playstore",
      url: "Google Play Link : ",
      color: "#01875f",
      type: "ionicon",
    },
    {
      name: "App Store",
      icon: "logo-apple-appstore",
      url: "App Store Link : ",
      color: "#000000",
      type: "ionicon",
    },
    {
      name: "App Gallery",
      icon: require("../../assets/images/huawei_icon.png"),
      url: "App Gallery Link : ",
      color: "#FF0000",
      type: "image",
    },
    {
      name: "Galaxy Store",
      icon: require("../../assets/images/galaxy_icon.png"),
      url: "Galaxy Store Link : ",
      color: "#6441A4",
      type: "image",
    },
    {
      name: "MediaFire",
      icon: require("../../assets/images/mediafire_icon.png"),
      url: "MediaFire Link : ",
      color: "#1299F3",
      type: "image",
    },
    {
      name: "Google Drive",
      icon: require("../../assets/images/drive_icon.png"),
      url: "Google Drive Link : ",
      color: "#4285F4",
      type: "image",
    },
  ];

  const openLink = async (url: string, name: string) => {
    if (url === "#") {
      Alert.alert("Coming Soon", `${name} link will be available soon`);
      return;
    }
    try {
      await Share.share({
        message: url,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `Cannot open ${name}`);
    }
  };

  const sendSuggestion = async () => {
    const whatsappUrl =
      "https://wa.me/201032672532/?text=Hello, I have a suggestion for Azkari app: ";
    try {
      await Linking.openURL(whatsappUrl);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Cannot open WhatsApp");
    }
  };

  return (
    <LinearGradient
      colors={["#016A70", "#A2C579"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.5 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.appIconContainer}>
            <Ionicons name="book" size={40} color="white" />
          </View>
          <Text style={styles.title}>Share Azkari App</Text>
          <Text style={styles.subtitle}>
            Help others discover the beauty of Islamic prayers
          </Text>
        </View>

        <View style={styles.downloadSection}>
          <Text style={styles.sectionTitle}>Download From</Text>
          <View style={styles.linksGrid}>
            {downloadLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.linkCard, { borderLeftColor: link.color }]}
                onPress={() => openLink(link.url, link.name)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  {link.type === "ionicon" ? (
                    <Ionicons name={link.icon} size={28} color={link.color} />
                  ) : (
                    <Image source={link.icon} style={styles.iconImage} />
                  )}
                </View>
                <Text style={styles.linkText}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <View style={styles.suggestionHeader}>
            <Ionicons name="bulb" size={24} color="white" />
            <Text style={styles.sectionTitle}>Have a Suggestion?</Text>
          </View>
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionDescription}>
              Your feedback helps us improve the app for everyone
            </Text>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={sendSuggestion}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={24} color="white" />
              <Text style={styles.whatsappText}>Send via WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            جزاكم الله خيراً • May Allah reward you
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
    ...Platform.select({
      web: {
        textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
      },
      ios: {
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
      android: {
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
    }),
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  downloadSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  linksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  linkCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    borderLeftWidth: 4,
    padding: 20,
    width: "48%",
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconImage: {
    width: 28,
    height: 28,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  suggestionCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  suggestionDescription: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  whatsappButton: {
    backgroundColor: "#25d366",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 3px rgba(0,0,0,0.2)",
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  whatsappText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  footer: {
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 80,
  },
  footerText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
});
