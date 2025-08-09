import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <LinearGradient
      colors={['#016A70', '#A2C579']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.5 }}
    >
      <Text style={styles.text}>AZKAR</Text>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 50,
    color: 'black',
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  }
});