from glob import glob
from pathlib import Path
import os

from FileManager.Directory import Directory


class ImageProcessor:
    def __init__(self):
        self.image_folder = os.path.join(os.path.split(os.getcwd())[0], 'UploadedFinal')
        self.image_file_extensions = ['jpg', 'jpeg', 'png']

        self.two_worded_surname = ['van', 'le', 'de']
        self.three_worded_surname = ['van der']
        pass

    def retrieve_images(self, year, month):
        """
        Retrieves a collection of images stored in directories sorted by year and month

        :param year:
                The year the image was taken
        :param month:
                The month the image was taken

        :return: image_files
                A list of image names
        """
        image_files = []
        file_path = os.path.normpath(os.path.join(self.image_folder, str(year)))

        for extension in self.image_file_extensions:
            file_extension = os.path.normpath(os.path.join(f"*{str(month)}*", f"*.{extension}"))

            for filename in Path(file_path).glob(file_extension):
                image_files.append(filename)

        return image_files

    def process_image_name(self, image_path):
        """
        Process an image filename to retrieve the name of the person in the image:
            1. Split the name by spaces
            2. Remove the text that contains the file extension
            3. Join the first two words

        :param image_path:
                An image path

        :return: name:
                The name of the person in the image
        """
        name = image_path.name
        name = name.split(' ')

        for extension in self.image_file_extensions:
            name = [x.replace(f".{extension}", '') for x in name]

        index = 2
        if len(name) > 1:
            if ' '.join(name[1:3]) in self.three_worded_surname:
                index = 4

            elif name[1] in self.two_worded_surname:
                index = 3

        name = '-'.join(name[:index])
        return name


if __name__ == '__main__':
    image_processor = ImageProcessor()
    image_paths = image_processor.retrieve_images(2019, 'February')

    image_path_and_name = dict()
    for image in image_paths:
        person_name = image_processor.process_image_name(image)
        path = str(image.resolve())
        image_path_and_name[path] = person_name
        break

    directory = Directory()
    names = list(set(image_path_and_name.values()))

    for name in names:
        directory.check_directory_exists(name)
        # os.rename()

