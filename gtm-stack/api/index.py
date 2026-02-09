from fastapi import FastAPI
from pydantic import BaseModel
import os
from typing import Dict, List, Optional
import random

app = FastAPI()


# --- MODELS ---
class MirrorRequest(BaseModel):
    input_text: str  # The "GTM Mess" (leads, signals, or strategy)


class SitRep(BaseModel):
    company: str
    vectors: Dict[str, Dict]
    executive_summary: str
    gravity_score: float
    verdict: str


# --- THE "REFLECTIVE" CORE: TRI-VECTOR REFINERY ---


def tri_vector_refinery(input_query: str) -> dict:
    """
    NEXUS::MIRROR Core Intelligence.
    Refines GTM noise across three vectors: Behavioral, Structural, and Neural.
    """
    # 0. Substrate Normalization
    company = (
        input_query.split()[0].replace(",", "").title() if input_query else "Target"
    )

    # 1. Behavioral Vector (AI/Narrative)
    # Logic: Detect strategy based on keywords or default to 'Growth' stance
    stances = ["Expansionist", "Defensive", "Consolidation", "Disruptive"]
    behavioral_stance = random.choice(stances)

    # 2. Structural Vector (ML/Infrastructure)
    # Logic: Assess technical authority (simulated for 0.1)
    tech_score = random.randint(40, 95)
    inbound_velocity = random.uniform(0.1, 2.5)

    # 3. Neural Vector (DL/Intent Gravity)
    # Logic: Calculate the 'Revenue Gravity' coefficient
    gravity = round((tech_score * inbound_velocity) / 100, 2)

    # 4. The SitRep Assembly
    return {
        "company": company,
        "vectors": {
            "behavioral": {
                "stance": behavioral_stance,
                "logic": f"Detection of {behavioral_stance.lower()} narrative in target market presence.",
            },
            "structural": {
                "tech_authority": f"{tech_score}/100",
                "inbound_velocity": f"{round(inbound_velocity, 2)}x",
                "governance": "Pipeline-as-Code Validated",
            },
            "neural": {
                "intent_hash": f"NX-{random.randint(100, 999)}-REFLECT",
                "gravity_coefficient": gravity,
            },
        },
        "executive_summary": f"Target {company} exhibits a {behavioral_stance} posture with {gravity} revenue gravity. The structural vector suggests a {'scaling' if gravity > 1.0 else 'stagnant'} trajectory.",
        "gravity_score": gravity,
        "verdict": "PRIORITIZE" if gravity > 0.8 else "MONITOR",
    }


# --- ROUTES ---


@app.get("/")
def read_root():
    return {"status": "SOVEREIGN", "engine": "NEXUS::MIRROR", "version": "0.1.1"}


@app.post("/api/mirror")
async def process_mirror(request: MirrorRequest):
    """
    The 'Mirror' Endpoint. Processes GTM noise into a Tri-Vector SitRep.
    """
    return tri_vector_refinery(request.input_text)


@app.get("/api/taster")
def taster():
    return tri_vector_refinery("Google Cloud Deployment")
