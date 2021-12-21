import jwt

from Models.user import User
from Models.jwtUser import UserInDB
from mongodb_api import MongoDB

class JWT:
    ALGORITHM = "HS256"
    SECRET = "a6787d860bcb0fd8d97c61c922aa07c089847ce7067df983c9499d7368fd7c04"

    def __init__(self, mongodb: MongoDB):
        self.mongodb = mongodb

    @staticmethod
    def encode(user: User):
        """Encodes User to jwt.

        Args:
            user User: The user to encode to jwt.

        Returns:
            str: jwt. 
        """
        return jwt.encode({"user_name": user.user_name, "ts": user.ts}, JWT.SECRET, JWT.ALGORITHM)

    @staticmethod
    def decode(token):
        """Decode a jwt.

        Args:
            token str: JWt.

        Returns:
            dict: decoded jwt.
        """
        return jwt.decode(token, JWT.SECRET, JWT.ALGORITHM)

    def validate_user_jwt(self, jwt):
        """Validates a user jwt in the db.

        Args:
            jwt (str): the jwt.

        Returns:
            bool: The valid user
        """
        try:
            user = User(**JWT.decode(jwt))
            db_user = self.mongodb.get_user(user) if not self.mongodb.get_user(user) == None else self.mongodb.get_admin(user)

            if db_user.user_name == user.user_name:
                return user
            else:
                return None
        except Exception as e:
            return None

    def validate_admin_jwt(self, jwt):
        """Validates an admin jwt in the db.

        Args:
            jwt (str): the jwt token.

        Returns:
            User: The valid admin.
        """

        try:
            user = User(**JWT.decode(jwt))
            db_user = self.mongodb.get_admin(user)
            if db_user.user_name == user.user_name:
                return user
            else:
                return None
        except Exception as e:
            print(e)
            return None