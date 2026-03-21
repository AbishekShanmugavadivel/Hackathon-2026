# 🏆 CODIX Hackathon Registration System

A production-ready, full-stack MERN application for hackathon team registration with a premium CODIX-themed UI featuring gold and blue gradients, glassmorphism effects, and responsive design.

## 🎨 Features

### 🧾 Student Registration
- Dynamic team member management (2-4 members)
- Comprehensive form validation
- Project details with GitHub integration
- Domain selection (AI, Web, App, Cybersecurity)
- Success animations and toast notifications

### 🔐 Admin Panel
- JWT-based authentication
- Protected dashboard with statistics
- Team management (view, search, filter, delete)
- CSV export functionality
- Real-time statistics and analytics

### 🎨 Premium UI/UX
- CODIX gold theme (#FFD700) with dark blue (#0A192F)
- Glassmorphism and glow effects
- Fully responsive design (Mobile, Tablet, Desktop)
- Smooth animations with Framer Motion
- Modern components with Tailwind CSS

### 🗄 Backend Features
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- Password hashing with bcrypt
- Rate limiting and security middleware
- Comprehensive error handling

## 📁 Project Structure

```
hackthon-event/
├── client/                 # React Frontend
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                # Node.js Backend
│   ├── config/           # Database and JWT config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth and error middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper utilities
│   └── server.js        # Server entry point
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackthon-event
```

### 2. Backend Setup
```bash
cd server
npm install
```

#### Environment Variables
Create a `.env` file in the server directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Credentials (change these in production)
ADMIN_EMAIL=admin@hackathon.com
ADMIN_PASSWORD=admin123456
```

#### Start Backend Server
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:3000/admin/login

## 🔐 Default Admin Credentials
- **Email**: admin@hackathon.com
- **Password**: admin123456

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile
- `POST /api/auth/logout` - Logout

### Teams
- `POST /api/teams/register` - Register new team
- `GET /api/teams` - Get all teams (admin only)
- `GET /api/teams/:id` - Get team by ID (admin only)
- `DELETE /api/teams/:id` - Delete team (admin only)
- `GET /api/teams/statistics` - Get statistics (admin only)

## 🎨 UI Components

### Pages
- **Home** - Hero section with event information
- **Register** - Team registration form
- **Rules** - Hackathon rules and guidelines
- **Criteria** - Judging criteria with progress bars
- **Admin Login** - Secure admin authentication
- **Admin Dashboard** - Team management interface

### Components
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Informational footer with links
- **FormInput** - Reusable form input with validation
- **Loader** - Animated loading component
- **ProtectedRoute** - Authentication wrapper

## 🔧 Technologies Used

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting
- **Validator** - Input validation

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy automatically

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Configure network access
3. Create database user
4. Update connection string in `.env`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- Protected admin routes
- Helmet.js security headers

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📟 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🎯 Theme Customization

The CODIX theme uses:
- **Primary Gold**: #FFD700
- **Secondary Blue**: #0A192F
- **Dark Background**: #020817
- **Light Text**: #f8fafc

Custom CSS classes are defined in `src/index.css` for:
- Glassmorphism effects
- Gold glow animations
- Gradient backgrounds
- Custom form inputs

## 🧪 Testing

### Manual Testing Checklist
- [ ] Team registration form validation
- [ ] Admin login functionality
- [ ] Team management in dashboard
- [ ] Search and filter functionality
- [ ] CSV export feature
- [ ] Responsive design on all devices
- [ ] Error handling and toast notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Vercel and Render for hosting platforms

## 📞 Support

For any issues or questions, please:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include screenshots if applicable

---

**Built with ❤️ for the CODIX Hackathon 2024**
