import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

interface CustomDrawer2Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const CustomDrawer2: React.FC<CustomDrawer2Props> = ({ isOpen, children }) => {
  const sheetRef = useRef<BottomSheet>(null);

  // Define os tamanhos do drawer (fechado, meio aberto, totalmente aberto)
  const snapPoints = useMemo(() => ["20%", "50%", "85%"], []);

  // Quando abrir, expande para o meio
  const handleOpen = useCallback(() => {
    sheetRef.current?.snapToIndex(1); // Abre na metade da tela
  }, []);

  // Quando fechar, recolhe para a posição inicial
  const handleClose = useCallback(() => {
    sheetRef.current?.snapToIndex(0); // Fecha para a posição menor
  }, []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={isOpen ? 1 : 0} // Define posição inicial
      snapPoints={snapPoints}
      enablePanDownToClose={true} // Permite fechar arrastando para baixo
      backgroundStyle={styles.drawer}
    >
      <View style={styles.drawerContent}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>

        {children}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: "#FF5555",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomDrawer2;