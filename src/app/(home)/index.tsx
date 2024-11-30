import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import * as React from "react";
import { StatusBar, Animated, Text, Image, View, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DATA } from "../../constant.ts";
import LearningDashboard from "./LearningDashboard.tsx";
// Screen dimensions
const { width, height } = Dimensions.get("screen");

// Background colors for animated transitions
const bgs = ["#1a3ebc", "#DDBEFE", "#12ccab", "#B98EFF"];

export default function Page() {
  // User authentication state
  const { user, isLoaded } = useUser();

  // Animated scroll value
  const scrollX = React.useRef(new Animated.Value(0)).current;

  // Input range for background color interpolation
  const inputRange = DATA.map((_, i) => i * width);
  const backgroundColor = scrollX.interpolate({
    inputRange,
    outputRange: bgs,
  });

  // Complex animation calculations
  const YOLO = Animated.modulo(
    Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)),
    1,
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <StatusBar hidden />

        {!isLoaded ? (
          <View style={styles.centeredContainer}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <>
            <SignedIn>
              <View style={styles.centeredContainer}>
                <LearningDashboard user={user} />
              </View>
            </SignedIn>

            <SignedOut>
              {/* Animated background */}
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  styles.animatedBackground,
                  { backgroundColor },
                ]}
              />

              {/* Animated background shape */}
              <Animated.View
                style={[
                  styles.animatedBackgroundShape,
                  {
                    transform: [
                      {
                        translateX: YOLO.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, -height, 0],
                        }),
                      },
                      {
                        rotate: YOLO.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: ["35deg", "-35deg", "35deg"],
                        }),
                      },
                    ],
                  },
                ]}
              />

              {/* Onboarding content list */}
              <GestureHandlerRootView>
                <Animated.FlatList
                  data={DATA}
                  scrollEventThrottle={32}
                  showsHorizontalScrollIndicator={false}
                  style={styles.animatedFlatList}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                  })}
                  keyExtractor={(item) => item.key}
                  pagingEnabled
                  horizontal
                  renderItem={({ item }) => (
                    <View style={styles.flatListItemContainer}>
                      <View style={styles.centeredContainer}>
                        <Image source={{ uri: item.image }} style={styles.onboardingImage} />
                      </View>
                      <View style={styles.onboardingTextContainer}>
                        <Text
                          style={styles.onboardingTitleText}
                          numberOfLines={2}
                          adjustsFontSizeToFit
                        >
                          {item.title}
                        </Text>
                        <Text style={styles.onboardingDescriptionText}>{item.description}</Text>
                      </View>
                    </View>
                  )}
                />
              </GestureHandlerRootView>

              {/* Bottom section with buttons and pagination */}
              <View style={styles.bottomSection}>
                {/* Authentication buttons */}
                <View style={styles.buttonContainer}>
                  <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Sign In</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/(auth)/sign-up" asChild>
                    <TouchableOpacity>
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                </View>

                {/* Pagination dots */}
                <View style={styles.paginationContainer}>
                  {DATA.map((_, i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.paginationDot,
                        {
                          opacity: scrollX.interpolate({
                            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                            outputRange: [0.6, 1, 0.6],
                            extrapolate: "clamp",
                          }),
                          transform: [
                            {
                              scale: scrollX.interpolate({
                                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                                outputRange: [1, 1.5, 1],
                                extrapolate: "clamp",
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </SignedOut>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

// Comprehensive StyleSheet
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },

  // Animated Background Styles
  animatedBackground: {
    // Absolute fill style inherited from StyleSheet.absoluteFillObject
  },
  animatedBackgroundShape: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 96,
    height: height * 0.65,
    left: -height * 0.1,
    position: "absolute",
    top: -height * 0.2,
    width: height * 0.65,
  },

  // Animated FlatList Styles
  animatedFlatList: {
    paddingBottom: height * 0.25,
  },
  flatListItemContainer: {
    height: "100%",
    justifyContent: "center",
    width,
  },

  // Onboarding Content Styles
  onboardingTextContainer: {
    padding: 20,
  },
  onboardingImage: {
    height: width / 2,
    resizeMode: "contain",
    width: width / 2,
  },
  onboardingTitleText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    paddingVertical: 10,
  },
  onboardingDescriptionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },

  // Button Styles
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 1,
    opacity: 0.9,
  },

  // Bottom Section Styles
  bottomSection: {
    bottom: 0,
    height: height * 0.25,
    justifyContent: "space-between",
    padding: 20,
    position: "absolute",
    width,
  },

  // Pagination Styles
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  paginationDot: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 10,
    margin: 8,
    width: 10,
  },
});
