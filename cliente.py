import asyncio
import websockets 

async def hello(uri):
    async with websockets.connect(uri) as websocket:
        await websocket.send("316 - Pedreira UFPA")
        while True:
            greeting = await websocket.recv()
            print(f"Recebido: {greeting}")
            #await asyncio.sleep(2)

asyncio.run(hello('ws://localhost:8765'))