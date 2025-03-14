import { useState } from "react";
import axios from "axios";

const API_HOST = '192.168.100.102';

interface LocationData {
  ssid: string;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: number;
}

export const useSendLocationToAPI = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const sendLocation = async (locationData: LocationData) => {
    if (sending) return; // Evita múltiplos envios simultâneos.

    setSending(true);
    setError(null);

    try {
      const response = await axios.post(`http://${API_HOST}:5000/localizacao`, locationData);
      console.log("Resposta da API:", response.data);
    } catch (err) {
      setError("Erro ao enviar a localização para a API.");
      console.error("Erro na requisição:", err);
    } finally {
      setSending(false);
    }
  };

  return { sendLocation, sending, error };
};
