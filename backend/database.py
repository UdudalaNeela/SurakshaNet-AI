from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect_db(cls):
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
            cls.db = cls.client[settings.DATABASE_NAME]
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info(f"Connected to MongoDB Atlas: {settings.DATABASE_NAME}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")

    @classmethod
    async def setup_indexes(cls):
        try:
            # Citizens
            await cls.db["citizens"].create_index("email", unique=True)
            
            # Officers
            await cls.db["officers"].create_index("email", unique=True)
            await cls.db["officers"].create_index("officer_id", unique=True)
            
            # Admins
            await cls.db["admins"].create_index("email", unique=True)
            await cls.db["admins"].create_index("admin_id", unique=True)
            
            # Roles & Permissions
            await cls.db["roles"].create_index("name", unique=True)
            await cls.db["permissions"].create_index("name", unique=True)
            
            # Scam Reports
            await cls.db["scam_reports"].create_index("user_id")
            await cls.db["scam_reports"].create_index("created_at")
            
            # Currency Reports
            await cls.db["currency_reports"].create_index("user_id")
            await cls.db["currency_reports"].create_index("created_at")
            
            # Chatbot History
            await cls.db["chatbot_history"].create_index("user_id")
            await cls.db["chatbot_history"].create_index("created_at")
            
            logger.info("MongoDB indexes created successfully.")
        except Exception as e:
            logger.error(f"Failed to create indexes: {e}")

    @classmethod
    async def close_db(cls):
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed.")

    @classmethod
    def get_db(cls):
        return cls.db

db = Database()
