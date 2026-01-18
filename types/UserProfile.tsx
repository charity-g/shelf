export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  skinType: string;
  joinedDate: string;
}

export interface Setting {
  id: string;
  label: string;
  type: "toggle" | "link" | "info";
  value?: string | boolean;
}

export interface ProfileData {
  user: UserProfile;
  settings: Setting[];
}
