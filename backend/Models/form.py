from typing import Dict, List, Optional
from pydantic import BaseModel


class Form(BaseModel):
    """The Form basemodel, represents a form.
    """
    id: Optional[int]
    title: str
    properties: List[Dict]