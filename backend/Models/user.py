from pydantic import BaseModel


class User(BaseModel):
    """The pydantic BaseModel of User.

    user_name is the user_name,
    password is the password (md5_hashed).
    """
    user_name: str
    ts: int
