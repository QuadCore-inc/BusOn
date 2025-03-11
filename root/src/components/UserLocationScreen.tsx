// UserLocationScreen.tsx
import React from 'react';
import { BackgroundLocationProvider } from '../contexts/UserLocationContextBackup';
import BackgroundLocation from './BackgroundLocationBackup';

export default function UserLocationScreen() {
  return (
    <BackgroundLocationProvider>
      <BackgroundLocation />
    </BackgroundLocationProvider>
  );
}