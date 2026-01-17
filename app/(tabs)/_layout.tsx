import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="selina"
        options={{
          title: "Selina",
        }}
      />
      <Tabs.Screen
        name="charity"
        options={{
          title: "Charity",
        }}
      />
      <Tabs.Screen
        name="william"
        options={{
          title: "William",
        }}
      />
      <Tabs.Screen
        name="david"
        options={{
          title: "David",
        }}
      />
    </Tabs>
  );
}
