# Installation Guide - Fixing PowerShell Execution Policy

## Problem
If you see the error: `running scripts is disabled on this system`, PowerShell's execution policy is preventing npm from running.

## Solutions

### Option 1: Use Command Prompt (CMD) - Recommended ✅

1. Open **Command Prompt** (not PowerShell):
   - Press `Win + R`
   - Type `cmd` and press Enter
   - OR search for "Command Prompt" in Start Menu

2. Navigate to your project:
   ```cmd
   cd E:\T17-Notes-Management-System\frontend
   ```

3. Install dependencies:
   ```cmd
   npm install
   ```

4. Do the same for backend:
   ```cmd
   cd E:\T17-Notes-Management-System\backend
   npm install
   ```

### Option 2: Bypass Execution Policy for Current Session

In PowerShell, run this command first (only affects current session):

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Then run:
```powershell
cd E:\T17-Notes-Management-System\frontend
npm install
```

### Option 3: Change Execution Policy Permanently (Requires Admin)

⚠️ **Only if you understand the security implications**

1. Open PowerShell as Administrator:
   - Right-click on PowerShell
   - Select "Run as Administrator"

2. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Type `Y` when prompted

## Complete Installation Steps

After fixing the execution policy issue:

### 1. Install Frontend Dependencies
```cmd
cd E:\T17-Notes-Management-System\frontend
npm install
```

### 2. Install Backend Dependencies
```cmd
cd E:\T17-Notes-Management-System\backend
npm install
```

### 3. Set Up Database

1. Create a PostgreSQL database named `notes_db`

2. Create `backend/.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/notes_db?schema=public"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   FRONTEND_URL="http://localhost:5173"
   PORT=3000
   NODE_ENV="development"
   ```

3. Generate Prisma Client and migrate:
   ```cmd
   cd E:\T17-Notes-Management-System\backend
   npx prisma generate
   npx prisma migrate dev --name init
   ```

### 4. Set Up Frontend Environment

Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:3000
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```cmd
cd E:\T17-Notes-Management-System\backend
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd E:\T17-Notes-Management-System\frontend
npm run dev
```

## Verify Installation

- Backend: `http://localhost:3000/health` should return `{"status":"ok"}`
- Frontend: `http://localhost:5173` should load the login page

## Need Help?

If you continue to have issues:
1. Make sure Node.js is installed: `node --version`
2. Make sure npm is installed: `npm --version`
3. Try clearing npm cache: `npm cache clean --force`
4. Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

