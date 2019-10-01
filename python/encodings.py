import os
import face_recognition
import numpy as np

PATH = './data/processed/cropped/'

def get_file_names(path: str):
    file_names = os.listdir(path)
    return file_names

known_encodings = []
known_strings = []
file_names = get_file_names(PATH)
for file_name in file_names:
    image = face_recognition.load_image_file(PATH + file_name)
    encoding = face_recognition.face_encodings(image, known_face_locations=[(0, image.shape[1], image.shape[0], 0)])[0]
    known_encodings.append(encoding)
    known_strings.append(file_name.split('.')[0])

np.save('./data/processed/known_encodings', known_encodings)
np.save('./data/processed/known_strings', known_strings)

# image_to_test = face_recognition.load_image_file('./data/interim/slack/faces/amrit.purshotam.jpg')
# image_to_test_encoding = face_recognition.face_encodings(image_to_test)[0]

# face_distances = face_recognition.face_distance(known_encodings, image_to_test_encoding)
# min_index = np.argmin(face_distances)

# print(file_names[min_index])