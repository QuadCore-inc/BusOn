import { map } from './localizacao.js'; // Importa o mapa inicializado no arquivo localizacao.js

// Ícone personalizado para paradas de ônibus
const busStopIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png', // URL do ícone de parada
    iconSize: [25, 25], // Tamanho do ícone
    iconAnchor: [12, 25], // Ponto onde o ícone é ancorado no mapa
    popupAnchor: [0, -25] // Posição onde o popup aparece em relação ao ícone
});

// Função para carregar as paradas de ônibus
async function carregarParadas() {
    const overpassUrl = 'https://overpass-api.de/api/interpreter'; // URL da Overpass API
    const query = `
        [out:json];
        node["highway"="bus_stop"](-1.4833, -48.5167, -1.1833, -48.3167); // Bounding Box específica
        out body;
    `;

    try {
        // Envia a consulta para a Overpass API
        const response = await fetch(overpassUrl, {
            method: 'POST', // Método POST para enviar a consulta
            body: query, // A consulta Overpass em texto
            headers: { 'Content-Type': 'text/plain' } // Define o tipo de conteúdo
        });

        // Converte a resposta para JSON
        const data = await response.json();

        // Itera sobre cada elemento retornado pela API
        data.elements.forEach(parada => {
            if (parada.lat && parada.lon) { // Verifica se as coordenadas estão disponíveis
                const nomeParada = parada.tags.name || 'Parada sem nome'; // Nome da parada (ou valor padrão)
                // Adiciona um marcador no mapa
                L.marker([parada.lat, parada.lon], { icon: busStopIcon })
                    .addTo(map) // Adiciona o marcador ao mapa
                    .bindPopup(`<b>${nomeParada}</b>`); // Exibe o nome da parada no popup
            }
        });
    } catch (error) {
        console.error('Erro ao carregar paradas de ônibus:', error); // Loga erros no console
    }
}

// Chama a função para carregar as paradas
carregarParadas();
