import asyncio
import websockets
import json
import xml.etree.ElementTree as ET

# Caminho do arquivo KML
arquivo_kml = "rota.kml"

# Carregar e processar o arquivo KML
tree = ET.parse(arquivo_kml)
root = tree.getroot()
namespace = {'kml': 'http://www.opengis.net/kml/2.2'}

coordenadas_lista = []

# Extrair coordenadas do KML
for linestring in root.findall(".//{http://www.opengis.net/kml/2.2}LineString/{http://www.opengis.net/kml/2.2}coordinates"):
    coordenadas_texto = linestring.text.strip()
    coordenadas = [tuple(map(float, coord.split(','))) for coord in coordenadas_texto.split()]
    coordenadas_lista.extend(coordenadas)

async def send_location(websocket):
    while True:
        for coord in coordenadas_lista:
            location_data = {
                "longitude": coord[0],
                "latitude": coord[1]
            }
            
            await websocket.send(json.dumps(location_data))
            print(f"Enviando localização: {location_data}")
            
            await asyncio.sleep(0.3)  # Enviar uma nova coordenada a cada 2 segundos

async def main():
    async with websockets.serve(send_location, "0.0.0.0", 8765):  
        print("Servidor WebSocket rodando em ws://0.0.0.0:8765")
        await asyncio.Future()  # Mantém o servidor rodando

asyncio.run(main())