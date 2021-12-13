from typing import Optional

from fastapi import FastAPI, Response, status, Cookie

from mongodb_api import MongoDB
from jwtAuth import JWT
from Models.user import User
from Models.game import GameStats

app = FastAPI()
mongodb = MongoDB()


@app.get("/")
def read_root():
    return {"root": "root"}

@app.get("/login/")
def read_login():
    return {"login": "login"}

@app.post("/login/", status_code=200)
def login(user: User, response: Response):
    if mongodb.is_user_match(user):
        response.set_cookie(key="jwt", value=JWT.encode(user))
        return "Loged in successfully"

    response.status_code = status.HTTP_406_NOT_ACCEPTABLE
    return "Unauthorized 401."

@app.post("/api/game/")
def insert_game(game: GameStats, response: Response, jwt: Optional[bytes] = Cookie(None)):
    user = JWT.validate_jwt(jwt)
    if not user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Unauthorized 401."

    mongodb.insert_game_stats(game)

@app.get("/api/teams/{team_number}/")
def get_team_stats(team_number: int, response: Response, jwt: Optional[bytes] = Cookie(None)):
    user = JWT.validate_jwt(jwt)
    if not user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Unauthorized 401."

    return mongodb.get_team_stats(team_number)

@app.get("/api/games/{game_number}/")
def get_game(game_number: int, response: Response, jwt: Optional[bytes] = Cookie(None)):
    user = JWT.validate_jwt(jwt)
    if not user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Unauthorized 401."

    return mongodb.get_game(game_number)


@app.get("/logout")
def logout(response: Response):
    response.delete_cookie("jwt")

    return "Loged out"
    