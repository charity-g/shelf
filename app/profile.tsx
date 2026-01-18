import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";
import { ProfileData, Setting } from "../types/UserProfile";

import { InfoModal } from "../components/settings/InfoModal";
import { LinkModal } from "../components/settings/LinkModal";
import { SettingRow } from "../components/settings/SettingRow";
import { ToggleModal } from "../components/settings/ToggleModal";

// Placeholder API endpoint
const API_ENDPOINT = "https://api.example.com/profile";

// Mock API fetch function
async function fetchProfile(): Promise<ProfileData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Hardcoded profile data (pretending this comes from API)
  const mockProfileData: ProfileData = {
    user: {
      id: "user_001",
      name: "Bob Bob",
      email: "bob@gmail.com",
      avatarUrl: "https://api.example.com/avatars/user_001.jpg",
      skinType: "Combination",
      joinedDate: "2024-03-15",
    },
    settings: [
      { id: "s1", label: "Push Notifications", type: "toggle", value: true },
      {
        id: "s2",
        label: "Product Expiry Reminders",
        type: "toggle",
        value: true,
      },
      { id: "s3", label: "Skin Type", type: "info", value: "Combination" },
      { id: "s4", label: "Routine Reminders", type: "toggle", value: false },
      { id: "s5", label: "Privacy Settings", type: "link" },
      { id: "s6", label: "Help & Support", type: "link" },
    ],
  };

  // In real implementation, this would be:
  // const response = await fetch(API_ENDPOINT);
  // const data = await response.json();
  // return data;

  return mockProfileData;
}

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [activeSetting, setActiveSetting] = useState<Setting | null>(null);
  const [settingsState, setSettingsState] = useState<Setting[]>(settings);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await fetchProfile();
        setProfileData(data);
        setSettings(data.settings);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSaveSetting = (updatedValue: string) => {
    if (!activeSetting) return;

    // Update the settings array
    setSettings((prev) =>
      prev.map((s) =>
        s.id === activeSetting.id ? { ...s, value: updatedValue } : s,
      ),
    );

    // Close the modal
    setActiveSetting(null);
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !profileData) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Something went wrong"}
          </Text>
        </View>
      </Screen>
    );
  }

  function handleToggleChange(id: string, nextValue: boolean) {
    setSettingsState((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: nextValue } : s)),
    );
    setActiveSetting(null);
  }

  const { user } = profileData;

  return (
    <Screen>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Skin Type</Text>
          <Text style={styles.infoValue}>{user.skinType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>
            {new Date(user.joinedDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settingsState.map((setting) => (
          <SettingRow
            key={setting.id}
            setting={setting}
            onPress={() => setActiveSetting(setting)}
          />
        ))}

        <InfoModal
          visible={activeSetting?.type === "info"}
          label={activeSetting?.label ?? ""}
          value={String(activeSetting?.value ?? "")}
          onClose={() => setActiveSetting(null)}
        />

        <LinkModal
          visible={activeSetting?.type === "link"}
          title={activeSetting?.label ?? ""}
          onClose={() => setActiveSetting(null)}
        />

        <ToggleModal
          visible={activeSetting?.type === "toggle"}
          label={activeSetting?.label ?? ""}
          value={Boolean(activeSetting?.value)}
          onConfirm={(next) => handleToggleChange(activeSetting!.id, next)}
          onClose={() => setActiveSetting(null)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    ...typography.body,
    color: colors.muted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    ...typography.body,
    color: colors.accent,
  },
  headerCard: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.accent,
  },
  nameBlock: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.muted,
  },
  infoCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.subtle,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    ...typography.body,
    color: colors.muted,
  },
  infoValue: {
    ...typography.body,
    fontWeight: "500",
    color: colors.text,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    ...typography.sectionTitle,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.lavender,
  },
  settingDotToggle: {
    backgroundColor: colors.mint,
  },
  settingDotLink: {
    backgroundColor: colors.accentSoft,
  },
  settingLabel: {
    flex: 1,
    ...typography.body,
  },
  settingValue: {
    ...typography.body,
    color: colors.muted,
  },
  settingToggle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent,
  },
  settingArrow: {
    fontSize: 18,
    color: colors.muted,
  },
});
