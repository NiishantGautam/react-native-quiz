import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Color palette for consistent theming
const COLORS = {
  BACKGROUND_DARK: "#1e1e1e",
  CARD_BACKGROUND: "#2a2a2a",
  TEXT_PRIMARY: "#ffffff",
  TEXT_SECONDARY: "#888888",
  PRACTICE_CARD: "#f4a261",
  REVIEW_CARD: "#2a9d8f",
  BADGE_BACKGROUND: "#e76f51",
  CHAPTER_BACKGROUND: "#3a3a3a",
};

// Get screen dimensions for full-screen layout
const { width, height } = Dimensions.get("window");

const LearningDashboard = ({ user }) => {
  const weekDays = ["Fr", "Sa", "Su", "Mo", "Tu", "We", "Th"];
  const chapters = [
    "Intro to TypeScript",
    "The any type",
    "TypeScript ESLint",
    "Primitive types",
    "Union types",
    "The type alias",
    "Arrays",
    "Tuples",
    "Literal types",
    "Functions",
    "Modules",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image source={require("../../../assets/icon.png")} style={styles.avatar} />
            <View>
              <Text style={styles.greeting}>Happy learning,</Text>
              <Text style={styles.username}>{user?.primaryEmailAddress?.emailAddress || 'User'}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.menuButton}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Tracking Section */}
        <View style={styles.streakCard}>
          <View style={styles.streakCount}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.streakNumber}>0</Text>
            <Text style={styles.streakText}>day streak</Text>
          </View>
          <Text style={styles.today}>Today: 1/10</Text>
          <View style={styles.weekDays}>
            {weekDays.map((day) => (
              <View key={day} style={styles.dayCircle}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Practice Flashcards Card */}
        <TouchableOpacity style={[styles.actionCard, styles.practiceCard]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>🎴</Text>
            <View>
              <Text style={styles.cardTitle}>Practice flashcards</Text>
              <Text style={styles.cardDescription}>
                Answer questions based on the topics you are learning in the course.
              </Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>103</Text>
          </View>
        </TouchableOpacity>

        {/* Review Flashcards Card */}
        <TouchableOpacity style={[styles.actionCard, styles.reviewCard]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>🔄</Text>
            <View>
              <Text style={styles.cardTitle}>Review flashcards</Text>
              <Text style={styles.cardDescription}>
                Refresh your memory by answering questions you've previously tackled.
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Chapters Exploration Section */}
        <View style={styles.chaptersSection}>
          <Text style={styles.sectionTitle}>📚 Explore chapters</Text>
          <View style={styles.chaptersGrid}>
            {chapters.map((chapter, index) => (
              <TouchableOpacity key={index} style={styles.chapterPill}>
                <Text style={styles.chapterText}>{`${index + 1}. ${chapter}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container Styles
  container: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    flex: 1,
    height: height,
    width: width,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    // Ensures content is padded and can scroll fully
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Extra padding at bottom for scrolling
  },

  // Header Styles
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  greeting: {
    color: COLORS.TEXT_SECONDARY,
  },
  username: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuButton: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 24,
  },

  // Streak Card Styles
  streakCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
  },
  streakCount: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  fireEmoji: {
    fontSize: 24,
  },
  streakNumber: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 24,
    fontWeight: "bold",
  },
  streakText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 24,
  },
  today: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: "right",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  dayCircle: {
    alignItems: "center",
    borderColor: "#444",
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  dayText: {
    color: COLORS.TEXT_PRIMARY,
  },

  // Action Card Styles
  actionCard: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 20,
  },
  practiceCard: {
    backgroundColor: COLORS.PRACTICE_CARD,
  },
  reviewCard: {
    backgroundColor: COLORS.REVIEW_CARD,
  },
  cardContent: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDescription: {
    color: COLORS.TEXT_PRIMARY,
    opacity: 0.7,
  },
  badge: {
    backgroundColor: COLORS.BADGE_BACKGROUND,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "bold",
  },

  // Chapters Section Styles
  chaptersSection: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  chaptersGrid: {
    gap: 10,
  },
  chapterPill: {
    backgroundColor: COLORS.CHAPTER_BACKGROUND,
    borderRadius: 20,
    padding: 12,
  },
  chapterText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
  },
});

export default LearningDashboard;
