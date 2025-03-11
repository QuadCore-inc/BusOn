import sqlite3
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
    coordenadas = [tuple(map(float, coord.split(',')[:2])) for coord in coordenadas_texto.split()]
    coordenadas_lista.extend(coordenadas)

# Conectar ao banco de dados SQLite (ou criar se não existir)
conn = sqlite3.connect('coordenadas.db')
cursor = conn.cursor()

# Criar tabela para armazenar as coordenadas
cursor.execute('''
CREATE TABLE IF NOT EXISTS coordenadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    longitude REAL,
    latitude REAL
)
''')

# Inserir coordenadas no banco de dados
cursor.executemany('INSERT INTO coordenadas (longitude, latitude) VALUES (?, ?)', coordenadas_lista)
conn.commit()

# Fechar a conexão com o banco de dados
conn.close()

print("Banco de dados criado e coordenadas inseridas com sucesso.")