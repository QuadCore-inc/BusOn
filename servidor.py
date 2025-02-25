import asyncio
import websockets
import json
import random

async def send_location(websocket): 
    while True:
        location_data = {
            "longitude": -48.5024 + random.uniform(-0.005, 0.005),
            "latitude": -1.45502 + random.uniform(-0.005, 0.005),
            "timestamp": asyncio.get_event_loop().time()
        }
        
        await websocket.send(json.dumps(location_data))
        print(f"Enviando localização: {location_data}")
        
        await asyncio.sleep(2)  

async def main():
    async with websockets.serve(send_location, "0.0.0.0", 8765):  
        print("Servidor WebSocket rodando em ws://0.0.0.0:8765")
        await asyncio.Future() 

asyncio.run(main())
