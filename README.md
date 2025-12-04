# Notes Management System

A full-stack notes management platform with real-time collaboration, tagging, and sharing features.

## 🚀 Features

- ✍️ **Rich Text Editing**: Create and edit notes with formatting (bold, italics, lists, links)
- 🏷️ **Tag-based Organization**: Assign multiple tags to notes for easy categorization
- 👥 **User & Group Sharing**: Share notes with specific users or groups
- ⚡ **Real-time Collaboration**: Live editing with instant updates via Socket.IO
- 🔔 **Notifications**: Get notified about shared notes, comments, and updates
- 📊 **Version History**: Track changes and revert to previous versions
- 🔍 **Advanced Search**: Search by keywords, tags, date, or owner
- 👮 **Admin Dashboard**: Manage users, groups, and monitor system usage
- 🔒 **Security**: Role-based access control, encrypted data, secure sharing

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Real-time**: Socket.IO + Redis
- **Authentication**: JWT tokens
- **UI Components**: React Quill (rich text), Lucide Icons

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis 7+ (optional for development, required for production)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mayur-sh1/T17-Notes-Management-System.git
cd T17-Notes-Management-System
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials:
# DATABASE_URL="postgresql://username:password@localhost:5432/notes_db"
# REDIS_URL="redis://localhost:6379"
# JWT_SECRET="your-secret-key"

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env:
# VITE_API_URL=http://localhost:3000

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
T17-Notes-Management-System/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── config/         # Database, Redis configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation middleware
│   │   ├── socket/         # Socket.IO handlers
│   │   └── utils/          # Helper functions
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API clients
│   │   ├── context/        # Context providers
│   │   └── types/          # TypeScript types
│   └── package.json
└── docs/                   # Documentation
    ├── ARCHITECTURE.md
    ├── API.md
    └── DATABASE_SCHEMA.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get note by ID
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/:id/versions` - Get version history

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag
- `GET /api/tags/:name/notes` - Get notes by tag

### Sharing
- `POST /api/sharing/share` - Share note with user/group
- `GET /api/sharing/shared-with-me` - Get shared notes
- `PUT /api/sharing/:id/permission` - Update sharing permission

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create group
- `POST /api/groups/:id/members` - Add member to group

See [API.md](./docs/API.md) for complete API documentation.

## 🔐 User Roles

- **USER**: Create, edit, tag, and share notes
- **ADMIN**: Manage users, groups, and view system analytics

## 🌟 Key Features Explained

### Real-time Collaboration
- Multiple users can edit the same note simultaneously
- Changes are synced in real-time via WebSocket
- Conflict resolution handles simultaneous edits

### Tagging System
- Assign multiple tags per note
- Filter and search notes by tags
- Color-coded tags for visual organization

### Sharing & Permissions
- Share with individual users or groups
- Set permissions: READ, WRITE, DELETE, ADMIN
- Real-time notifications when notes are shared

### Version History
- Automatic version tracking on each save
- View and restore previous versions
- See who made changes and when

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)

## 🧪 Development

### Backend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open Prisma Studio (database GUI)
```

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Mayur** - Initial work

## 🙏 Acknowledgments

- Prisma for excellent ORM
- Socket.IO for real-time capabilities
- React team for amazing framework

