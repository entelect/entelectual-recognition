from pathlib import Path
import os

from FileManager.Directory import Directory

"""
    The following script retrieves a collection of images from a directory/folder. The image file names 
    are stored with the name of the person in the image. The script identifies the relevant name, creates 
    a directory/folder with that name and moves the original image to this directory/folder.
"""


class ImageProcessor:
    def __init__(self):
        self.image_folder = os.path.join(os.path.split(os.getcwd())[0], 'UploadedFinal')
        self.employee_images = os.path.join(os.path.split(os.getcwd())[0], 'EmployeeImages')
        self.image_file_extensions = ['jpg', 'jpeg', 'png']

        self.two_worded_surname = ['van', 'le', 'de', 'du']
        self.three_worded_surname = ['van der', 'de la']
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

    def define_new_image_path(self, name, original_image_path):
        """
        Define the new image path, where the image will move to.

        :param name:
                The name of the person in the image
        :param original_image_path:
                The original path where the image is stored

        :return: type - pathlib.Path
                The new image path
        """
        new_image_path = Path(self.employee_images) / name
        image_name = Path(original_image_path).name

        return new_image_path / image_name


if __name__ == '__main__':
    """
        Images are retrieved from 'UploadedFinal' and stored in 'EmployeeImages'
            UploadedFinal - images are sorted by the year and month they were created.
            EmployeeImages - images are sorted by employee name
        
        The only values that require changing is the image year and image month.
    """
    image_processor = ImageProcessor()
    image_year = 2019
    image_month = 'January'
    image_paths = image_processor.retrieve_images(image_year, image_month)

    image_path_and_name = dict()
    for image in image_paths:
        person_name = image_processor.process_image_name(image)
        path = str(image.resolve())

        paths = image_path_and_name.get(person_name)
        if paths:
            paths.append(path)
        else:
            paths = [path]

        image_path_and_name[person_name] = paths

    directory = Directory()

    for item in image_path_and_name.items():
        person_name = item[0]
        paths = item[1]

        directory.check_directory_exists(person_name)
        for path in paths:
            new_path = image_processor.define_new_image_path(person_name, path)
            os.rename(path, new_path)
            print(f"{Path(path).name} moved to {new_path.parent}")
