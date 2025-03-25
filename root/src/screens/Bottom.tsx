import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView, BottomSheetHandleProps } from '@gorhom/bottom-sheet';

// Componente customizado para o Handle (área de arrasto)
const CustomHandle = ({ animatedPosition, animatedIndex }: BottomSheetHandleProps) => {
  return (
    <View style={styles.handleContainer}>
      <View style={styles.handleIndicator} />
    </View>
  );
};

export const CustomDrawerBottomSheet = ({ isOpen, onClose, children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points: mínimo 20%, máximo 50%
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Bottom Sheet position index:', index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 1 : 0} // Inicia no estado fechado (20%) ou aberto (50%)
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false} // Impede que o usuário feche completamente com gesto de arrasto
      handleComponent={CustomHandle} // Define uma área específica para arrastar
      backgroundStyle={styles.bottomSheetBackground}
      style={styles.bottomSheetContainer}
      enableContentPanningGesture={false} // Impede que a rolagem no conteúdo afete o tamanho do Bottom Sheet
    >
      {/* Conteúdo do Bottom Sheet com Scroll independente */}
      {children}
    </BottomSheet>
  );
};

const BottomTest = props => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
        <CustomDrawerBottomSheet
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            >
            {props.children}
        </CustomDrawerBottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  openButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  bottomSheetContainer: {
    zIndex: 10, // Garante que o sheet fique acima de outros elementos (como bottom tabs)
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 20,
  },
  handleContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#CCC',
    borderRadius: 2,
    marginBottom: 5,
  },
  handleText: {
    color: '#333',
    fontSize: 12,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 2,
    textAlign: 'center',
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#CCC',
    marginBottom: 10,
  },
});

export default BottomTest;
