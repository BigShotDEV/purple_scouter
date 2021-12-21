from typing import Dict, Optional
from fastapi.openapi.models import OAuth2, OAuthFlows
from fastapi.exceptions import HTTPException
from fastapi.param_functions import Cookie
from fastapi.security.oauth2 import OAuth2PasswordBearer
from starlette.requests import Request
from starlette.status import HTTP_401_UNAUTHORIZED
from typing import Tuple


def get_authorization_scheme_param(authorization_header_value: str):
    if not authorization_header_value:
        return "", ""
    scheme, _, param = authorization_header_value.partition(" ")
    return scheme, param


class OAuth2BearerCustom(OAuth2PasswordBearer):
    """Inherits from teh real class, the only change made in this class is to add the option to use cookie.

    !NOTICE! The change I made is not secure it could led to account hijarking using xss, 
    if you have some time please add refresh token and then save them to the local storage.
    """
    async def __call__(self, request: Request, access_token: Optional[str] = Cookie(None)):
        print("Holy Monly Jesus Toasty")
        authorization: str = request.headers.get("Authorization")
        if not authorization:
            authorization: str = access_token

        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None

        return param