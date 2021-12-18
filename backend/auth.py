from fastapi.exceptions import HTTPException
from fastapi.param_functions import Depends
from fastapi.security.oauth2 import OAuth2PasswordBearer
from starlette import status
from Models.user import User

from jwtAuth import JWT
from mongodb_api import MongoDB


mongodb = MongoDB()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def decode_user_token(token):
    jwt = JWT(mongodb)
    return jwt.validate_user_jwt(token)

def decode_admin_token(token):
    jwt = JWT(mongodb)
    return jwt.validate_admin_jwt(token)

def generate_jwt_token(user: User):
    return JWT.encode(user)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = decode_user_token(token)
    print(user, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    user = decode_admin_token(token)
    print(user, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
