import random
from faker import Faker
from datetime import datetime, timedelta
from pymongo import MongoClient

# 1. Setup
fake = Faker()

# 2. MongoDB connection setup
mongo_uri = "mongodb+srv://jyothishkj56:aPtEqfTagATQQpBt@cluster0.moxnbus.mongodb.net/"
client = MongoClient(mongo_uri)

db = client["test"]         # Your DB name
collection = db["events"]   # Your collection name

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

# 4. Helper functions
def random_youtube_link():
    return f"https://www.youtube.com/watch?v={random.choice(youtube_video_ids)}"

def random_date_only():
    # Return a datetime object with time set to 00:00:00 UTC
    future_date = datetime.utcnow() + timedelta(days=random.randint(1, 60))
    return future_date.replace(hour=0, minute=0, second=0, microsecond=0)

def random_time():
    hour = random.randint(0, 23)
    minute = random.choice([0, 15, 30, 45])
    return f"{hour:02d}:{minute:02d}"

# 5. Constants
default_user_id = "686cddb51e7e1cf0d682eace"
default_approved = True

# 6. Generate and insert data
data = []
for _ in range(20):
    now = datetime.utcnow()
    entry = {
        "title": fake.sentence(nb_words=4).rstrip('.'),
        "description": fake.paragraph(nb_sentences=2),
        "district": random.choice(districts),
        "category": random.choice(categories),
        "date": random_date_only(),          # stored as actual Date
        "time": random_time(),               # stored as string
        "imageUrl": "",
        "youtubeLink": random_youtube_link() if random.random() < 0.5 else "",
        "isAdvertisement": True,
        "createdBy": default_user_id,
        "approved": default_approved,
        "redirectUrl": "",
        "createdAt": now,
        "updatedAt": now
    }
    data.append(entry)

# 7. Insert into MongoDB
result = collection.insert_many(data)
print(f"✅ Inserted {len(result.inserted_ids)} documents into MongoDB.")
