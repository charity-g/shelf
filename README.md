# Shelf App 👋

This is an [Expo](https://expo.dev) project with a Snowflake backend API.

## Project Structure

- **Expo App**: React Native app using Expo Router (file-based routing)
- **Backend API**: Express.js server connecting to Snowflake (`backend/` folder)

## Quick Start

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example` in backend folder):
   ```bash
   cp .env.example .env
   ```

4. Fill in your Snowflake credentials in `backend/.env`:
   - `SNOWFLAKE_ACCOUNT`: Your Snowflake account identifier
   - `SNOWFLAKE_USER`: `SKINCARE_SERVICE`
   - `SNOWFLAKE_PRIVATE_KEY`: Contents of your `snowflake_rsa_key.pem` file
   - `SNOWFLAKE_ROLE`: `SKINCARE_APP_ROLE`
   - `SNOWFLAKE_WAREHOUSE`: `COMPUTE_WH`
   - `SNOWFLAKE_DATABASE`: `DAVID`
   - `SNOWFLAKE_SCHEMA`: `PUBLIC`
   - `API_KEY` (optional): For API authentication

5. Start the backend server:
   ```bash
   npm run dev
   ```
   
   The backend will run on `http://localhost:3001` by default.

### 2. Expo App Setup

1. Install dependencies (from project root):
   ```bash
   npm install
   ```

2. Set environment variables (create `.env` in project root or use Expo's config):
   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
   # Optional:
   # EXPO_PUBLIC_API_KEY=your_api_key_here
   ```

3. Start the Expo app:
   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

**Note**: For iOS Simulator or Android Emulator, make sure to use `http://localhost:3001` for the API URL. For physical devices or Expo Go, use your computer's local IP address (e.g., `http://192.168.1.100:3001`).

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
