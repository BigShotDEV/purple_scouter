from typing import Dict, List
from pydantic import BaseModel


class Form(BaseModel):
    """The Form basemodel, represents a form.
    """
    id: str
    title: str
    properties: List[Dict[str, str]]