import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
 
from app.database import get_db
from app.utils.security import get_password_hash
from datetime import datetime
 
def create_admin_user(name: str, email: str, password: str):
    """Create an admin user with special privileges"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            print(f"❌ User with email {email} already exists!")
            return False
        
        # Create admin user
        hashed_password = get_password_hash(password)
        now = datetime.utcnow().isoformat()
        
        cursor.execute("""
            INSERT INTO users (name, email, hashed_password, role, is_superuser, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, email, hashed_password, "admin", 1, 1, now, now))
        
        print(f"✅ Admin user created successfully!")
        print(f"   Name: {name}")
        print(f"   Email: {email}")
        print(f"   Role: admin")
        print(f"   Superuser: Yes")
        return True
 
def create_regular_user(name: str, email: str, password: str):
    """Create a regular user"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            print(f"❌ User with email {email} already exists!")
            return False
        
        # Create regular user
        hashed_password = get_password_hash(password)
        now = datetime.utcnow().isoformat()
        
        cursor.execute("""
            INSERT INTO users (name, email, hashed_password, role, is_superuser, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, email, hashed_password, "user", 0, 1, now, now))
        
        print(f"✅ Regular user created successfully!")
        print(f"   Name: {name}")
        print(f"   Email: {email}")
        print(f"   Role: user")
        return True
 
def list_all_users():
    """List all users in the system"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, email, role, is_superuser, is_active, created_at
            FROM users
            ORDER BY is_superuser DESC, created_at ASC
        """)
        users = cursor.fetchall()
        
        if not users:
            print("No users found in the system.")
            return
        
        print("\n" + "="*80)
        print(f"{'ID':<5} {'Name':<20} {'Email':<30} {'Role':<10} {'Admin':<8} {'Active':<8}")
        print("="*80)
        
        for user in users:
            user_dict = dict(user)
            admin_badge = "🔑 YES" if user_dict['is_superuser'] == 1 else "   No"
            active_badge = "✓ Yes" if user_dict['is_active'] == 1 else "✗ No"
            
            print(f"{user_dict['id']:<5} {user_dict['name']:<20} {user_dict['email']:<30} "
                  f"{user_dict['role']:<10} {admin_badge:<8} {active_badge:<8}")
        print("="*80 + "\n")
 
if __name__ == "__main__":
    print("\n🔧 User Management Utility")
    print("="*50)
    
    while True:
        print("\nOptions:")
        print("1. Create Admin User")
        print("2. Create Regular User")
        print("3. List All Users")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            print("\n--- Create Admin User ---")
            name = input("Enter name: ").strip()
            email = input("Enter email: ").strip()
            password = input("Enter password: ").strip()
            create_admin_user(name, email, password)
            
        elif choice == "2":
            print("\n--- Create Regular User ---")
            name = input("Enter name: ").strip()
            email = input("Enter email: ").strip()
            password = input("Enter password: ").strip()
            create_regular_user(name, email, password)
            
        elif choice == "3":
            list_all_users()
            
        elif choice == "4":
            print("\n👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice. Please try again.")