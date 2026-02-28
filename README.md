# EcoAction - Environmental Volunteering Platform

 built with React Native, Expo, TypeScript, and TanStack Query.

## 🚀 Features
- **Missions**: Discover and filter environmental missions.
- **Participation**: Register and cancel with optimistic UI updates.
- **Profile**: Track your impact and active missions.
- **Offline Support**: Intelligent caching with TanStack Query.

## 🛠 Tech Stack
- **Framework**: Expo (React Native)
- **Language**: TypeScript (Strict Mode)
- **State Management**: TanStack Query (React Query)
- **Styling**: NativeWind (TailwindCSS)
- **Routing**: Expo Router
- **Backend**: JSON-Server (Mock REST API)

## 📂 Project Structure
```
src/
├── app/              # Expo Router screens (file-based routing)
├── components/       # Reusable UI components
├── features/         # Feature-based modules (logic + hooks)
│   ├── missions/     # Mission-related logic
│   └── participations/ # Participation logic
├── services/         # API service layer (axios)
├── context/          # Global state (Auth)
├── types/            # TypeScript interfaces
├── config/           # App configuration
└── utils/            # Helper functions
```

## 🔧 Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Backend (JSON-Server)**
   Open a new terminal and run:
   ```bash
   npm run server
   ```
   This starts the mock API at `http://localhost:3000`.
   *Note: If running on Android Emulator, the app connects to `10.0.2.2:3000` automatically.*

3. **Start Frontend**
   In another terminal:
   ```bash
   npm start
   ```
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Press `w` for Web

## 🧠 Architecture Decisions

### separation of Concerns
- **UI (Components/Screens)**: Purely presentational. They consume hooks.
- **Features (Hooks)**: Encapsulate business logic and state management (React Query).
- **Services (API)**: Handle HTTP requests and data transformation.
- **Context**: Global app state (Auth).

### State Management Strategy
- **TanStack Query**: Used for server state.
  - `staleTime`: 5 minutes. Data is considered fresh for 5 mins to reduce network calls.
  - `gcTime`: 24 hours. Inactive data is kept in memory for offline usage.
  - **Optimistic Updates**: We update the UI immediately when a user registers, then sync with the server. If it fails, we rollback.

### Type Safety
- Strict TypeScript configuration.
- Shared interfaces in `src/types`.
- No `any` type usage allowed.

## 📝 API Endpoints (Mock)
- `GET /missions`: List missions
- `GET /missions/:id`: Mission details
- `POST /participations`: Register
- `DELETE /participations/:id`: Cancel
- `GET /users/:id`: User profile
