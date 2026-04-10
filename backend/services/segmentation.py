def segment_user(data):
    if data["cartValue"] > 3000:
        return "high_value"
    elif data["cartValue"] < 1000:
        return "low_value"
    return "regular"