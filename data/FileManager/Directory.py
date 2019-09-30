import os


class Directory:
    def __init__(self):
        self.data_path = os.path.normpath(os.path.split(os.getcwd())[0])
        self.employee_images = os.path.join(self.data_path, 'EmployeeImages')

    def check_directory_exists(self, folder_path):
        folder_path = os.path.join(self.employee_images, folder_path).__str__()
        if os.path.isdir(folder_path):
            return True
        else:
            os.mkdir(folder_path)
            folder_name = folder_path.split('\\')[-1]
            folder_path = folder_path.replace(folder_name, '')
            print(f"Created folder '{folder_name}' along the following path '{folder_path}'")

            return False
