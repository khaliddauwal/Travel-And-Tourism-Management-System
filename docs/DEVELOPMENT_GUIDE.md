# Development Guide

**Project Lead & System Administrator:** Khalid Auwal Hafiz

## 🏗️ Professional Project Structure

Your Tourism Management System has been reorganized following industry best practices:

### 📁 Directory Structure

```
Tourism-Management-System/
├── 🎨 frontend/                 # React TypeScript Frontend
│   └── tourism-react/          # Main React application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components (Home, Login, etc.)
│       │   ├── services/       # API integration services
│       │   ├── context/        # React context providers
│       │   └── ...
│       ├── public/             # Static assets
│       ├── package.json        # Frontend dependencies
│       └── README.md           # Frontend documentation
│
├── ⚙️ backend/                  # PHP Backend API
│   ├── api/v1/                 # REST API endpoints
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Request middleware
│   │   ├── routes/             # API routes
│   │   └── docs/               # API documentation (Swagger)
│   ├── admin/                  # Admin panel
│   ├── includes/               # Shared PHP libraries
│   ├── config/                 # Configuration files
│   ├── src/                    # PHP models and controllers
│   ├── logs/                   # Application logs
│   └── *.php                   # Main PHP pages
│
├── 🗄️ database/                # Database Management
│   ├── tms.sql                 # Database schema
│   ├── setup-database.php      # Database setup script
│   └── import-database.php     # Database import utility
│
├── 🌐 public/                   # Static Assets (Legacy)
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript files
│   ├── fonts/                  # Font files
│   ├── images/                 # Images and media
│   └── index-new.html          # Legacy HTML template
│
├── 🔧 scripts/                  # Utility Scripts
│   ├── setup.php              # Initial project setup
│   └── currency-manager.php   # Currency management utility
│
├── 📚 docs/                     # Documentation
│   ├── README.md              # Main documentation
│   ├── IMPROVEMENTS.md        # Security improvements
│   ├── REACT_SETUP_GUIDE.md   # React setup guide
│   └── DEVELOPMENT_GUIDE.md   # This file
│
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── composer.json               # PHP dependencies
└── README.md                   # Project overview
```

## 🚀 Development Workflow

### 1. Frontend Development

```bash
# Navigate to frontend
cd frontend/tourism-react

# Install dependencies
npm install

# Start development server
npm start
# Runs on: http://localhost:3000
```

### 2. Backend Development

```bash
# Option 1: Use XAMPP/WAMP
# Place project in htdocs/www folder
# Access: http://localhost/your-project/backend/

# Option 2: PHP Built-in Server
php -S localhost:8000 -t backend/
# Access: http://localhost:8000
```

### 3. Database Setup

```bash
# Run database setup
php database/setup-database.php

# Or import manually
mysql -u root -p < database/tms.sql
```

## 🎯 Key Benefits of New Structure

### ✅ **Separation of Concerns**

- **Frontend**: Pure React app, independent deployment
- **Backend**: PHP API, can be deployed separately
- **Database**: Isolated schema and setup scripts
- **Documentation**: Centralized and organized

### ✅ **Professional Standards**

- Follows industry best practices
- Clear separation between client and server
- Scalable architecture
- Easy to maintain and extend

### ✅ **Development Efficiency**

- **Frontend devs** work in `frontend/` only
- **Backend devs** work in `backend/` only
- **DevOps** uses `scripts/` and `database/`
- **Documentation** centralized in `docs/`

### ✅ **Deployment Ready**

- Frontend can be built and deployed to CDN
- Backend can be deployed to PHP hosting
- Database scripts for easy setup
- Environment configuration separated

## 🔄 Migration from Old Structure

The reorganization maintains all functionality while improving structure:

### What Changed:

- ✅ **React app** moved to `frontend/tourism-react/`
- ✅ **PHP files** organized in `backend/`
- ✅ **Database files** in dedicated `database/` folder
- ✅ **Documentation** centralized in `docs/`
- ✅ **Static assets** in `public/` folder
- ✅ **Utility scripts** in `scripts/` folder

### What Stayed the Same:

- ✅ All React components and functionality
- ✅ All PHP API endpoints and logic
- ✅ Database schema and data
- ✅ Authentication and security features
- ✅ Admin panel functionality

## 🛠️ Development Commands

### Frontend Commands

```bash
cd frontend/tourism-react

# Development
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
npm run lint           # Lint code

# Dependencies
npm install            # Install dependencies
npm update             # Update dependencies
```

### Backend Commands

```bash
# Database
php database/setup-database.php     # Setup database
php database/import-database.php    # Import data

# Utilities
php scripts/setup.php               # Initial setup
php scripts/currency-manager.php    # Manage currencies

# Development
php -S localhost:8000 -t backend/   # Start PHP server
```

## 📝 File Path Updates

If you have any hardcoded paths, update them:

### Old Paths → New Paths

```
tourism-react/          → frontend/tourism-react/
includes/              → backend/includes/
config/                → backend/config/
admin/                 → backend/admin/
api/                   → backend/api/
css/                   → public/css/
js/                    → public/js/
images/                → public/images/
```

## 🔧 IDE Configuration

Update your IDE/editor settings:

### VS Code

- Set workspace folders for `frontend/` and `backend/`
- Configure separate linting for TypeScript and PHP
- Use workspace-specific settings

### PhpStorm/WebStorm

- Mark `frontend/` as JavaScript/TypeScript source
- Mark `backend/` as PHP source
- Configure separate interpreters

## 🚀 Next Steps

1. **Test the reorganized structure**
2. **Update any deployment scripts**
3. **Configure your development environment**
4. **Update team documentation**
5. **Set up CI/CD pipelines for new structure**

---

**Your project is now professionally organized and ready for scalable development! 🎉**
