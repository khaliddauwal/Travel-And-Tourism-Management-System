<<<<<<< HEAD
# TourismNG React Frontend

A modern, professional React frontend for the Tourism Management System, built with TypeScript and integrated with the PHP API backend.

**Project Lead & System Administrator:** Khalid Auwal Hafiz

## 🚀 Features

- **Modern React Architecture**: Built with React 19, TypeScript, and React Router
- **Professional UI**: Matches the beautiful design from your HTML version
- **API Integration**: Seamlessly connects to your PHP backend API
- **Authentication**: Complete login/register system with session management
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Nigerian Focus**: Naira pricing, Nigerian destinations with Northern heritage emphasis, and cultural elements

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management
- **CSS3** with custom properties and grid/flexbox

## 📦 Installation

1. Navigate to the React app directory:

```bash
cd Tourism-Management-System-main/tourism-react
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🔧 Configuration

### API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost/Tourism-Management-System-main/api/v1";
```

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost/Tourism-Management-System-main/api/v1
REACT_APP_SITE_NAME=TourismNG
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx      # Navigation header
│   └── Footer.tsx      # Site footer
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication state
├── pages/              # Page components
│   ├── Home.tsx        # Homepage with featured packages
│   ├── Packages.tsx    # All packages with search/filter
│   ├── PackageDetails.tsx # Individual package details
│   ├── Login.tsx       # User login
│   ├── Register.tsx    # User registration
│   ├── Dashboard.tsx   # User dashboard
│   ├── About.tsx       # About page
│   └── Contact.tsx     # Contact form
├── services/           # API services
│   └── api.ts          # API client and types
├── App.tsx             # Main app component
├── App.css             # Global styles
└── index.tsx           # App entry point
```

## 🎨 Design Features

- **Brand Colors**: Professional blue (#3F84B1) and green (#34ad00) theme
- **Typography**: Google Fonts (Open Sans, Roboto Condensed, Oswald)
- **Responsive Grid**: CSS Grid and Flexbox for modern layouts
- **Animations**: Smooth transitions and hover effects
- **Nigerian Elements**: Naira currency, diverse destinations with Northern heritage focus, Islamic and traditional cultural icons

## 🔌 API Integration

The app integrates with your PHP API endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- `GET /packages` - List packages with pagination/search
- `GET /packages/{id}` - Get package details
- `GET /packages/featured` - Get featured packages

## 📱 Pages Overview

### Home Page

- Hero banner with call-to-action
- Special offers section
- Featured packages grid
- Why choose us features

### Packages Page

- All packages with search and filter
- Package type filtering
- Responsive grid layout
- Direct booking links

### Package Details

- Full package information
- Image gallery
- Booking form
- Pricing in Naira
- What's included section

### Authentication

- Login/Register forms
- Form validation
- Error handling
- Session management

### Dashboard

- User profile information
- Quick actions
- Recent activity
- Booking management (future)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Web Server

1. Build the app
2. Copy `build/` contents to your web server
3. Configure your web server to serve `index.html` for all routes
4. Update API URLs for production

### Apache Configuration

Add to `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🔒 Security Features

- CSRF protection via API
- Session-based authentication
- Input validation
- XSS prevention
- Secure API communication

## 🎯 Future Enhancements

- [ ] Booking management system
- [ ] Payment integration
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Admin panel integration
- [ ] PWA features
- [ ] Push notifications

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if PHP backend is running
   - Verify API URL in `src/services/api.ts`
   - Check CORS configuration in PHP

2. **Authentication Issues**
   - Ensure session cookies are enabled
   - Check PHP session configuration
   - Verify API endpoints are working

3. **Build Errors**
   - Run `npm install` to update dependencies
   - Check TypeScript errors
   - Verify all imports are correct

## 📞 Support

For support with the React frontend:

- Check the browser console for errors
- Verify API responses in Network tab
- Ensure PHP backend is properly configured

## 🎉 Success!

Your React frontend is now complete and professional! It features:

- ✅ Modern React architecture
- ✅ Beautiful, responsive design
- ✅ Full API integration
- ✅ Authentication system
- ✅ Nigerian tourism focus
- ✅ Professional UI/UX

Run `npm start` to see your amazing Tourism Management System in action!
=======
# Travel-And-Tourism-Management-System
>>>>>>> 835d8dc7e8fff805f40485cf6d8c729622ed8ede
