export const map = L.map('map').setView([0, 0], 2); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252031.png', // Ícone do marcador
    iconSize: [25, 25], 
    iconAnchor: [12, 25], 
    popupAnchor: [0, -25] 
});

function mostrarLocalizacao(latitude, longitude) {
    map.setView([latitude, longitude], 15);
    L.marker([latitude, longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup('Você está aqui!')
        .openPopup();
}

function tratarErroLocalizacao(error) {
    console.error('Erro ao obter localização:', error.message);
    alert('Não foi possível obter sua localização. Por favor, ative o GPS e tente novamente.');
}

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            mostrarLocalizacao(latitude, longitude);
        },
        tratarErroLocalizacao,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0 
        }
    );
} else {
    alert('Seu navegador não suporta geolocalização.');
}
