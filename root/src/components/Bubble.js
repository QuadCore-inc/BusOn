import { ReactNode } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    bottom: 16,
    justifyContent: "center",
    left: 48,
    minHeight: 60,
    paddingVertical: 16,
    position: "absolute",
    right: 48,
  },
});

export function Bubble({ children, style, onPress }) {
  return (
    <View style={[styles.container, style]}>
      {onPress ? (
        <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
      ) : (
        children
      )}
    </View>
  );
}
