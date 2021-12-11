import jwt

from Models.user import User
from Models.jwtUser import JWTUser

class JWT:
    ALGORITHM = "HS256"
    SECRET = "UaFCEf0AGjvpcVnjIVo6xQGZbaC0xeiM2hLPPtFCxeg0TtyE8yHOgcLwMc6W871"

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

    @staticmethod
    def validate_jwt(jwt):
        try:
            return JWTUser(JWT.decode(jwt))
        except Exception as e:
            return None