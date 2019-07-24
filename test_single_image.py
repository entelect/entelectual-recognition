import face_recognition
import numpy as np
import cv2

THRESHOLD = 0.55
RESIZE_FACTOR = 0.4

known_face_encodings = np.load('./data/processed/known_encodings.npy')
known_face_names = np.load('./data/processed/known_strings.npy')

image = face_recognition.load_image_file('./data/raw/rian/img_20190507_075117.jpg')
image = image[:, :, ::-1]

face_locations = face_recognition.face_locations(image)
face_encodings = face_recognition.face_encodings(image, face_locations)

face_names = []
distances = []
for encoding in face_encodings:
    face_distances = face_recognition.face_distance(known_face_encodings, encoding)
    min_index = np.argmin(face_distances)
    distance = face_distances[min_index]
    distances.append(distance)

    if (distance <= THRESHOLD):
        face_names.append(known_face_names[min_index])
    else:
        face_names.append('Unknown')

for face_name, distance in zip(face_names, distances):
    print('{}: {}'.format(face_name, distance))

image = cv2.resize(image, (0, 0), fx=RESIZE_FACTOR, fy=RESIZE_FACTOR)

for (top, right, bottom, left), name in zip(face_locations, face_names):
    top = int(np.floor(top * RESIZE_FACTOR))
    right = int(np.ceil(right * RESIZE_FACTOR))
    bottom = int(np.ceil(bottom * RESIZE_FACTOR))
    left = int(np.floor(left * RESIZE_FACTOR))

    cv2.rectangle(image, (left, top), (right, bottom), (0, 0, 255), 2)
    cv2.rectangle(image, (left, bottom), (right, bottom + 20), (0, 0, 255), cv2.FILLED)
    font = cv2.FONT_HERSHEY_DUPLEX
    cv2.putText(image, name, (left + 6, bottom + 15), font, 0.5, (255, 255, 255), 1)

cv2.imwrite('./test.jpg', image)