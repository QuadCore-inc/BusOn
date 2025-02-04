// Inicializa o mapa no elemento "mapa" e centraliza em um ponto inicial genérico
export const map = L.map('map').setView([0, 0], 2); // Centraliza inicialmente em [0, 0]

// Adiciona os tiles do OpenStreetMap ao mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Ícone personalizado para a localização do usuário
const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252031.png', // Ícone do marcador
    iconSize: [25, 25], // Tamanho do ícone
    iconAnchor: [12, 25], // Ponto de ancoragem
    popupAnchor: [0, -25] // Posição do popup
});

// Função para exibir a localização do usuário
function mostrarLocalizacao(latitude, longitude) {
    // Centraliza o mapa na localização do usuário
    map.setView([latitude, longitude], 15);

    // Adiciona marcador no mapa com a localização do usuário
    L.marker([latitude, longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup('Você está aqui!')
        .openPopup();
}

// Função para tratar erros de localização
function tratarErroLocalizacao(error) {
    console.error('Erro ao obter localização:', error.message);

    // Exibe mensagem de erro
    alert('Não foi possível obter sua localização. Por favor, ative o GPS e tente novamente.');
}

// Obtém a localização do usuário usando a API Geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            mostrarLocalizacao(latitude, longitude);
        },
        tratarErroLocalizacao,
        {
            enableHighAccuracy: true,
            timeout: 10000, // Tempo máximo para obter a localização
            maximumAge: 0 // Não usa localização em cache
        }
    );
} else {
    alert('Seu navegador não suporta geolocalização.');
}
