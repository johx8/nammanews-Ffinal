import random
from faker import Faker
from datetime import datetime, timedelta
from pymongo import MongoClient

# 1. Setup
fake = Faker()

# 2. MongoDB connection
mongo_uri = "mongodb+srv://jyothishkj56:aPtEqfTagATQQpBt@cluster0.moxnbus.mongodb.net/"
client = MongoClient(mongo_uri)

db = client["test"]  # Your DB name
events_collection = db["events"]  # Event collection
stories_collection = db["stories"]  # Story collection

# 3. Static data
districts = [
    "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur",
    "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
    "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru",
    "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgiri"
]

categories = [
    "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance", "Advertisements"
]

youtube_video_ids = [
    "dQw4w9WgXcQ", "9bZkp7q19f0", "3JZ_D3ELwOQ", "2Vv-BfVoq4g",
    "eVTXPUF4Oz4", "RgKAFK5djSk", "uelHwf8o7_U", "60ItHLz5WEA"
]

# 4. Helpers
def random_youtube_link():
    return f"https://www.youtube.com/watch?v={random.choice(youtube_video_ids)}"

def random_date_until(end_date):
    delta = end_date - datetime.utcnow()
    random_days = random.randint(1, max(1, delta.days))
    date = datetime.utcnow() + timedelta(days=random_days)
    return date.replace(hour=0, minute=0, second=0, microsecond=0)

def random_time():
    hour = random.randint(0, 23)
    minute = random.choice([0, 15, 30, 45])
    return f"{hour:02d}:{minute:02d}"

def random_paragraph(min_words, max_words):
    words = []
    while len(words) < min_words:
        sentence = fake.sentence(nb_words=random.randint(6, 15))
        words.extend(sentence.rstrip('.').split())
    return " ".join(words[:random.randint(min_words, max_words)]) + "."

# 5. Default constants
default_user_id = "686cddb51e7e1cf0d682eace"

# 6. Generate Events
events_data = []
end_of_september = datetime(2025, 9, 30)

for _ in range(20):
    now = datetime.utcnow()
    event = {
        "title": fake.sentence(nb_words=4).rstrip('.'),
        "description": random_paragraph(80, 100),  # 80-100 words
        "date": random_date_until(end_of_september),
        "time": random_time(),
        "organizedBy": fake.company(),
        "imageUrl": "",
        "contact": fake.phone_number(),
        "address": fake.address(),
        "district": random.choice(districts),
        "category": random.choice(categories),
        "maxAttendees": random.choice([None, random.randint(50, 500)]),
        "registeredUsers": [],  # empty
        "approved": True,
        "createdBy": default_user_id,
        "rejectionMessage": "",
        "createdAt": now,
        "updatedAt": now
    }
    events_data.append(event)

events_collection.insert_many(events_data)
print(f"✅ Inserted {len(events_data)} events")

# 7. Generate Stories
stories_data = []
stories_end_date = datetime(2025, 8, 13)

for _ in range(20):
    now = datetime.utcnow()
    story = {
        "title": fake.sentence(nb_words=6).rstrip('.'),
        "description": random_paragraph(200, 230),  # at least 200 words
        "imageUrl": "",
        "youtubeLink": random_youtube_link() if random.random() < 0.5 else "",
        "date": random_date_until(stories_end_date),
        "time": random_time(),
        "district": random.choice(districts),
        "category": random.choice(categories),
        "createdAt": now,
        "updatedAt": now
    }
    stories_data.append(story)

stories_collection.insert_many(stories_data)
print(f"✅ Inserted {len(stories_data)} stories")
