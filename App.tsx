import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme";
import { useState, useEffect, useCallback } from "react";
import Entypo from "@expo/vector-icons/Entypo";

import * as Font from "expo-font";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onRootLayoutView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading....</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onRootLayoutView}>
      <Text>Quiz Application 👋</Text>
      <Entypo name="rocket" size={30} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: theme.colorCerulean,
    flex: 1,
    justifyContent: "center",
  },

  loadingContainer: {
    backgroundColor: theme.colorWhite, // Optional: different background for loading state
  },
});
