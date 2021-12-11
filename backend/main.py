from typing import Optional

from fastapi import FastAPI

from mongodb_api import MongoDB
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

@app.post("/login/")
def login(user: User):
    if mongodb.is_user_match(user):
        return True
    return False 

@app.post("/api/game/")
def login(game: GameStats):
    mongodb.insert_game_stats(game)

@app.get("/api/teams/{team_number}/")
def get_team_stats(team_number: int):
    return mongodb.get_team_stats(team_number)

@app.get("/api/games/{game_number}/")
def get_game(game_number: int):
    return mongodb.get_game(game_number)