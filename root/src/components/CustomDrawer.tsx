import React, { useRef, useEffect } from "react";
import { Animated, View, Text, Button, StyleSheet, Dimensions, ScrollView } from "react-native";

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drawerHeight?: number; // Altura do drawer
  drawerWidth?: number;
  children?: React.ReactNode;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  isOpen,
  onClose,
  drawerHeight = Dimensions.get("window").height * 0.5, // 60% da altura da tela
  children,
}) => {
  const translateY = useRef(new Animated.Value(drawerHeight)).current;

  const openDrawer = () => {
    Animated.timing(translateY, {
      toValue: 0, // Move para dentro da tela
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateY, {
      toValue: drawerHeight, // Move para fora da tela
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Controla a animação com base no estado `isOpen`
  useEffect(() => {
    if (isOpen) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [isOpen]);

  return (
    <Animated.View
      style={[
        styles.drawer,
        { height: drawerHeight, transform: [{ translateY }] },
      ]}
    >
      <ScrollView 
        style={styles.drawerContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>
        {/* Botão para fechar o drawer */}
        {/* <Button title="Fechar" onPress={onClose} /> */}

        {/* Conteúdo do drawer */}
        {children}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000, // Garante que o drawer fique acima de outros componentes
  },
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flex: 1, // Faz com que ocupe todo o espaço disponível no drawer
  },
  scrollContent: {
    padding: 10, // Espaçamento interno
  },
});

export default CustomDrawer;