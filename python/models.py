from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime
import datetime

Base = declarative_base()

class Prediction(Base):
    __tablename__ = 'Predictions'

    id = Column('PredictionId', Integer, primary_key=True)
    name = Column('Name', String(500))
    distance = Column('Distance', Float(precision=16))
    image_id = Column('ImageId', String(100))
    timestamp = Column('Timestamp', DateTime)

    def __init__(self, name, distance, image_id):
        self.name = name
        self.distance = distance
        self.image_id = image_id
        self.timestamp = datetime.datetime.utcnow()