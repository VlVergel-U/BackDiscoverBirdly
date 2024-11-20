import sys
import os
import json
from datetime import datetime
from birdnetlib import Recording
from birdnetlib.analyzer import Analyzer
import contextlib

@contextlib.contextmanager
def suppress_output():
    with open(os.devnull, 'w') as fnull:
        original_stdout = sys.stdout
        original_stderr = sys.stderr
        try:
            sys.stdout = fnull
            sys.stderr = fnull
            yield
        finally:
            sys.stdout = original_stdout
            sys.stderr = original_stderr

try:
    lat = float(sys.argv[1])
    lon = float(sys.argv[2])
    date_str = sys.argv[3]
    file_path = sys.argv[4]

    date = datetime.strptime(date_str, "%Y-%m-%d")

    if not os.path.exists(file_path):
        raise FileNotFoundError("El archivo no existe en la ruta proporcionada")

    with suppress_output():
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

    print(json.dumps(recording.detections if recording.detections else {"error": "No detecciones encontradas"}))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
