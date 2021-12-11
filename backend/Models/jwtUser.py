from pydantic import BaseModel


class JWTUser(BaseModel):
    """The pydantic BaseModel of JWT user.

    user_name is the user_name,
    """
    user_name: str
