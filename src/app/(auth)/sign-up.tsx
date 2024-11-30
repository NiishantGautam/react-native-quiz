import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  // Clerk sign-up hooks and state management
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Component state
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Password visibility states
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);

  // Sign-up handler
  const onSignUpPress = async () => {
    // Validate inputs
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Additional password strength validation
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    // Ensure Clerk is loaded before proceeding
    if (!isLoaded) return;

    try {
      // Create user account
      await signUp.create({
        emailAddress,
        password,
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      // Log any sign-up errors for debugging
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Sign Up Error", err.message || "An error occurred during sign up");
    }
  };

  // Email verification handler
  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      // Attempt to verify email code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification is complete, set active session and navigate
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Alert.alert("Verification Error", "Could not complete verification");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Verification Error", err.message || "An error occurred during verification");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setIsPasswordVisible(!isPasswordVisible);
    } else {
      setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Section */}
        <View style={styles.headerContainer}>
          <Feather name="user-plus" color="#6366f1" size={50} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* Sign-up Form */}
        {!pendingVerification ? (
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Feather name="mail" color="#6366f1" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#a1a1aa"
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Feather name="lock" color="#6366f1" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#a1a1aa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility("password")}
                style={styles.eyeIcon}
              >
                <Feather name={isPasswordVisible ? "eye" : "eye-off"} color="#6366f1" size={20} />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Feather name="lock" color="#6366f1" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#a1a1aa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility("confirmPassword")}
                style={styles.eyeIcon}
              >
                <Feather
                  name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                  color="#6366f1"
                  size={20}
                />
              </TouchableOpacity>
            </View>

            {/* Sign-up Button */}
            <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Verification Code Section
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Feather name="check-circle" color="#6366f1" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                placeholderTextColor="#a1a1aa"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
              />
            </View>

            {/* Verify Button */}
            <TouchableOpacity style={styles.button} onPress={onPressVerify}>
              <Text style={styles.buttonText}>Verify Email</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#6366f1",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#f4f4f5",
    flex: 1,
  },
  eyeIcon: {
    marginRight: 15,
  },
  formContainer: {
    width: "100%",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  input: {
    color: "#18181b",
    flex: 1,
    fontSize: 16,
    height: 50,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 3,
    flexDirection: "row",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  subtitle: {
    color: "#71717a",
    fontSize: 16,
    marginTop: 5,
  },
  title: {
    color: "#18181b",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },
});
