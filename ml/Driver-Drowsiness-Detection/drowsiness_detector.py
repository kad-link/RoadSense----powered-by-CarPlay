from ultralytics import YOLO
import cv2
import os
import time
import threading
import platform
from playsound import playsound 

BASE_WEIGHTS = 'yolov8n.pt'
CUSTOM_MODEL_PATH = 'runs/detect/train/weights/last.pt'

ALARM_PATH = 'beep.m4a'

def sound_alert():
    def play_alarm():
        try:
            playsound(ALARM_PATH)
        except Exception as e:
            print(f"⚠️ Could not play alarm: {e}")
    t = threading.Thread(target=play_alarm)
    t.daemon = True
    t.start()

def run_drowsiness_detection():
    load_path = CUSTOM_MODEL_PATH if os.path.exists(CUSTOM_MODEL_PATH) else BASE_WEIGHTS
    print(f"Loading YOLOv8 Drowsiness Detector from: {load_path}")
    model = YOLO(load_path)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("✅ Detector running. Press 'q' to quit.")

    alert_start_time = None
    alert_triggered = False

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Frame grab failed.")
            break

        results = model(frame, stream=True)
        detected_classes = []

        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                if conf > 0.4:
                    detected_classes.append(r.names[cls_id])
            annotated_frame = r.plot()

        print("Detected:", detected_classes)

        if any(state in detected_classes for state in ['asleep', 'drowsy']):
            if alert_start_time is None:
                alert_start_time = time.time()
            else:
                elapsed = time.time() - alert_start_time
                if elapsed >= 2 and not alert_triggered:
                    print("⚠️ ALERT: Driver drowsy/asleep for over 2 seconds!")
                    sound_alert()
                    alert_triggered = True
        else:
            alert_start_time = None
            alert_triggered = False

        if 'alert' in detected_classes:
            alert_start_time = None
            alert_triggered = False

        cv2.imshow("YOLOv8 Drowsiness Detector", annotated_frame)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_drowsiness_detection()
