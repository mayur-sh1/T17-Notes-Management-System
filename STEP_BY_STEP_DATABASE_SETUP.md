# 📝 Step-by-Step Database Setup - Follow This Guide!

## 🎯 Goal
Complete database setup in 5 minutes!

---

## ⚡ QUICK START (Choose Your Path)

### 🟢 Path 1: I Have pgAdmin (Easiest - Recommended)
→ Go to **Section A** below

### 🟡 Path 2: I Have Command Line Access
→ Go to **Section B** below

### 🔴 Path 3: I Need to Install PostgreSQL
→ Go to **Section C** below

---

## 📘 Section A: Setup Using pgAdmin (Easiest)

### Step 1: Update Database Password in .env File

**What to do:**
1. Navigate to: `E:\T17-Notes-Management-System\backend`
2. Find the `.env` file
3. Right-click → Open with → Notepad
4. Look for this line:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notes_db?schema=public"
   ```
5. Replace `postgres` (the password part) with your PostgreSQL password

   **Example:**
   - If your password is `mypass123`, change it to:
   ```env
   DATABASE_URL="postgresql://postgres:mypass123@localhost:5432/notes_db?schema=public"
   ```

6. Save the file (Ctrl + S)

**💡 Tip:** Use our helper script instead:
```powershell
cd E:\T17-Notes-Management-System\backend
.\UPDATE_ENV.ps1
```

---

### Step 2: Open pgAdmin

1. **Search for pgAdmin** in Windows Start Menu
2. Click to open
3. Enter your PostgreSQL password when prompted
4. Wait for it to load (may take a few seconds)

---

### Step 3: Create Database

1. **In the left panel**, you'll see a tree structure
2. **Expand** "Servers" → "PostgreSQL [version]" → "Databases"
3. **Right-click** on "Databases"
4. **Select:** "Create" → "Database..."

5. **In the popup window:**
   - **Database name:** Type `notes_db`
   - Leave other settings as default
   - Click **"Save"** button

6. **Done!** ✅ You should now see `notes_db` in the Databases list

---

### Step 4: Run Migrations

Open PowerShell or Command Prompt:

```powershell
cd E:\T17-Notes-Management-System\backend
npx prisma migrate dev --name init
```

**What you should see:**
```
✔ Applied migration: init
```

If you see errors, check:
- PostgreSQL password in `.env` is correct
- Database `notes_db` exists

---

### Step 5: Test Your Setup

```powershell
cd E:\T17-Notes-Management-System\backend
npm run dev
```

You should see:
```
🚀 Server running on port 3000
```

**Test it:** Open browser → http://localhost:3000/health

---

## 📘 Section B: Setup Using Command Line

### Step 1: Update Password (Same as Section A)

Edit `.env` file:
```powershell
cd E:\T17-Notes-Management-System\backend
notepad .env
```

Or use helper script:
```powershell
.\UPDATE_ENV.ps1
```

---

### Step 2: Find PostgreSQL Installation

PostgreSQL is usually installed here:
```
C:\Program Files\PostgreSQL\[VERSION]\bin
```

Common versions: `16`, `15`, `14`, `13`

**Find your version:**
```powershell
Get-ChildItem "C:\Program Files\PostgreSQL" | Select-Object Name
```

---

### Step 3: Create Database

**Option 1: Using Full Path**

```powershell
# Replace 16 with your version number
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE notes_db;"
```

Enter password when prompted.

**Option 2: Using psql Interactive**

```powershell
# Navigate to PostgreSQL bin
cd "C:\Program Files\PostgreSQL\16\bin"

# Connect
.\psql.exe -U postgres

# Create database (inside psql)
CREATE DATABASE notes_db;

# Verify
\l

# Exit
\q
```

---

### Step 4 & 5: Same as Section A

Follow Steps 4 and 5 from Section A above!

---

## 📘 Section C: Install PostgreSQL First

### Step 1: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download the latest version (usually 16.x)

### Step 2: Install PostgreSQL

1. **Run the installer**
2. **Click "Next"** through the wizard
3. **Choose installation directory** (default is fine)
4. **Select components:**
   - ✅ PostgreSQL Server
   - ✅ pgAdmin (IMPORTANT - we need this!)
   - ✅ Command Line Tools
   - ✅ Stack Builder (optional)

5. **Set password:**
   - **REMEMBER THIS PASSWORD!** You'll need it!
   - Enter a strong password
   - Confirm password

6. **Port:** Leave as default (5432)

7. **Finish installation**

8. **Complete!** ✅

### Step 3: Verify Installation

1. Search for "pgAdmin" in Start Menu
2. Open it
3. Enter the password you set during installation
4. If it opens, you're ready!

### Step 4: Continue with Section A

Now go back to **Section A** above and follow those steps!

---

## 🎯 Complete Checklist

Follow this checklist to ensure everything is done:

- [ ] **Step 1:** Updated password in `.env` file
  - Location: `backend/.env`
  - Line: `DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@..."`

- [ ] **Step 2:** Created database `notes_db`
  - Using pgAdmin OR command line
  - Database name exactly: `notes_db`

- [ ] **Step 3:** Ran migrations
  - Command: `npx prisma migrate dev --name init`
  - Result: ✅ Applied migration

- [ ] **Step 4:** Tested server
  - Command: `npm run dev`
  - Result: Server running on port 3000
  - Test: http://localhost:3000/health works

---

## 🆘 Troubleshooting

### ❌ Problem: "Can't open .env file"

**Solution:**
- Make sure you're in the `backend` folder
- File might be hidden - enable "Show hidden files" in File Explorer
- Or open from PowerShell: `notepad .env`

### ❌ Problem: "I don't know my PostgreSQL password"

**Try these:**
- `postgres` (default)
- `admin`
- `root`
- Empty password (just press Enter)

If none work, you may need to reset it (see full guide).

### ❌ Problem: "pgAdmin not found"

**Solution:**
- Reinstall PostgreSQL and make sure to select pgAdmin
- Or use command line method (Section B)

### ❌ Problem: "Database already exists"

**That's OK!** Just continue to migrations step.

### ❌ Problem: "Migrations failed"

**Check:**
1. Password in `.env` is correct
2. Database `notes_db` exists
3. PostgreSQL service is running
4. Try: `npx prisma generate` first

---

## 🎉 Success!

When you see this, you're done:

```powershell
cd backend
npm run dev

# Output:
🚀 Server running on port 3000
📝 Environment: development
🔗 Frontend URL: http://localhost:5173
```

And http://localhost:3000/health returns:
```json
{"status":"ok","timestamp":"..."}
```

**Congratulations! Your backend is fully set up!** 🎉

---

## 📞 Need More Help?

1. Read: `DATABASE_SETUP_GUIDE.md` (detailed guide)
2. Read: `DATABASE_QUICK_SETUP.md` (quick reference)
3. Check error messages carefully
4. Verify PostgreSQL is running

**You've got this!** 💪

