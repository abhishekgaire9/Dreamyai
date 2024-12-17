from pydantic import BaseModel
from fastapi import APIRouter
import databutton as db
from datetime import datetime
import json

router = APIRouter()

class AnalyticsEvent(BaseModel):
    event_type: str
    properties: dict

def get_analytics_data():
    try:
        data = db.storage.json.get("dream_analytics")
    except:
        data = {
            "dream_submissions": 0,
            "total_characters": 0,
            "successful_analyses": 0,
            "failed_analyses": 0,
            "clear_actions": 0,
            "events": []
        }
    return data

def save_analytics_data(data):
    db.storage.json.put("dream_analytics", data)

@router.post("/track-event")
def track_event(event: AnalyticsEvent):
    data = get_analytics_data()
    
    # Add event to history
    event_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "type": event.event_type,
        **event.properties
    }
    data["events"].append(event_data)
    
    # Update metrics based on event type
    if event.event_type == "dream_submission":
        data["dream_submissions"] += 1
        data["total_characters"] += event.properties.get("character_count", 0)
    elif event.event_type == "analysis_success":
        data["successful_analyses"] += 1
    elif event.event_type == "analysis_failure":
        data["failed_analyses"] += 1
    elif event.event_type == "clear_action":
        data["clear_actions"] += 1
    
    save_analytics_data(data)
    return {"status": "success"}

@router.get("/metrics")
def get_metrics():
    data = get_analytics_data()
    return {
        "dream_submissions": data["dream_submissions"],
        "total_characters": data["total_characters"],
        "average_characters": data["total_characters"] / data["dream_submissions"] if data["dream_submissions"] > 0 else 0,
        "successful_analyses": data["successful_analyses"],
        "failed_analyses": data["failed_analyses"],
        "clear_actions": data["clear_actions"],
    }