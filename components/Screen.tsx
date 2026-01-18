import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { layout } from "../styles/shared";

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, style, containerStyle }: ScreenProps) {
  return (
    <View style={[layout.screen, containerStyle]}>
      <View style={[layout.surface, style]}>{children}</View>
    </View>
  );
}

export default Screen;