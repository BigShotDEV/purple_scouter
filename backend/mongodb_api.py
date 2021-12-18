import pymongo
from pymongo.errors import ConnectionFailure

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

    def __init__(self):
        """
            Connects to the server, at HOST and PORT.
        """
        self.client = self.connect() 
        # self.ping() # make sure that the server is up.

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
        if not self.db["users"].find({"user_name": user.user_name}, {"_id": 0}):
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

    def is_user_match(self, user: User):
        """Checks if the username matches in the db, doesn't check the password.

        Args:
            user (User): The User

        Returns:
            bool: true if it matches the db.
        """
        db_users = self.db["users"].find(user.dict())
        for db_user in db_users:
            if db_user and db_user['user_name'] == user.user_name:
                return True

        return False

    def validate_user(self, user: UserInDB):
        """Checks if user exists in the database.

        !Notice! An admin is considered to be an extended user (if the user match a admin but not a user true will be returned)


        Args:
            user (User): The User to check if exists.

        Returns:
            bool: true if the user exists.
        """

        db_users = self.db["users"].find(user.dict())
        for db_user in db_users:
            if db_user and db_user['password'] == user.password and db_user['user_name'] == user.user_name:
                return True

        if self.validate_admin(user):
            return True

        return False
        
    def is_admin_match(self, user: User):
        """Checks if the username matches in the db, doesn't check the password.

        Args:
            user (User): The User

        Returns:
            bool: true if it matches the db.
        """
        db_users = self.db["admin"].find(user.dict())
        for db_user in db_users:
            print(db_user)
            if db_user and db_user['user_name'] == user.user_name:
                return True

        return False


    def validate_admin(self, user: User):
        """Checks if admins exists in the database,
        
        Args:
            user (User): The user that should be check if he his an admin. 

        Returns:
            bool: True if the user is an admin.
        """
        db_users = self.db["admin"].find(user.dict())

        for db_user in db_users:
            if db_user and db_user['password'] == user.password and db_user['user_name'] == user.user_name:
                return True
       
        return False


