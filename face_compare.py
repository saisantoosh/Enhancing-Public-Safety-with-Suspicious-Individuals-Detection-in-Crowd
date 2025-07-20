import face_recognition
import json
import cv2
import uuid
import sqlite3
import datetime
import numpy as np

path = ''

def compareFaces(frame, camera_id):
    face_locations = face_recognition.face_locations(frame)
    if not face_locations:
        return None
    conn = sqlite3.connect(path + 'database.sqlite')
    c = conn.cursor()
    encodings = c.execute('SELECT id, encoding, name FROM criminals').fetchone()
    refer_encoding = []
    user_id = []
    user_name = []
    while encodings:
        refer_encoding.append(json.loads(encodings[1]))
        user_id.append(encodings[0])
        user_name.append(encodings[2])
        encodings = c.fetchone()
    if len(refer_encoding) == 0:
        c.close()
        conn.close()
        return 0, 0
    
    for top, right, bottom, left in face_locations:
        face_encoding = face_recognition.face_encodings(frame, [(top, right, bottom, left)])[0]
        face_distances = face_recognition.face_distance(refer_encoding, face_encoding)
        best_match_index = np.argmin(face_distances)
        if face_distances[best_match_index] < 0.6:  # Adjust threshold as needed
            file_name = str(uuid.uuid4()) + '.jpg'
            cv2.imwrite(path + 'static/' + file_name, frame)
            c.execute('INSERT INTO logs (criminal_id, camera_id, timestamp, image) VALUES (?, ?, ?, ?)',
                  (user_id[best_match_index], camera_id, datetime.datetime.now(), file_name))
            conn.commit()
            c.close()
            conn.close()
            return user_id[best_match_index], user_name[best_match_index]
    
    c.close()
    conn.close()
    return 0, 0

def getEncodings(image, name):
    conn = sqlite3.connect(path + 'database.sqlite')
    c = conn.cursor()
    file_name = str(uuid.uuid4()) + '.jpg'
    cv2.imwrite(path + 'static/' + file_name, image)
    faces = face_recognition.face_locations(image)
    if len(faces) == 0:
        return "No face detected in the image. Please try again.", 0
    if len(faces) > 1:
        return "Multiple faces detected in the image. Please try again.", 0
    face = faces[0]
    face_image = image[face[0]:face[2], face[3]:face[1]].copy()
    encoding = face_recognition.face_encodings(face_image)[0]
    c.execute('INSERT INTO criminals (encoding, name, image_path) VALUES (?, ?, ?)', (json.dumps(encoding.tolist()), name, file_name))
    id = c.lastrowid
    conn.commit()
    c.close()
    conn.close()
    return f"Face encoding for {name} saved successfully with id {id}", 1