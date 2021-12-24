import pymongo
from pymongo.errors import ConnectionFailure
import hashlib

from Models.form import Form
from Models.user import User
from Models.game import GameStats
from Models.jwtUser import UserInDB


class MongoDB:
    """The MongoDB client.
    You should only use this class to connect to the database,
    to improve performance create only one instance of the class.
    """

    HOST = "192.168.1.74"
    PORT = 27017

    DB_NAME = "purple_scouter"

    DEFAULT_ADMIN_USERNAME = "admin" # During the season replace this to be more secure.
    DEFAULT_ADMIN_PASSWORD = hashlib.md5(b"admin").hexdigest() # Dureing the season replace this to be more secure.

    def __init__(self, build_db=False):
        """
            Connects to the server, at HOST and PORT.
        """
        self.client = self.connect() 
        # self.ping() # make sure that the server is up.
        
        if build_db:
            self.create_db()
        else:
            self.db = self.client[self.DB_NAME]

        

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

    def register_user(self, user: UserInDB):
        """Registers a new user to the database.

        Args:
            user (User): A User BaseModel.

        Returns:
            bool: return true if the registeration was successfull otherwise false.
        """
        if not self.db["users"].find({"user_name": user.user_name}, {"_id": 0}):
            self.db["users"].insert_one(user.dict())
            return True
        else:
            return False

    def register_admin(self, admin: UserInDB):
        """Registers a new user to the database.

        Args:
            user (User): A User BaseModel.

        Returns:
            bool: return true if the registeration was successfull otherwise false.
        """
        if not self.db["admins"].find({"user_name": admin.user_name}, {"_id": 0}):
            self.db["admin"].insert_one(admin.dict())
            return True
        else:
            return False

    def insert_form(self, form: Form):
        """Inserts a form into the db.

        Args:
            form (Form): The form to insert.

        Returns:
            bool: returns true if the form was inserted successfully otherwise false.
        """
        if not list(self.db["forms"].find({"id": form.id}, {"_id": 0})):
            self.db["forms"].insert_one(form.dict())
            return True
        else:
            return False

    def get_form(self, id: str):
        """Finds a from by a id.

        Args:
            id (str): The form id.

        Returns:
            Form: The form that was found in the db.
        """
        form = self.db["forms"].find_one({"id": id}, {"_id": 0})
        return form
        

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
        return [result for result in self.db["games"].find({"game_number": game_number}, {"_id": 0})]


    def get_team_stats(self, team_number: int):
        """Retuns all the data about a team.

        Args:
            team_number (int): A team id.

        Returns:
            list: list of results.
        """
        try:
            return  [result for result in self.db["games"].find({"team_number": team_number}, {"_id": 0})] 
        except Exception as e:
            print(e)

    def get_user(self, user: User):
        """Gets a similar user from the db.

        Args:
            user (User): The User

        Returns:
            bool: true if it matches the db.
        """
        db_users = self.db["users"].find(user.dict(include={"user_name"}))
        for db_user in db_users:
            if db_user and db_user['user_name'] == user.user_name:
                return UserInDB(**db_user)

        return None

    def get_admin(self, admin: User):
        """Gets a similar admin from the db.

        Args:
            admin (User): [description]

        Returns:
            User: The user that found.
        """
        db_users = self.db["admins"].find(admin.dict(include={"user_name"}))
        for db_user in db_users:
            if db_user and db_user['user_name'] == admin.user_name:
                return UserInDB(**db_user)

        return None

    def create_db(self):
        """Creates a blank db suits for the app.
        !NOTICE! if the db already exists it will remove it and all of it data.
        """
        self.client.drop_database(self.DB_NAME)
        self.db = self.client[self.DB_NAME]
        
        self.db.admins.insert_one({"test": 'test'})
        self.db.admins.delete_one({"test": 'test'})

        self.db.users.insert_one({"test": 'test'})
        self.db.users.delete_one({"test": 'test'})

        self.db.forms.insert_one({"test": 'test'})
        self.db.forms.delete_one({"test": 'test'})

        self.db.games.insert_one({"test": 'test'})
        self.db.games.delete_one({"test": 'test'})
