import asyncio
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Database
from utils.security import get_password_hash
from datetime import datetime

async def run_seed(db):
    # 0. Seed Permissions
    permissions = [
        {"name": "report_crime", "description": "Allowed to report cyber crime"},
        {"name": "track_complaint", "description": "Allowed to track own complaint"},
        {"name": "use_copilot", "description": "Allowed to use AI Citizen Copilot"},
        {"name": "view_cases", "description": "Allowed to view cybercrime cases"},
        {"name": "investigate", "description": "Allowed to update case status and remarks"},
        {"name": "generate_fir", "description": "Allowed to generate AI FIR document"},
        {"name": "manage_officers", "description": "Allowed to create and edit cybercrime officers"}
    ]
    
    for perm in permissions:
        existing_perm = await db["permissions"].find_one({"name": perm["name"]})
        if not existing_perm:
            await db["permissions"].insert_one(perm)
            print(f"Created Permission: {perm['name']}")
            
    # Seed Roles
    roles = [
        {
            "name": "citizen",
            "description": "Public citizen role",
            "permissions": ["report_crime", "track_complaint", "use_copilot"]
        },
        {
            "name": "officer",
            "description": "Investigating officer role",
            "permissions": ["view_cases", "investigate", "generate_fir"]
        },
        {
            "name": "admin",
            "description": "Super admin command role",
            "permissions": ["manage_officers", "view_cases", "investigate", "generate_fir", "report_crime", "track_complaint", "use_copilot"]
        }
    ]
    
    for role in roles:
        existing_role = await db["roles"].find_one({"name": role["name"]})
        if not existing_role:
            await db["roles"].insert_one(role)
            print(f"Created Role: {role['name']}")
        else:
            await db["roles"].replace_one({"name": role["name"]}, role)
            print(f"Updated Role Permissions: {role['name']}")

    # 1. Seed Super Admin
    admin_data = {
        "admin_id": "SA-001",
        "email": "admin@surakshanet.com",
        "full_name": "System Admin",
        "password": "password123",
        "role": "admin"
    }
    
    existing_admin = await db["admins"].find_one({"email": admin_data["email"]})
    if not existing_admin:
        hashed_password = get_password_hash(admin_data["password"])
        admin_doc = {
            "admin_id": admin_data["admin_id"],
            "email": admin_data["email"],
            "full_name": admin_data["full_name"],
            "hashed_password": hashed_password,
            "role": admin_data["role"],
            "created_at": datetime.utcnow()
        }
        await db["admins"].insert_one(admin_doc)
        print(f"Created Super Admin: {admin_data['email']}")
    else:
        print(f"Super Admin {admin_data['email']} already exists.")
        
    # 2. Seed Test Officer
    officer_data = {
        "officer_id": "OFF-101",
        "email": "officer@surakshanet.com",
        "full_name": "Investigating Officer",
        "password": "password123",
        "role": "officer",
        "mobile_number": "9876543210",
        "designation": "Inspector",
        "rank": "Senior",
        "district": "Central",
        "state": "State",
        "department": "Cyber Crime",
        "badge_number": "B-101",
        "status": "Active"
    }
    
    existing_officer = await db["officers"].find_one({"email": officer_data["email"]})
    if not existing_officer:
        hashed_password = get_password_hash(officer_data["password"])
        officer_doc = {
            "officer_id": officer_data["officer_id"],
            "email": officer_data["email"],
            "full_name": officer_data["full_name"],
            "mobile_number": officer_data["mobile_number"],
            "designation": officer_data["designation"],
            "rank": officer_data["rank"],
            "district": officer_data["district"],
            "state": officer_data["state"],
            "department": officer_data["department"],
            "badge_number": officer_data["badge_number"],
            "status": officer_data["status"],
            "hashed_password": hashed_password,
            "role": officer_data["role"],
            "created_at": datetime.utcnow()
        }
        await db["officers"].insert_one(officer_doc)
        print(f"Created Test Officer: {officer_data['email']}")
    else:
        print(f"Test Officer {officer_data['email']} already exists.")

async def seed():
    await Database.connect_db()
    db = Database.get_db()
    await run_seed(db)
    await Database.close_db()
    print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed())
