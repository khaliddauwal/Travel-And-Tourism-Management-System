# Tourism Management System

A modern, full-stack tourism management system built with React (TypeScript) frontend and PHP API backend.

**Project Lead & System Administrator:** Khalid Auwal Hafiz

## 🏗️ Project Structure

```
Tourism-Management-System/
├── frontend/                    # React TypeScript Frontend
│   └── tourism-react/          # Main React application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   ├── services/       # API services
│       │   ├── context/        # React context providers
│       │   └── ...
│       ├── public/             # Static assets
│       ├── package.json        # Frontend dependencies
│       └── README.md           # Frontend documentation
│
├── backend/                     # PHP Backend API
│   ├── api/                    # REST API endpoints
│   │   └── v1/                 # API version 1
│   │       ├── controllers/    # Business logic
│   │       ├── middleware/     # Request middleware
│   │       ├── routes/         # API routes
│   │       └── docs/           # API documentation
│   ├── admin/                  # Admin panel
│   ├── includes/               # Shared PHP libraries
│   ├── config/                 # Configuration files
│   ├── src/                    # PHP models and controllers
│   ├── logs/                   # Application logs
│   └── *.php                   # Main PHP pages
│
├── database/                    # Database related files
│   ├── tms.sql                 # Database schema
│   ├── setup-database.php      # Database setup script
│   └── import-database.php     # Database import utility
│
├── public/                      # Static assets (legacy)
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript files
│   ├── fonts/                  # Font files
│   └── images/                 # Images and media
│
├── scripts/                     # Utility scripts
│   ├── setup.php              # Initial setup
│   └── currency-manager.php   # Currency management
│
├── docs/                        # Documentation
│   ├── README.md              # Main documentation
│   ├── IMPROVEMENTS.md        # Security improvements
│   └── REACT_SETUP_GUIDE.md   # React setup guide
│
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── composer.json               # PHP dependencies
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- PHP 7.4+ with MySQL
- XAMPP/WAMP/LAMP stack

### Frontend Setup

```bash
cd frontend/tourism-react
npm install
npm start
```

Frontend runs on: http://localhost:3000

### Backend Setup

1. Copy `.env.example` to `.env` and configure database
2. Import database: `php database/setup-database.php`
3. Start PHP server or use XAMPP

### Full Setup

See `docs/REACT_SETUP_GUIDE.md` for detailed instructions.

## 🎯 Features

### Frontend (React)

- ✅ Modern React 19 with TypeScript
- ✅ Professional UI with Nigerian tourism theme
- ✅ Responsive design with animations
- ✅ User authentication and dashboard
- ✅ Package browsing and booking
- ✅ API integration with backend

### Backend (PHP)

- ✅ RESTful API with proper routing
- ✅ JWT authentication
- ✅ Admin panel for management
- ✅ Database abstraction layer
- ✅ Security features (CSRF, validation)
- ✅ Logging and error handling

## 🛠️ Technology Stack

**Frontend:**

- React 19 with TypeScript
- React Router for navigation
- Axios for API calls
- Context API for state management

**Backend:**

- PHP 7.4+ with PDO
- MySQL database
- RESTful API architecture
- JWT authentication

## 📚 Documentation

- **Main Documentation**: `docs/README.md`
- **React Setup Guide**: `docs/REACT_SETUP_GUIDE.md`
- **Security Improvements**: `docs/IMPROVEMENTS.md`
- **API Documentation**: `backend/api/v1/docs/swagger.yaml`

## 🔧 Development

### Running Frontend

```bash
cd frontend/tourism-react
npm start
```

### Running Backend

Use XAMPP or start PHP built-in server:

```bash
php -S localhost:8000 -t backend/
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for Nigerian Tourism - Northern Heritage Focus**  
**Project Lead:** Khalid Auwal Hafiz
