from pydantic import BaseModel
from typing import Optional

class TextToSpeechRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None
    style: Optional[str] = None
