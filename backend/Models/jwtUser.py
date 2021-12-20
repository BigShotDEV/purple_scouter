from pydantic import BaseModel


class UserInDB(BaseModel):
    """The pydantic BaseModel of JWT user.

    user_name is the user_name,
    """
    user_name: str
    password: str