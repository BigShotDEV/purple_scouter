import pymongo
from pymongo import mongo_client
from pymongo.errors import ConnectionFailure
from Models.user import User
from Models.game import GameStats
import random


class MongoDB:
    """The MongoDB client.
    You should only use this class to connect to the database,
    to improve performance create only one instance of the class.
    """

    HOST = "192.168.1.74"
    PORT = 27017

    def __init__(self):
        """
            Connects to the server, at HOST and PORT.
        """
        self.client = self.connect() 
        self.ping() # make sure that the server is up.

        self.db = self.client["purple_scouter"]


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

    def register_user(self, user: User):
        """Registers a new user to the database.

        Args:
            user (User): A User BaseModel.

        Returns:
            bool: return true if the registeration was successfull otherwise false.
        """
        if not self.is_user_match(user):
            self.db["users"].insert_one(user.dict())
            return True
        else:
            return False

    def insert_game_stats(self, game_stat: GameStats):
        """Insert new game stats to the db.

        Args:
            game_stat (GameStats): The stats.
        """
        self.db["games"].insert_one(game_stat.dict())


    def get_game(self, game_number: int):
        """Retuns all the data about a game by a game_number.

        Args:
            game_number (int): A game id.

        Returns:
            list: list of results.
        """
        return [result for result in self.db["games"].find({"game_number": game_number})]


    def get_team_stats(self, team_number: int):
        """Retuns all the data about a team.

        Args:
            team_number (int): A team id.

        Returns:
            list: list of results.
        """
        return  [result for result in self.db["games"].find({"team_number": team_number})] 

    def is_user_match(self, user: User):
        """Checks if user exists in the database.

        Args:
            user (User): The User to check if exists.

        Returns:
            bool: true if the user exists.
        """
        return len([result for result in self.db["users"].find(user.dict())]) == 1

    