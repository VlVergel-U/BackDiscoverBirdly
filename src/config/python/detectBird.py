import sys
from birdnetlib import Recording
from birdnetlib.analyzer import Analyzer
from datetime import datetime
import os

lat = float(sys.argv[1])
lon = float(sys.argv[2])
date_str = sys.argv[3]
file_path = sys.argv[4]

date = datetime.strptime(date_str, "%Y-%m-%d")

if not os.path.exists(file_path):
    print("El archivo no existe en la ruta proporcionada")
    sys.exit(1)
    
analyzer = Analyzer()

recording = Recording(
    analyzer,
    file_path,
    lat=lat,
    lon=lon,
    date=date,
    min_conf=0.1,
)

recording.analyze()

print(recording.detections)
