from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def get_session():
    driver = 'SQL+Server'
    username = "fruser"
    password = "abc123"
    host = "(local)"
    database = "FacialRecognition"
    connection_string = "mssql+pyodbc://{0}:{1}@{2}/{3}?driver={4}".format(username, password, host, database, driver)
    engine = create_engine(connection_string)
    Session = sessionmaker(bind=engine)
    session = Session()
    return session

def get_by_id(entity, id, sess):
    return sess.query(entity).get(id)

def save_all(entities, sess):
    for entity in entities:
        sess.add(entity)
    sess.commit()