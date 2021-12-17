from typing import Optional

from fastapi import FastAPI, Response, status, Cookie

from mongodb_api import MongoDB
from jwtAuth import JWT
from Models.user import User
from Models.game import GameStats
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
mongodb = MongoDB()


origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stats/")
def read_stats(response: Response, jwt: Optional[bytes] = Cookie(None)):
    user = JWT.validate_admin_jwt(jwt)
    if not user:
        response.set_cookie(key="jwt", value=JWT.encode(user))
    return {"stats": "stats"}

@app.post("/login/", status_code=200)
def login(user: User, response: Response):
    if mongodb.is_user_match(user):
        response.set_cookie(key="jwt", value=JWT.encode(user))
        return "Loged in successfully"

    response.status_code = status.HTTP_406_NOT_ACCEPTABLE
    return "Unauthorized 401."

@app.post("/api/game/")
def insert_game(game: GameStats, response: Response, jwt: Optional[bytes] = Cookie(None)):
    user = JWT.validate_user_jwt(jwt)
    if not user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Unauthorized 401."

    mongodb.insert_game_stats(game)

@app.get("/api/teams/{team_number}/")
def get_team_stats(team_number: int, response: Response, jwt: Optional[bytes] = Cookie(None)):
    user = JWT.validate_admin_jwt(jwt)
    if not user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Unauthorized 401."

    return mongodb.get_team_stats(team_number)

@app.get("/api/games/{game_number}/")
def get_game(game_number: int, response: Response, jwt: Optional[bytes] = Cookie(None)):
    user = JWT.validate_admin_jwt(jwt)
    if not user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Unauthorized 401."

    return mongodb.get_game(game_number)


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie("jwt")

    return "Logged out"
    