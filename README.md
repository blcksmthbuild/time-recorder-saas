# Time Recorder SaaS App

A micro-frontend SaaS application for time tracking with AI agent capabilities, built using Docker containers and module federation.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Running the Application

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd time-recorder-saas-app
   ```

2. **Start all services**

   ```bash
   docker compose up --build -d
   ```

3. **Access the application**
   - Main application: http://localhost
   - Backend API: http://localhost:3000
   - Time Log Plugin: http://localhost:8082
   - AI Agent Plugin: http://localhost:8083

## 🏗️ Architecture

The application consists of 5 Docker containers:

- **core-shell** (Port 80) - Main frontend application
- **fastify-backend** (Port 3000) - Node.js backend API
- **timelog-plugin** (Port 8082) - Time logging micro-frontend
- **ai-agent-plugin** (Port 8083) - AI agent micro-frontend
- **ai-agent-service** (Port 4000) - Python AI service
- **db** (Port 5432) - PostgreSQL database

## 👥 User Management

### Register New Users

**Endpoint:** `POST http://localhost:3000/api/v1/auth/register`

**Example:**

```json
{
  "email": "ai-admin@platform.com",
  "password": "VDxEB89P$$9HFrpQ4MH5",
  "role": "admin"
}
```

**Available roles:**

- `admin` - Full access to all features
- `user` - Standard user access

### Create Entities (Clients/Companies)

**Endpoint:** `POST http://localhost:3000/api/v1/auth/entities`

**Example:**

```json
{
  "name": "Helixsoft"
}
```

> **Note:** If there are no entities in the database, the entity select page will redirect to the dashboard.

## 🔌 Plugin Registration

The application uses micro-frontend architecture with module federation. You need to register plugins before they can be used.

**Endpoint:** `POST http://localhost:3000/api/v1/registry/plugins`

### Register AI Agent Plugin

```json
{
  "key": "aiAgent",
  "name": "AI Assistant",
  "remoteUrl": "http://localhost:8083/dist/assets/remoteEntry.js",
  "rolesAllowed": ["admin", "user"]
}
```

### Register Time Log Plugin

```json
{
  "key": "timeLog",
  "name": "Time Log Plugin",
  "remoteUrl": "http://localhost:8082/dist/assets/remoteEntry.js",
  "rolesAllowed": ["admin", "user"]
}
```

## 🛠️ Development

### Project Structure

```
time-recorder-saas-app/
├── frontend-core/          # Main shell application
├── timelog-plugin/        # Time logging micro-frontend
├── ai-agent-plugin/       # AI agent micro-frontend
├── time-log-backend/       # Node.js backend API
├── ai-agent-service/      # Python AI service
└── docker-compose.yml     # Docker orchestration
```

### Environment Variables

The application uses the following environment variables:

- `GEMINI_API_KEY` - Google Gemini API key for AI functionality
- `MONDAY_API_KEY` - Monday.com API key for project management
- `MONDAY_PROJECT_BOARD_ID` - Monday.com board ID
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret

### Rebuilding Services

To rebuild specific services:

```bash
# Rebuild all services
docker compose up --build -d

# Rebuild specific services
docker compose up --build -d ai-agent-plugin timelog-plugin
```

## 🔧 Troubleshooting

### CORS Issues

If you encounter CORS errors when loading micro-frontends, ensure the nginx configurations in the plugin directories have proper CORS headers configured.

### Database Issues

If the database connection fails, check that the PostgreSQL container is running and the connection string is correct.

### Plugin Loading Issues

Ensure plugins are properly registered in the backend registry before trying to access them in the frontend.

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/entities` - Create new entity

### Plugin Registry Endpoints

- `POST /api/v1/registry/plugins` - Register new plugin
- `GET /api/v1/registry/plugins` - List registered plugins

### Time Log Endpoints

- `POST /api/v1/timelog/log-time` - Log time entry
- `GET /api/v1/timelog/report` - Get time report
- `GET /api/v1/timelog/reports/top-project` - Get top project summary

### AI Agent Endpoints

- `POST /chat` - Chat with AI agent (on port 4000)

## 🚨 Important Notes

1. **Plugin Registration**: Always register plugins before using them
2. **Entity Creation**: Create at least one entity before users can access the dashboard
3. **API Keys**: Ensure all required API keys are configured in the environment
4. **Ports**: Make sure all required ports (80, 3000, 4000, 8082, 8083, 5432) are available

## ⚠️ Known Issues

### Monday.com Integration

- **Status**: Not working - Monday.com access issues encountered during development
- **Impact**: AI agent cannot create projects or tasks in Monday.com
- **Workaround**: The AI agent will still respond but Monday.com operations will fail

### Email Service

- **Status**: Disabled - Twilio/SendGrid account was shut down
- **Impact**: Email notifications and reports cannot be sent
- **Note**: The email logic is implemented and ready, just needs a valid email service API key

### AI Agent:

- **Satus**: Logging works. Other tools are not 100% configured and ready.

### Missing Features

- Email notifications for time log reports
- Monday.com project and task creation via AI agent
- Email-based user registration confirmations
