# LMS Frontend

A modern React frontend for the Learning Management System built with Redux Toolkit, RTK Query, and Module Federation.

## 🚀 Features

- **Modern React**: Built with React 18+ and functional components
- **State Management**: Redux Toolkit with RTK Query for efficient data fetching
- **Module Federation**: Webpack 5 module federation for micro-frontend architecture
- **Responsive Design**: Mobile-first design with modern CSS
- **Type Safety Ready**: Structured for easy TypeScript migration
- **Performance Optimized**: Code splitting, lazy loading, and caching strategies

## 📁 Project Structure

```
frontend/
├── src/
│   ├── features/           # Feature-based modules
│   │   ├── dashboard/      # Dashboard feature
│   │   ├── skillMap/       # Skill mapping feature
│   │   ├── learning/       # Learning materials feature
│   │   ├── teaching/       # Teaching tools feature
│   │   ├── collaboration/  # Collaboration tools feature
│   │   └── analytics/      # Analytics and reporting feature
│   ├── shared/             # Shared components and utilities
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   ├── store/              # Redux store configuration
│   │   └── slices/         # Redux slices
│   ├── services/           # API services with RTK Query
│   └── workers/            # Service workers and web workers
├── public/                 # Static assets
└── webpack.config.js       # Webpack configuration with Module Federation
```

## 🛠️ Tech Stack

- **Framework**: React 18
- **State Management**: Redux Toolkit + RTK Query
- **Bundler**: Webpack 5 with Module Federation
- **Styling**: CSS-in-JS (styled-jsx)
- **Routing**: React Router v6
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learning-management-system/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.development .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001

# Module Federation Remote URLs
REACT_APP_DASHBOARD_URL=http://localhost:3001/remoteEntry.js
REACT_APP_SKILL_MAP_URL=http://localhost:3002/remoteEntry.js
REACT_APP_LEARNING_URL=http://localhost:3003/remoteEntry.js
REACT_APP_TEACHING_URL=http://localhost:3004/remoteEntry.js
REACT_APP_COLLABORATION_URL=http://localhost:3005/remoteEntry.js
REACT_APP_ANALYTICS_URL=http://localhost:3006/remoteEntry.js
```

### Module Federation

This application is configured as a Module Federation host that can consume remote modules:

- **Dashboard**: User dashboard and overview
- **Skill Map**: Skill tracking and progression
- **Learning**: Course consumption and progress
- **Teaching**: Course creation and management
- **Collaboration**: Real-time collaboration tools
- **Analytics**: Learning analytics and reporting

## 🏗️ Architecture

### State Management

The application uses Redux Toolkit with the following structure:

- **Auth Slice**: User authentication and session management
- **UI Slice**: UI state (theme, sidebar, notifications, etc.)
- **API Slice**: RTK Query endpoints for data fetching

### Feature Structure

Each feature is organized as a self-contained module:

```
features/featureName/
├── index.jsx           # Main feature component
├── components/         # Feature-specific components
├── hooks/             # Feature-specific hooks
├── services/          # Feature-specific API services
└── utils/             # Feature-specific utilities
```

### Shared Resources

Common functionality is organized in the `shared` directory:

- **Components**: Reusable UI components (Layout, Header, Sidebar, etc.)
- **Hooks**: Custom hooks (useAuth, useApi, etc.)
- **Utils**: Helper functions and utilities

## 🔌 API Integration

The frontend integrates with the backend through:

- **REST API**: Standard HTTP requests via RTK Query
- **WebSocket**: Real-time features via Socket.io
- **Authentication**: JWT-based authentication

### RTK Query Services

- `authApi`: Authentication endpoints
- `userApi`: User management
- `courseApi`: Course operations
- `collaborationApi`: Real-time collaboration

## 🎨 Styling

The application uses a modern CSS approach:

- **CSS-in-JS**: styled-jsx for component-scoped styles
- **Utility Classes**: Common utility classes for spacing, layout
- **Responsive Design**: Mobile-first responsive design
- **Theme Support**: Light/dark theme switching

## 🧪 Testing

Testing strategy includes:

- **Unit Tests**: Component and function testing
- **Integration Tests**: Feature integration testing
- **E2E Tests**: End-to-end user flow testing

Run tests with:
```bash
npm test
```

## 📦 Building for Production

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🚀 Deployment

The application can be deployed to various platforms:

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: AWS CloudFront, Azure CDN
- **Container**: Docker with nginx

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the [Issues](../../issues) section
- Read the [Documentation](../docs/)
- Contact the development team

---

**Happy Learning! 🎓**