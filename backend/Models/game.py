from typing import Dict, List
from pydantic import BaseModel


class GameStats(BaseModel):
    """The GameStats basemodel, represent a game.

    The Model Gets a game_number, team_number, user_name and stats.

    The user is the name of the user inserted the game.
    The stats is a list of dicts each dict represent other stat.
    """
    user_name: str #
    game_number: int
    team_number: int
    stats: Dict
