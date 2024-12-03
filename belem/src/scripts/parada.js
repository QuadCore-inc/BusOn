import { map } from './localizacao.js'; // Importa o mapa inicializado

// Ícone personalizado para paradas de ônibus
const busStopIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
});

// Função para carregar paradas de ônibus
async function carregarParadas() {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
        [out:json];
        area["name"="Belém"];
        node["highway"="bus_stop"](area);
        out body;
    `;

    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            headers: { 'Content-Type': 'text/plain' }
        });
        const data = await response.json();

        // Adiciona marcadores no mapa para cada parada de ônibus
        data.elements.forEach(parada => {
            if (parada.lat && parada.lon) {
                const nomeParada = parada.tags.name || 'Parada sem nome';
                L.marker([parada.lat, parada.lon], { icon: busStopIcon })
                    .addTo(map)
                    .bindPopup(`<b>${nomeParada}</b>`);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar paradas de ônibus:', error);
    }
}

// Chama a função para carregar as paradas
carregarParadas();
