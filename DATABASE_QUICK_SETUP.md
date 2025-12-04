# 🚀 Quick Database Setup Guide

## The Fastest Way to Set Up Your Database

### Step 1: Update Database Password (2 minutes)

#### Option A: Using Helper Script (Easiest)

```powershell
cd E:\T17-Notes-Management-System\backend
.\UPDATE_ENV.ps1
```

Follow the prompts!

#### Option B: Manual Edit (Simple)

1. Go to: `E:\T17-Notes-Management-System\backend`
2. Right-click on `.env` file
3. Open with Notepad
4. Find this line:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notes_db?schema=public"
   ```
5. Replace `postgres` (after the colon) with your actual password:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/notes_db?schema=public"
   ```
6. Save (Ctrl + S)

---

### Step 2: Create Database (1 minute)

#### Option A: Using pgAdmin (Visual - Easiest)

1. **Open pgAdmin** (search in Start Menu)
2. **Enter your password** when prompted
3. **Right-click** on "Databases" in left panel
4. **Select:** Create → Database...
5. **Name:** `notes_db`
6. **Click:** Save

Done! ✅

#### Option B: Using Command Line

```powershell
# Find your PostgreSQL bin folder (usually)
cd "C:\Program Files\PostgreSQL\16\bin"

# Connect (enter password when prompted)
.\psql.exe -U postgres

# Create database
CREATE DATABASE notes_db;

# Verify
\l

# Exit
\q
```

#### Option C: One-Line Command

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE notes_db;"
```

(Replace `16` with your PostgreSQL version)

---

### Step 3: Run Migrations (30 seconds)

```powershell
cd E:\T17-Notes-Management-System\backend
npx prisma migrate dev --name init
```

Wait for: `✔ Applied migration: init`

---

### Step 4: Verify Everything Works (10 seconds)

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

## 🎯 Complete Command Sequence

Copy and paste these commands one by one:

```powershell
# 1. Update password (or use helper script)
cd E:\T17-Notes-Management-System\backend
.\UPDATE_ENV.ps1

# 2. Create database (using pgAdmin is easier, or use psql)
# Option: Open pgAdmin and create database manually

# OR use command line:
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE notes_db;"

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Test server
npm run dev
```

---

## ✅ Checklist

- [ ] PostgreSQL password updated in `.env`
- [ ] Database `notes_db` created
- [ ] Migrations run successfully
- [ ] Server starts without errors

---

## 🆘 Common Issues

### "Password authentication failed"
→ Check password in `.env` file matches your PostgreSQL password

### "Database does not exist"
→ Run: `CREATE DATABASE notes_db;` in PostgreSQL

### "psql not found"
→ Use full path: `"C:\Program Files\PostgreSQL\16\bin\psql.exe"`

### PostgreSQL not installed?
→ Download from: https://www.postgresql.org/download/windows/

---

## 📋 What You Need

- ✅ PostgreSQL installed
- ✅ Your PostgreSQL password
- ✅ 5 minutes of time

That's it! 🚀

