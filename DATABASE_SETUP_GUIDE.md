# Database Setup Guide - Step by Step

## 🎯 Goal
1. Update database password in `.env` file
2. Create PostgreSQL database
3. Run migrations to create tables

---

## Step 1: Find Your PostgreSQL Password

You need to know the password you set when installing PostgreSQL. Common scenarios:

### Option A: You Remember the Password
- Use that password in the next step

### Option B: You Forgot the Password
- Try common defaults: `postgres`, `admin`, `root`, or empty password
- Or reset it (see troubleshooting section)

### Option C: Check if PostgreSQL is Installed
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Look for "postgresql" service
4. If not found, you need to install PostgreSQL first

---

## Step 2: Update .env File

### Method 1: Using Notepad (Easiest)

1. **Open File Explorer**
   - Navigate to: `E:\T17-Notes-Management-System\backend`

2. **Open .env file**
   - Right-click on `.env` file
   - Select "Open with" → "Notepad"
   - OR double-click if Notepad is default

3. **Find this line:**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notes_db?schema=public"
   ```

4. **Replace `postgres` (the password part) with your actual password:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/notes_db?schema=public"
   ```

   **Example:**
   - If your password is `mypassword123`, it should be:
   ```env
   DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/notes_db?schema=public"
   ```

5. **Save the file** (Ctrl + S)

### Method 2: Using PowerShell

Run this command (replace `YOUR_PASSWORD` with your actual password):

```powershell
cd E:\T17-Notes-Management-System\backend
$content = Get-Content .env
$content = $content -replace 'postgres:postgres@', 'postgres:YOUR_PASSWORD@'
$content | Set-Content .env
```

---

## Step 3: Create PostgreSQL Database

### Method 1: Using pgAdmin (GUI - Recommended)

1. **Open pgAdmin**
   - Search for "pgAdmin" in Start Menu
   - OR open from: `C:\Program Files\PostgreSQL\[version]\pgAdmin 4`

2. **Connect to Server**
   - Enter your PostgreSQL password when prompted
   - If you see "Servers" in left panel, click to expand

3. **Navigate to Databases**
   - Expand: Servers → PostgreSQL [version] → Databases

4. **Create New Database**
   - Right-click on "Databases"
   - Select "Create" → "Database..."

5. **Enter Database Details**
   - **Database name:** `notes_db`
   - **Owner:** `postgres` (default)
   - Click "Save"

6. **Verify**
   - You should see `notes_db` in the Databases list

### Method 2: Using Command Line (psql)

1. **Open Command Prompt or PowerShell**

2. **Navigate to PostgreSQL bin folder** (usually):
   ```powershell
   cd "C:\Program Files\PostgreSQL\16\bin"
   ```
   (Replace `16` with your PostgreSQL version number)

3. **Connect to PostgreSQL:**
   ```powershell
   .\psql.exe -U postgres
   ```
   - Enter your password when prompted

4. **Create Database:**
   ```sql
   CREATE DATABASE notes_db;
   ```

5. **Verify:**
   ```sql
   \l
   ```
   - You should see `notes_db` in the list

6. **Exit:**
   ```sql
   \q
   ```

### Method 3: Using SQL Command Directly

If you have PostgreSQL in your PATH:

```powershell
psql -U postgres -c "CREATE DATABASE notes_db;"
```

Enter password when prompted.

---

## Step 4: Verify Database Connection

Test if everything is configured correctly:

```powershell
cd E:\T17-Notes-Management-System\backend
npx prisma db pull
```

If successful, you'll see connection messages. If you see errors, check:
- PostgreSQL is running
- Password in `.env` is correct
- Database `notes_db` exists

---

## Step 5: Run Migrations

This creates all the database tables:

```powershell
cd E:\T17-Notes-Management-System\backend
npx prisma migrate dev --name init
```

**What this does:**
- Creates all tables (User, Note, Tag, Share, Group, etc.)
- Sets up relationships
- Creates indexes

**Expected output:**
```
✔ Applied migration: init
```

---

## Step 6: Verify Setup

### Option 1: Check Database Tables

Using pgAdmin:
1. Expand: Servers → PostgreSQL → Databases → notes_db → Schemas → public → Tables
2. You should see tables like: User, Note, Tag, Share, Group, etc.

Using Command Line:
```powershell
cd backend
npx prisma studio
```
This opens a web interface at http://localhost:5555 to view your database.

### Option 2: Test Server

```powershell
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3000
```

Visit: http://localhost:3000/health

---

## 📋 Quick Checklist

- [ ] PostgreSQL is installed and running
- [ ] Know your PostgreSQL password
- [ ] Updated `.env` file with correct password
- [ ] Created database `notes_db`
- [ ] Ran migrations successfully
- [ ] Server starts without errors

---

## 🆘 Troubleshooting

### Problem: "Password authentication failed"

**Solutions:**
1. Double-check password in `.env` file
2. Try resetting PostgreSQL password (see below)
3. Check if password has special characters (may need URL encoding)

### Problem: "Database does not exist"

**Solution:**
```sql
CREATE DATABASE notes_db;
```

### Problem: "Could not connect to database server"

**Solutions:**
1. Check PostgreSQL service is running:
   - Win+R → `services.msc` → Find "postgresql" → Right-click → Start

2. Check PostgreSQL is installed:
   - Look in: `C:\Program Files\PostgreSQL\`

3. Verify port 5432 is not blocked by firewall

### Problem: "psql: command not found"

**Solution:**
- Use full path: `"C:\Program Files\PostgreSQL\16\bin\psql.exe"`
- OR add PostgreSQL bin folder to PATH environment variable

### Problem: PostgreSQL Not Installed

**Install PostgreSQL:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set!
4. Install pgAdmin (comes with installer)
5. Complete installation
6. Restart computer if needed

### Problem: Forgot PostgreSQL Password

**Reset Password (Windows):**

1. **Stop PostgreSQL service:**
   - Win+R → `services.msc`
   - Find "postgresql" service
   - Right-click → Stop

2. **Edit pg_hba.conf:**
   - Location: `C:\Program Files\PostgreSQL\[version]\data\pg_hba.conf`
   - Find line: `host all all 127.0.0.1/32 md5`
   - Change `md5` to `trust`
   - Save file

3. **Start PostgreSQL service**

4. **Connect without password:**
   ```powershell
   psql -U postgres
   ```

5. **Reset password:**
   ```sql
   ALTER USER postgres WITH PASSWORD 'newpassword';
   ```

6. **Revert pg_hba.conf:**
   - Change `trust` back to `md5`
   - Restart PostgreSQL service

---

## 🎯 Quick Commands Summary

```powershell
# 1. Navigate to backend
cd E:\T17-Notes-Management-System\backend

# 2. Update .env file manually (open in Notepad)

# 3. Test database connection
npx prisma db pull

# 4. Run migrations
npx prisma migrate dev --name init

# 5. View database (optional)
npx prisma studio

# 6. Start server
npm run dev
```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ No errors when running `npx prisma migrate dev`
2. ✅ Server starts with: `🚀 Server running on port 3000`
3. ✅ Health endpoint works: http://localhost:3000/health
4. ✅ Database has tables visible in pgAdmin or Prisma Studio

---

## 📞 Need More Help?

If you're stuck:
1. Check error messages carefully
2. Verify PostgreSQL is running
3. Double-check password in `.env`
4. Ensure database exists
5. Try connecting manually with psql

Good luck! 🚀

