import { map } from './localizacao.js';

const busStopIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
});

async function carregarParadas() {
    const query = `[out:json];node["highway"="bus_stop"](-1.4833, -48.5167, -1.1833, -48.3167);out body;`;
    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            headers: { 'Content-Type': 'text/plain' }
        });
        const data = await response.json();
        data.elements.forEach(parada => {
            if (parada.lat && parada.lon) {
                L.marker([parada.lat, parada.lon], { icon: busStopIcon })
                    .addTo(map)
                    .bindPopup(`<b>${parada.tags.name || 'Parada sem nome'}</b>`);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar paradas de ônibus:', error);
    }
}
carregarParadas();