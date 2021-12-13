import jwt

from Models.user import User
from Models.jwtUser import JWTUser
from mongodb_api import MongoDB

class JWT:
    ALGORITHM = "HS256"
    SECRET = "UaFCEf0AGjvpcVnjIVo6xQGZbaC0xeiM2hLPPtFCxeg0TtyE8yHOgcLwMc6W871"

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
        return jwt.encode({"user_name": user.user_name}, JWT.SECRET, JWT.ALGORITHM)

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
        try:
            user = JWTUser(JWT.decode(jwt))
            if self.mongodb.is_user_match(user):
                return user
            else:
                return None
        except Exception as e:
            return None

    def validate_admin_jwt(self, jwt):
        try:
            user = JWTUser(JWT.decode(jwt))
            if self.mongodb.is_admin_match(user):
                return user
            else:
                return None
        except Exception as e:
            return None