import pymongo
from pymongo import mongo_client
from pymongo.errors import ConnectionFailure


class MongoDB:
    HOST = "192.168.31.74"
    PORT = 27017

    def __init__(self):
        """
            Connects to the server, at HOST and PORT.
        """
        self.client = self.connect() 
        self.ping() # make sure that the server is up.


    def generate_url(self):
        """Formates the url in the mongodb://HOST:PORT/ format.

        Returns:
            String: Returns a formatted mongodb url.
        """
        return f"mongodb://{self.HOST}:{self.PORT}/"

    def connect(self):
        """Connectes to the mongodb server.

        Returns:
            MongoClient: The mongodb client instance.
        """
        return pymongo.MongoClient(self.generate_url())

    def ping(self):
        """Pings the mongodb server, used to check if the server is up.
        """
        try:
            # The ping command is cheap and does not require auth.
            self.client.db_name.command('ping')
        except ConnectionFailure:
            raise(Exception("The MongoDB Server isn't up!"))

    def find(db, query):
        pass
      


if __name__ == "__main__":
    client = MongoDB()
