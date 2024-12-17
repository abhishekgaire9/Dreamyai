from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from groq import Groq
import databutton as db

router = APIRouter()

class DreamAnalysisRequest(BaseModel):
    dream_description: str

class DreamAnalysisResponse(BaseModel):
    psychological_analysis: str
    vedic_interpretation: str
    sentiment: str  # 'positive', 'negative', or 'neutral'

SYSTEM_PROMPT = """You are a dream analysis expert with deep knowledge of both modern psychology and ancient Vedic wisdom. 
Analyze dreams with both perspectives, providing clear and insightful interpretations.

Keep all interpretations concise, limited to 3-4 sentences maximum.

For psychological analysis:
- Focus on key symbolic meanings and core emotions
- Highlight the most significant psychological insight
- Be clear and direct

For Vedic analysis:
- Focus on the most relevant spiritual significance
- Highlight key traditional interpretations
- Keep it simple and actionable

For sentiment analysis:
- Determine if the dream is primarily positive, negative, or neutral
- Consider both emotional content and symbolic implications

Provide concise, clear interpretations that are respectful and insightful."""

def get_analysis(dream: str, perspective: str) -> str | tuple[str, str]:
    """Get dream analysis for a specific perspective. Returns tuple of (analysis, sentiment) for psychological perspective."""
    client = Groq(api_key=db.secrets.get("GROQ_API_KEY"))
    try:
        completion = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze this dream from a {perspective} perspective{' and determine its sentiment (positive/negative/neutral)' if perspective == 'psychological' else ''}: {dream}"}
            ]
        )
        response = completion.choices[0].message.content
        
        if perspective == 'psychological':
            # Split response into analysis and sentiment
            parts = response.split('\nSentiment:')
            analysis = parts[0].strip()
            sentiment = parts[1].strip() if len(parts) > 1 else 'neutral'
            return analysis, sentiment
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze dream: {str(e)}")

@router.post("/analyze-dream")
def analyze_dream(request: DreamAnalysisRequest) -> DreamAnalysisResponse:
    if not db.secrets.get("GROQ_API_KEY"):
        return DreamAnalysisResponse(
            psychological_analysis="Please configure Groq API key to receive dream analysis.",
            vedic_interpretation="Please configure Groq API key to receive dream analysis."
        )
    
    try:
        psychological, sentiment = get_analysis(request.dream_description, "psychological")
        vedic = get_analysis(request.dream_description, "Vedic")
        
        return DreamAnalysisResponse(
            psychological_analysis=psychological,
            vedic_interpretation=vedic,
            sentiment=sentiment
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))