from flask import Flask, Response, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask import request
import cv2
import numpy as np
from ultralytics import YOLO
import base64
import time
import os
from threading import Lock

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Model paths
BASE_WEIGHTS = 'yolov8n.pt'
CUSTOM_MODEL_PATH = 'runs/detect/train/weights/last.pt'

# Load model
load_path = CUSTOM_MODEL_PATH if os.path.exists(CUSTOM_MODEL_PATH) else BASE_WEIGHTS
print(f"Loading YOLOv8 Drowsiness Detector from: {load_path}")
model = YOLO(load_path)

# Store alert state for each client
alert_states = {}
state_lock = Lock()

@app.route('/')
def index():
    return jsonify({
        'status': 'running',
        'message': 'Drowsiness Detection Server is active',
        'model': load_path
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

@socketio.on('connect')
def handle_connect():
    client_id = request.sid
    print(f'✅ Client connected: {client_id}')
    
    with state_lock:
        alert_states[client_id] = {
            'alert_start_time': None,
            'alert_triggered': False
        }
    
    emit('status', {
        'message': 'Connected to drowsiness detection server',
        'model': load_path
    })

@socketio.on('disconnect')
def handle_disconnect():
    client_id = request.sid
    print(f'❌ Client disconnected: {client_id}')
    
    with state_lock:
        if client_id in alert_states:
            del alert_states[client_id]

@socketio.on('frame')
def handle_frame(data):
    client_id = request.sid
    
    try:
        # Decode base64 image from frontend
        img_data = data['image'].split(',')[1]
        img_bytes = base64.b64decode(img_data)
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            emit('error', {'message': 'Invalid frame received'})
            return
        
        # Run YOLOv8 inference
        results = model(frame, stream=True, verbose=False)
        detected_classes = []
        annotated_frame = frame.copy()
        
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                if conf > 0.4:
                    class_name = r.names[cls_id]
                    detected_classes.append(class_name)
            
            # Get annotated frame with bounding boxes
            annotated_frame = r.plot()
        
        # Check for drowsiness/asleep state
        alert_status = False
        alert_duration = 0
        
        with state_lock:
            if client_id not in alert_states:
                alert_states[client_id] = {
                    'alert_start_time': None,
                    'alert_triggered': False
                }
            
            client_state = alert_states[client_id]
            
            if any(state in detected_classes for state in ['asleep', 'drowsy']):
                if client_state['alert_start_time'] is None:
                    client_state['alert_start_time'] = time.time()
                else:
                    elapsed = time.time() - client_state['alert_start_time']
                    alert_duration = elapsed
                    if elapsed >= 2:
                        alert_status = True
                        if not client_state['alert_triggered']:
                            client_state['alert_triggered'] = True
                            print(f"⚠️ ALERT: Client {client_id} - Driver drowsy/asleep for over 2 seconds!")
            else:
                client_state['alert_start_time'] = None
                client_state['alert_triggered'] = False
        
        # Encode annotated frame back to base64
        _, buffer = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        annotated_b64 = base64.b64encode(buffer).decode('utf-8')
        
        # Send results back to client
        emit('detection_result', {
            'image': f'data:image/jpeg;base64,{annotated_b64}',
            'detected_classes': detected_classes,
            'alert': alert_status,
            'alert_duration': round(alert_duration, 1),
            'timestamp': time.time()
        })
        
    except Exception as e:
        print(f"❌ Error processing frame: {e}")
        emit('error', {'message': str(e)})

@socketio.on('ping')
def handle_ping():
    emit('pong', {'timestamp': time.time()})

if __name__ == '__main__':
    print("="*50)
    print("🚀 Starting Drowsiness Detection Server")
    print(f"📦 Model: {load_path}")
    print("🌐 Server: http://0.0.0.0:8800")
    print("="*50)
    socketio.run(app, host='0.0.0.0', port=8800, debug=False)