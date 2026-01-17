import { StyleSheet } from "react-native";

export const colors = {
  background: "#f5f5f5",
  surface: "#fff",
  text: "#111",
  muted: "#666",
  line: "#d7d7d7",
  subtle: "#f2f2f2",
  shadow: "rgba(17, 17, 17, 0.12)",
};

export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  surface: {
    width: "92%",
    maxWidth: 360,
    aspectRatio: 9 / 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
});

export const typography = StyleSheet.create({
  titleCaps: {
    fontSize: 14,
    letterSpacing: 1,
    color: colors.text,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.text,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 12,
    color: colors.text,
  },
});
