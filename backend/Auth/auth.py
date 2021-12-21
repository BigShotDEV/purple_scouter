import time
from typing import Optional
from fastapi.exceptions import HTTPException
from fastapi import Cookie
from fastapi.param_functions import Depends
# from fastapi.security.oauth2 import OAuth2PasswordBearer
from starlette import status
from Models.user import User

from Auth.jwtAuth import JWT
from Auth.Oauth2Bearer import OAuth2BearerCustom
from mongodb_api import MongoDB


mongodb = MongoDB()

oauth2_scheme = OAuth2BearerCustom(tokenUrl="token")

def decode_user_token(token):
    """Decodes a user token into a user model.

    Args:
        token (str): The jwt(Java Web Token).

    Returns:
        bool: true if the token is valid and false otherwise.
    """
    jwt = JWT(mongodb)

    return jwt.validate_user_jwt(token)

def decode_admin_token(token):
    """Decodes and validates an admin token.

    Args:
        token (str): token

    Returns:
        bool: true if the token is valid and false otherwise.
    """
    jwt = JWT(mongodb)
    return jwt.validate_admin_jwt(token)

def generate_jwt_token(user: User):
    """Generates new jwt token.

    Args:
        user (User): A user to generate the token to.

    Returns:
        str: The jwt token.
    """
    return JWT.encode(user)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)):
    """Gets the current user using a token.

    Args:
        token (str, optional): The jwt token.. Defaults to Depends(oauth2_scheme).

    Raises:
        HTTPException: Invalid authentication, in case the creds are wrong.

    Returns:
        User: The User from the token.
    """
    user = decode_user_token(token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if time.time() - user.ts >= 60*60*24: # each token is valid for 1 day
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Token exparied",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    """Gets the current admin using a token.

    Args:
        token (str, optional): The jwt token.. Defaults to Depends(oauth2_scheme).

    Raises:
        HTTPException: Invalid authentication, in case the creds are wrong.

    Returns:
        User: The User from the token.
    """

    user = decode_admin_token(token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if time.time() - user.ts >= 60*60*24: # each token is valid for 1 day
        raise HTTPException(
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
            detail="Token exparied",
            location="/login",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user
