# === Standard and Third-Party Imports ===
import os
from openai import OpenAI
from dotenv import load_dotenv

# === Load environment variables from .env file ===
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # Initialize OpenAI client using API key

# === Archetype Classification Based on Trait Ratings ===
def determine_archetype(ratings):
    """
    Determine the player's archetype based on specific combinations of trait ratings.
    Returns a string label such as '3&D Wing', 'Playmaking Guard', etc.
    """
    if ratings.get("Shooting", 0) >= 7 and ratings.get("Perimeter Defense", 0) >= 7 and ratings.get("Motor", 0) >= 7:
        return "3&D Wing"
    if ratings.get("Playmaking", 0) >= 8 and ratings.get("Ball Handling", 0) >= 7 and ratings.get("Shooting", 0) >= 6:
        return "Playmaking Guard"
    if ratings.get("Finishing", 0) >= 8 and ratings.get("Athleticism", 0) >= 8 and ratings.get("Ball Handling", 0) >= 6:
        return "Athletic Slasher"
    if ratings.get("Post Defense", 0) >= 8 and ratings.get("Rebounding", 0) >= 8 and ratings.get("Finishing", 0) >= 7:
        return "Post Specialist"
    if (ratings.get("Help Defense", 0) >= 7 and ratings.get("IQ", 0) >= 7
            and ratings.get("Finishing", 0) >= 7 and ratings.get("Motor", 0) >= 7):
        return "Two-Way Forward"
    if (ratings.get("Post Defense", 0) >= 8 and ratings.get("Help Defense", 0) >= 8
            and ratings.get("Rebounding", 0) >= 8):
        return "Defensive Anchor"
    return "Versatile Prospect"  # Default archetype if no category matches

# === Generate Summary Using OpenAI ===
def generate_summary(report):
    """
    Generate a natural language scouting summary using OpenAI GPT-3.5.
    The prompt incorporates structured report fields and inferred archetype.
    """
    ratings = report.get("ratings", {})  # Extract trait ratings
    archetype = determine_archetype(ratings)  # Classify player archetype

    # === Construct GPT prompt with all relevant report details ===
    prompt = f"""Generate a 5–7 sentence NBA draft scouting summary based on the following evaluation:
Strengths: {report['strengths']}
Weaknesses: {report['weaknesses']}
Intangibles: {report.get('intangibles', 'N/A')}
Player Comparison: {report['comparison']}
Projected Role: {report['role']}
Ceiling: {report['ceiling']}
Draft Range: {report['range']}
Archetype: {archetype}

From the trait ratings below, highlight strengths with a rating of 8 or higher and weaknesses with a rating of 3 or lower — but do not repeat traits already mentioned in the Strengths or Weaknesses section.

Trait Ratings:
{ratings}
"""

    # === Call OpenAI API to generate summary ===
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # Language model
        messages=[{"role": "user", "content": prompt}],  # Prompt formatted as chat
        temperature=0.7,  # Creativity level
        max_tokens=300,   # Max word length
    )

    # === Extract and return the generated text summary ===
    return response.choices[0].message.content.strip()
