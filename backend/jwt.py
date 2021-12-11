import jwt

from Models.user import User

class JWT:
    ALGORITHM = "HS256"
    SECRET = "UaFCEf0AGjvpcVnjIVo6xQGZbaC0xeiM2hLPPtFCxeg0TtyE8yHOgcLwMc6W871"

    def encode(self, user: User):
        """Encodes User to jwt.

        Args:
            user User: The user to encode to jwt.

        Returns:
            str: jwt. 
        """
        return jwt.encode(user.dict(), self.SECRET, self.ALGORITHM)

    def decode(self, token):
        """Decode a jwt.

        Args:
            token str: JWt.

        Returns:
            dict: decoded jwt.
        """
        return jwt.decode(token, self.SECRET, self.ALGORITHM)