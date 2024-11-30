import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

export default function Page() {
  // Clerk authentication hook for sign-in functionality
  const { signIn, setActive, isLoaded } = useSignIn();
  // Router for navigation after successful authentication
  const router = useRouter();

  // State management for form inputs and UI interactions
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  // State for password visibility and loading
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized sign-in handler with comprehensive error handling
  const onSignInPress = React.useCallback(async () => {
    // Check if Clerk authentication is ready
    if (!isLoaded) return;

    // Basic input validation
    if (!emailAddress || !password) {
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    // Set loading state to prevent multiple submissions
    setIsLoading(true);

    try {
      // Attempt to create a sign-in session
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // Check if sign-in is complete
      if (signInAttempt.status === "complete") {
        // Activate the session and redirect to home
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // Handle incomplete sign-in
        Alert.alert("Sign In Failed", "Unable to sign in. Please try again.");
      }
    } catch (err: any) {
      // Extract and display specific error message
      const errorMessage = err.errors?.[0]?.message || "An unexpected error occurred";

      Alert.alert("Authentication Error", errorMessage);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  }, [isLoaded, emailAddress, password]);

  return (
    // Keyboard avoiding view to handle different device behaviors
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Page header */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          {/* Email Input Field */}
          <View style={styles.inputWrapper}>
            {/* Email icon with dynamic color */}
            <Feather
              name="mail"
              size={20}
              color={emailAddress ? "#007AFF" : "#8E8E93"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email Address"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
            />
          </View>

          {/* Password Input Field */}
          <View style={styles.inputWrapper}>
            {/* Lock icon with dynamic color */}
            <Feather
              name="lock"
              size={20}
              color={password ? "#007AFF" : "#8E8E93"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Password"
              placeholderTextColor="#8E8E93"
              // Toggle secure text entry based on visibility state
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />
            {/* Password visibility toggle */}
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.passwordVisibilityToggle}
            >
              <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={onSignInPress}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>{isLoading ? "Signing In..." : "Sign In"}</Text>
          </TouchableOpacity>

          {/* Sign Up Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Comprehensive stylesheet with detailed styling
const styles = StyleSheet.create({
  // Main container styling
  container: {
    backgroundColor: "#F2F2F7",
    flex: 1, // Soft background color
  },

  // Content positioning
  content: {
    flex: 1,
    justifyContent: "center", // Center content vertically
    paddingHorizontal: 25, // Side padding
  },

  // Title styling
  title: {
    color: "#000",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  // Subtitle styling
  subtitle: {
    fontSize: 18,
    color: "#8E8E93", // Subtle text color
    marginBottom: 30,
    textAlign: "center",
  },

  // Input container configuration
  inputContainer: {
    width: "100%",
  },

  // Input wrapper with shadow and styling
  inputWrapper: {
    flexDirection: "row", // Horizontal layout
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12, // Rounded corners
    marginBottom: 15,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Input icon positioning
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },

  // Text input styling
  input: {
    flex: 1, // Take remaining space
    height: 50,
    fontSize: 16,
    color: "#000",
  },

  // Password visibility toggle
  passwordVisibilityToggle: {
    marginRight: 10,
    padding: 10,
  },

  // Forgot password link positioning
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },

  // Forgot password text styling
  forgotPasswordText: {
    color: "#007AFF", // Accent color
    fontSize: 14,
  },

  // Sign in button styling
  signInButton: {
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    marginBottom: 20,
  },

  // Sign in button text
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  // Footer container
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  // Footer text styling
  footerText: {
    color: "#8E8E93",
    fontSize: 16,
  },

  // Sign up link styling
  signUpLink: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
