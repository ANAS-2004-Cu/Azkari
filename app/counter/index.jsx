import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const MODES = {
  INFINITY: "infinity",
  MODE_100: "mode_100",
  MODE_33: "mode_33",
};

const STORAGE_KEY = "counter_history";

export default function Index() {
  const [currentMode, setCurrentMode] = useState(MODES.INFINITY);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [statisticsHistory, setStatisticsHistory] = useState([]);

  useEffect(() => {
    loadSavedData();
  }, []);

  useEffect(() => {
    saveData();
  }, [currentMode, count, rounds, statisticsHistory]);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        setStatisticsHistory(parsedData.history || []);

        setCurrentMode(parsedData.currentMode || MODES.INFINITY);
        setCount(parsedData.count || 0);
        setRounds(parsedData.rounds || 0);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  const saveData = async () => {
    try {
      const dataToSave = {
        history: statisticsHistory,
        currentMode: currentMode,
        count: count,
        rounds: rounds,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const changeMode = (mode) => {
    setCurrentMode(mode);
    setCount(0);
    setRounds(0);
  };

  const incrementCounter = () => {
    if (currentMode === MODES.INFINITY) {
      setCount((prevCount) => prevCount + 1);
    } else if (currentMode === MODES.MODE_100) {
      if (count >= 99) {
        setCount(0);
        setRounds((prevRounds) => prevRounds + 1);
      } else {
        setCount((prevCount) => prevCount + 1);
      }
    } else if (currentMode === MODES.MODE_33) {
      if (count >= 32) {
        setCount(0);
        setRounds((prevRounds) => prevRounds + 1);
      } else {
        setCount((prevCount) => prevCount + 1);
      }
    }
  };

  const resetCounter = async () => {
    try {
      if (count > 0 || rounds > 0) {
        let statisticText = "";
        if (currentMode === MODES.INFINITY) {
          statisticText = `لقد قمت ب ${count} تسبيحة`;
        } else {
          const totalTasbeehat =
            rounds * (currentMode === MODES.MODE_100 ? 100 : 33) + count;
          statisticText = `لقد قمت ب ${totalTasbeehat} تسبيحة, ${rounds} مجموعة`;
        }

        const newStatistic = [
          statisticText,
          new Date().toLocaleString("ar-EG"),
        ];

        const newHistory = [newStatistic, ...statisticsHistory];
        setStatisticsHistory(newHistory);
      }

      setCount(0);
      setRounds(0);
    } catch (error) {
      console.error("Error resetting counter:", error);
    }
  };

  const clearStatisticsHistory = () => {
    setStatisticsHistory([]);
  };

  const deleteHistoryItem = (index) => {
    const newHistory = statisticsHistory.filter((_, i) => i !== index);
    setStatisticsHistory(newHistory);
  };

  const SwipeableHistoryItem = ({ item, index }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        pan.x.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 120) {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            deleteHistoryItem(index);
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    });

    return (
      <Animated.View
        style={[
          styles.statisticItem,
          {
            transform: [{ translateX: pan.x }],
            opacity: opacity,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.statisticText}>{item[0]}</Text>
        <Text style={styles.statisticTime}>{item[1]}</Text>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={["#016A70", "#A2C579"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.5 }}
    >
      <View style={styles.chainContainer}>
        <View style={styles.chainLink}></View>
        <TouchableOpacity
          style={[
            styles.modeButton,
            styles.firstButton,
            currentMode === MODES.INFINITY && styles.activeMode,
          ]}
          onPress={() => changeMode(MODES.INFINITY)}
        >
          <Text style={[styles.modeButtonText, styles.firstButtonText]}>∞</Text>
        </TouchableOpacity>
        <View style={styles.chainLink}></View>
        <TouchableOpacity
          style={[
            styles.modeButton,
            styles.secondButton,
            currentMode === MODES.MODE_100 && styles.activeMode,
          ]}
          onPress={() => changeMode(MODES.MODE_100)}
        >
          <Text style={[styles.modeButtonText, styles.secondButtonText]}>
            100
          </Text>
        </TouchableOpacity>
        <View style={[styles.chainLink, styles.smallerLink]}></View>
        <TouchableOpacity
          style={[
            styles.modeButton,
            styles.thirdButton,
            currentMode === MODES.MODE_33 && styles.activeMode,
          ]}
          onPress={() => changeMode(MODES.MODE_33)}
        >
          <Text style={[styles.modeButtonText, styles.thirdButtonText]}>
            33
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.counterContainer}>
        <View style={styles.gaugeContainer}>
          <View style={styles.circlesContainer}>
            <TouchableOpacity
              style={styles.countCircleContainer}
              onPress={incrementCounter}
              activeOpacity={0.7}
            >
              {currentMode === MODES.INFINITY ? (
                <View style={styles.circleWrapper}>
                  <Svg width={250} height={250} style={styles.progressSvg}>
                    <Circle
                      cx="125"
                      cy="125"
                      r="115"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="15"
                      fill="rgba(255, 255, 255, 0.15)"
                    />
                    <Circle
                      cx="125"
                      cy="125"
                      r="115"
                      stroke="#FFFFFF"
                      strokeWidth="15"
                      fill="transparent"
                      strokeLinecap="round"
                    />
                  </Svg>
                  <LinearGradient
                    colors={[
                      "rgba(0, 90, 100, 0.7)",
                      "rgba(30, 120, 100, 0.4)",
                    ]}
                    style={styles.circleContentGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.circleContent}>
                      <Text style={styles.circleLabel}>تسبيحة</Text>
                      <Text style={styles.circleCount}>{count}</Text>
                      <Text style={styles.circleMax}>∞</Text>
                    </View>
                  </LinearGradient>
                </View>
              ) : currentMode === MODES.MODE_100 ? (
                <View style={styles.circleWrapper}>
                  <Svg width={250} height={250} style={styles.progressSvg}>
                    <Circle
                      cx="125"
                      cy="125"
                      r="115"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="15"
                      fill="rgba(255, 255, 255, 0.15)"
                    />
                    <Circle
                      cx="125"
                      cy="125"
                      r="115"
                      stroke="#FFFFFF"
                      strokeWidth="15"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 115}`}
                      strokeDashoffset={2 * Math.PI * 115 * (1 - count / 100)}
                      strokeLinecap="round"
                      transform="rotate(-90, 125, 125)"
                    />
                  </Svg>
                  <LinearGradient
                    colors={[
                      "rgba(0, 90, 100, 0.7)",
                      "rgba(30, 120, 100, 0.4)",
                    ]}
                    style={styles.circleContentGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.circleContent}>
                      <Text style={styles.circleLabel}>تسبيحة</Text>
                      <Text style={styles.circleCount}>{count}</Text>
                      <Text style={styles.circleMax}>/100</Text>
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View style={styles.circleWrapper}>
                  <Svg width={250} height={250} style={styles.progressSvg}>
                    <Circle
                      cx="125"
                      cy="125"
                      r="115"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="15"
                      fill="rgba(255, 255, 255, 0.15)"
                    />
                    <Circle
                      cx="125"
                      cy="125"
                      r="115"
                      stroke="#FFFFFF"
                      strokeWidth="15"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 115}`}
                      strokeDashoffset={2 * Math.PI * 115 * (1 - count / 33)}
                      strokeLinecap="round"
                      transform="rotate(-90, 125, 125)"
                    />
                  </Svg>
                  <LinearGradient
                    colors={[
                      "rgba(0, 90, 100, 0.7)",
                      "rgba(30, 120, 100, 0.4)",
                    ]}
                    style={styles.circleContentGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.circleContent}>
                      <Text style={styles.circleLabel}>تسبيحة</Text>
                      <Text style={styles.circleCount}>{count}</Text>
                      <Text style={styles.circleMax}>/33</Text>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </TouchableOpacity>

            {(currentMode === MODES.MODE_100 ||
              currentMode === MODES.MODE_33) && (
              <LinearGradient
                colors={["rgba(80, 120, 150, 0.8)", "rgba(30, 60, 90, 0.7)"]}
                style={styles.roundsCircle}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
              >
                <Text style={styles.roundsLabel}>مجموعة</Text>
                <Text style={styles.roundsCount}>{rounds}</Text>
              </LinearGradient>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetCounter}>
          <Text style={styles.resetButtonText}>إعادة الضبط</Text>
        </TouchableOpacity>

        {statisticsHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>سجل التسبيح</Text>
              <TouchableOpacity
                style={styles.clearHistoryButton}
                onPress={clearStatisticsHistory}
              >
                <Text style={styles.clearHistoryText}>مسح السجل</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.historyContainer}
              showsVerticalScrollIndicator={false}
            >
              {statisticsHistory.map((stat, index) => (
                <SwipeableHistoryItem key={index} item={stat} index={index} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 50,
    position: "relative",
  },
  chainContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    alignItems: "center",
    zIndex: 10,
  },
  chainLink: {
    width: 2,
    height: 15,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  smallerLink: {
    height: 12,
    width: 1.5,
  },
  modeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  firstButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  secondButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.8,
  },
  thirdButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  activeMode: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderColor: "white",
  },
  modeButtonText: {
    fontWeight: "bold",
    color: "#016A70",
  },
  firstButtonText: {
    fontSize: 22,
  },
  secondButtonText: {
    fontSize: 18,
  },
  thirdButtonText: {
    fontSize: 15,
  },
  counterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: 50,
  },
  gaugeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    width: "100%",
  },
  circlesContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  countCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleWrapper: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  progressSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  circleContentGradient: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  circleContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  circleLabel: {
    fontSize: 24,
    color: "white",
    fontWeight: "600",
  },
  circleCount: {
    fontSize: 70,
    fontWeight: "bold",
    color: "white",
  },
  circleMax: {
    fontSize: 28,
    color: "white",
    opacity: 0.9,
    fontWeight: "500",
  },
  roundsCircle: {
    position: "absolute",
    top: -10,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 5,
  },
  roundsLabel: {
    fontSize: 16,
    color: "white",
    marginBottom: 2,
    fontWeight: "600",
  },
  roundsCount: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
  },
  resetButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 20,
  },
  resetButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  historySection: {
    width: "90%",
    marginTop: 10,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    position: "relative",
  },
  historyTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    width: "100%",
    textAlign: "center",
    zIndex: 1,
  },
  clearHistoryButton: {
    backgroundColor: "rgba(255, 100, 100, 0.3)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    alignSelf: "flex-start",
    marginLeft: "auto",
    zIndex: 2,
  },
  clearHistoryText: {
    color: "white",
    fontSize: 14,
  },
  historyContainer: {
    maxHeight: 90,
    width: "100%",
  },
  statisticItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 5,
    marginBottom: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statisticText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  statisticTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "400",
  },
});
