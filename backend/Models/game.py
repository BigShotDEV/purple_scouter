from pydantic import BaseModel


class GameStats(BaseModel):
    """The GameStats basemodel, represent a game.

    The Model Gets a game_number, team_number and stats.

    The stats is a list of dicts each dict represent other stat.
    """
    game_number: int
    team_number: int
    stats: list
