# entelectual-recognition
Facial recognition for Entelect employees.

## Facial Recognition Library
The following is the main library used by this application https://github.com/ageitgey/face_recognition. It has really good documentation so have a look to get an idea of how it works. 

## Data

The images are split up into 3 main folders corresponding to raw images, images at an intermediate level of processing, and the final processed images. Even though these folders do somewhat complicate things and introduces a lot of duplication, I feel it's necessary to maintain the separation so they're easier to work with each level of processing.

### Raw
The raw images correspond to where I found them. The _entelect-secondary_ is a little different though since they're from the _entelect_ folder but I separated them since it looked they were of that person taken at different points in time. I think the ultimate plan of these images was to combine them with the _slack_ images to use as a test set to obtain real metrics on the performance of the classifier. Otherwise the rest of the folders are self-explanatory as to where they're from.

### Interim
As you can guess from the name, the objective of this folder is store images at an intermediate level of processing. The folders in here should correspond to the folders in the _raw_ folder with possibly additional suffixes describing what's been done to the images.

If it says cropped, it means the images have been cropped to just have the face of the person. The code in _cropper.py_ was run on the _raw_ images to obtain these. The additional suffix _hog_ indicates this was the face detector used to automatically crop the image. This is much faster than the _cnn_ classifier (without a GPU that is) but isn't as accurate. For the images the HOG classifier missed, the CNN classifier was then run since it was more accurate but much slower. Even this classifer missed some images so _manual_ indicates images that I manually cropped with GIMP. 

The _slack_ folder again corresponds to the folder in _raw_ but this time it's split according to whether the image corresponds to that persons face or something else. There's also a _partially-obscured_ folder that I intended to use for testing to see if the face detector would still work in these extreme cases. 

### Processed
Here I just took all the cropped images I wanted from the interim folder and dumped them into the _cropped_ folder. The _encodings.py_ code was then run to obtain the _known_encodings.npy_  and _known_strings.npy_ files. The encoding file stores the face embeddings of each persons face while the strings file stores their names. The embeddings and names are in the same order so the first item in the embeddings file and the first item in the strings file corresponds to the same person. 

These two files are the files that are actually loaded in to the application then as the ground truth of who's who. See the _webcam.py_ file to see more details.

## Database
A SQL Server database is currently used to save the predictions. Create a database called _FacialRecognition_ with a user called _fruser_ with the super secure password _abc123_. Then run the scripts in the _database_ folder. 

SQL Alchemy is used as the ORM. In project, the _db.py_ file handles the db connections while the _models.py_ file stores the database models.