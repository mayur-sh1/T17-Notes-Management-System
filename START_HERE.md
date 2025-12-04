# 🚀 START HERE - Database Setup Guide

## ⚡ Quick Setup in 3 Steps

I can see your `.env` file is ready! Follow these simple steps:

---

## Step 1: Update Database Password ⏱️ 2 minutes

Your current `.env` file has:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notes_db?schema=public"
```

**You need to change `postgres` (the password) to your actual PostgreSQL password.**

### Easy Method - Use Helper Script:

```powershell
cd E:\T17-Notes-Management-System\backend
.\UPDATE_ENV.ps1
```

This will guide you through updating the password!

### Manual Method:

1. Open File Explorer
2. Go to: `E:\T17-Notes-Management-System\backend`
3. Find `.env` file
4. Right-click → Open with → Notepad
5. Find the line with `DATABASE_URL`
6. Change `postgres:postgres@` to `postgres:YOUR_PASSWORD@`
7. Save (Ctrl + S)

**Example:**
- If your password is `mypassword123`:
- Change to: `postgres:mypassword123@`

---

## Step 2: Create Database ⏱️ 1 minute

### Option A: Using pgAdmin (Easiest!)

1. **Open pgAdmin**
   - Search "pgAdmin" in Start Menu
   - Click to open
   - Enter your PostgreSQL password

2. **Create Database**
   - In left panel: Expand "Servers" → "PostgreSQL" → "Databases"
   - Right-click on "Databases"
   - Click "Create" → "Database..."
   - Name: `notes_db`
   - Click "Save"

Done! ✅

### Option B: Using Command Line

```powershell
# Replace 16 with your PostgreSQL version
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE notes_db;"
```

Enter your password when prompted.

---

## Step 3: Run Migrations ⏱️ 30 seconds

Open PowerShell:

```powershell
cd E:\T17-Notes-Management-System\backend
npx prisma migrate dev --name init
```

Wait for: `✔ Applied migration: init`

---

## ✅ Test Everything Works

```powershell
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3000
```

**Test:** Open browser → http://localhost:3000/health

---

## 🎯 That's It!

After completing these 3 steps:
- ✅ Database is configured
- ✅ Tables are created
- ✅ Backend is ready!

---

## 📚 More Detailed Guides

If you need more help:
- **Detailed Guide:** `DATABASE_SETUP_GUIDE.md`
- **Step-by-Step:** `STEP_BY_STEP_DATABASE_SETUP.md`
- **Quick Reference:** `DATABASE_QUICK_SETUP.md`

---

## 🆘 Common Issues

### "I don't know my PostgreSQL password"
- Try: `postgres`, `admin`, or the password you set during installation
- If you forgot, you may need to reset it

### "PostgreSQL not installed?"
- Download from: https://www.postgresql.org/download/windows/
- Make sure to install pgAdmin too!

### "Can't find pgAdmin"
- Reinstall PostgreSQL and select pgAdmin during installation
- Or use command line method instead

---

## 💡 Pro Tip

The easiest path:
1. Use helper script: `.\UPDATE_ENV.ps1`
2. Use pgAdmin to create database
3. Run migrations

**Total time: ~5 minutes!**

Good luck! 🚀

