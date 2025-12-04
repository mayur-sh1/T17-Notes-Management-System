# Setup Guide - Notes Management System

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
3. **Redis** (v7 or higher) - [Download](https://redis.io/download) (Optional for development)
4. **npm** or **yarn** package manager

## Quick Setup

### 1. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies (in a new terminal)
cd frontend
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE notes_db;
```

2. Create `.env` file in `backend/` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/notes_db?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
```

3. Generate Prisma Client and run migrations:
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Frontend Setup

1. Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:3000
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`

## Project Structure

```
T17-Notes-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Redis config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & validation
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── socket/          # Socket.IO handlers
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Main server file
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API clients
│   │   ├── context/         # Context providers
│   │   └── types/           # TypeScript types
│   └── package.json
├── docs/                    # Documentation
└── README.md
```

## Features Implemented

### Backend ✅
- [x] User authentication (JWT)
- [x] Note CRUD operations
- [x] Tag system
- [x] Note sharing (users & groups)
- [x] Group management
- [x] Real-time collaboration (Socket.IO)
- [x] Notifications
- [x] Version history
- [x] Admin dashboard
- [x] Search and filtering

### Frontend ✅
- [x] Authentication pages (Login/Register)
- [x] Dashboard
- [x] API service layer
- [x] Socket.IO integration
- [x] Context providers (Auth, Socket)
- [x] Basic page structure
- [ ] Full note editor implementation (structure created)
- [ ] Complete component implementations (structure created)

## Next Steps for Full Implementation

### Frontend Components to Complete:
1. **Rich Text Editor** - Integrate React Quill fully
2. **Note Editor** - Complete note editing interface
3. **Tag Manager** - Tag creation and assignment UI
4. **Share Modal** - Share notes with users/groups
5. **Notification Center** - Display and manage notifications
6. **Group Management** - Full group UI
7. **Admin Dashboard** - Complete admin interface

### To Complete Notes Page:
- Create note list component
- Implement note editor with real-time sync
- Add tag filtering
- Add search functionality

### To Complete Shared Page:
- Display shared notes
- Show sharing permissions
- Allow permission changes

### To Complete Groups Page:
- Create group UI
- Add/remove members
- Group note sharing

### To Complete Admin Page:
- User management
- System statistics
- Usage reports

## Common Issues

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env` file
- Ensure database exists

### Redis Connection Error (Warning Only)
- Redis is optional for development
- Some real-time features may be limited without Redis
- Install Redis or ignore the warning

### Port Already in Use
- Change PORT in backend `.env`
- Update VITE_API_URL in frontend `.env`

### CORS Errors
- Verify FRONTEND_URL in backend `.env` matches frontend URL
- Check browser console for specific CORS errors

## Testing

### Create a Test User
1. Register at `/register`
2. Login at `/login`
3. Access dashboard at `/`

### Test Real-time Collaboration
1. Open note in two browser windows
2. Edit in one window
3. Changes should appear in real-time in the other window

## Production Deployment

### Environment Variables
Update all `.env` files with production values:
- Strong JWT_SECRET
- Production database URL
- Production Redis URL
- Correct FRONTEND_URL

### Build Commands
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve dist/ folder with a web server (Nginx, etc.)
```

## Support

For issues or questions:
1. Check the documentation in `/docs` folder
2. Review error messages in console
3. Check database connection
4. Verify environment variables

## License

MIT License

