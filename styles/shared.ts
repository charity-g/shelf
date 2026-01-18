import { StyleSheet } from "react-native";

export const colors = {
  background: "#fff1f6",
  surface: "#ffffff",
  text: "#5a3d5c",
  muted: "#8a6e8c",
  line: "#f3c2d9",
  subtle: "#ffe6f1",
  accent: "#ff9ec9",
  accentSoft: "#ffd1e6",
  lavender: "#e6d8ff",
  mint: "#dff7f1",
  shadow: "rgba(90, 61, 92, 0.18)",
};

export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 4,
    paddingBottom: 30,
  },
  surface: {
    flex: 1,
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});

export const typography = StyleSheet.create({
  titleCaps: {
    fontSize: 15,
    letterSpacing: 1.2,
    color: colors.text,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  body: {
    fontSize: 12,
    color: colors.text,
  },
});
