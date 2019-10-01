from PIL import Image
import face_recognition
import os

RAW_PATH = './data/raw/entelect-website/'
PROCESSED_PATH = './data/interim/entelect-website-cropped-cnn/'

def get_file_names(path: str):
    file_names = os.listdir(path)
    return file_names

def get_file_names_static():
    return []

def load_image(path: str):
    return face_recognition.load_image_file(path)

def get_locations(image, model):
    return face_recognition.face_locations(image, number_of_times_to_upsample=0, model=model)

def crop_image(location):
    top, right, bottom, left = location
    face_image = image[top:bottom, left:right]
    pil_image = Image.fromarray(face_image)
    return pil_image

def save(image, path):
    image.save(path)

file_names = get_file_names(RAW_PATH)
for file_name in file_names:
    image = load_image(RAW_PATH + file_name)
    locations = get_locations(image, 'cnn')

    if len(locations) == 0:
        print('0 faces: ' + file_name)
        continue
    
    if len(locations) > 1:
        print(str(len(locations)) + ' faces: ' + file_name)

    i = 1
    for location in locations:
        cropped_image = crop_image(location)
        split = file_name.split('.')
        name = split[0]
        extension = split[1].lower()
        if i == 1:
            save(cropped_image, PROCESSED_PATH + name + '.' + extension)
        else:
            save(cropped_image, PROCESSED_PATH + name + str(i) + '.' + extension)
        i = i + 1