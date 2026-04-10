from openai import OpenAI
import os
from services.segmentation import segment_user

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_message(data):
    segment = segment_user(data)

    prompt = f"""
    Generate a WhatsApp message.

    User: {data['name']}
    Items: {data['cartItems']}
    Value: {data['cartValue']}
    Segment: {segment}

    Rules:
    - Under 20 words
    - Add urgency
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content