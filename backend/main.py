from typing import Optional

from fastapi import FastAPI, Response, status, Cookie, HTTPException
from fastapi.param_functions import Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

from mongodb_api import MongoDB

from Models.user import User
from Models.game import GameStats
from Models.jwtUser import UserInDB
from auth import *
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
mongodb = MongoDB()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not mongodb.validate_user(UserInDB(user_name=form_data.username, password=form_data.password)):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": generate_jwt_token(User(user_name=form_data.username)), "token_type": "bearer"}

@app.get("/")
def reed_root(current_user: User = Depends(get_current_user)):
    return {"whoami": current_user}

@app.get("/stats/")
def read_stats(current_user: User = Depends(get_current_admin)):
    return {"stats": "stats"}

@app.post("/api/game/")
def insert_game(game: GameStats, response: Response, current_user: User = Depends(get_current_user)):
    mongodb.insert_game_stats(game)

@app.get("/api/teams/{team_number}/")
def get_team_stats(team_number: int, response: Response, current_user: User = Depends(get_current_user)):
    return mongodb.get_team_stats(team_number)

@app.get("/api/games/{game_number}/")
def get_game(game_number: int, response: Response, current_user: User = Depends(get_current_user)):
    return mongodb.get_game(game_number)


# @app.post("/logout")
# def logout(response: Response):
#     response.delete_cookie("jwt")

#     return "Logged out"
    