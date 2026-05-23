# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application for UIKA Bogor's TIAS (Teknologi Informasi Akademik Sistem) platform. The app supports both student (Mahasiswa) and lecturer (Dosen) roles with features including attendance, course management, gamification, and Computer-Based Testing (CBT).

**Key Dependencies:**
- React Native 0.75.3
- React Navigation (stack & bottom tabs)
- TanStack Query for data fetching
- Zustand for state management
- Axios for API calls
- React Native Vision Camera (face detection attendance)

## Development Commands

### Running the app
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run linter
npm run lint

# Run tests
npm test
```

### Building Android
```bash
# Create bundle before building
npm run android-build-bundle

# Build debug APK (Windows)
npm run android-build-debug

# Build debug APK (Linux/Mac)
npm run android-build-debug-linux

# Build release APK (Windows)
npm run android-build-release-windows

# Build release APK (Linux/Mac)
npm run android-build-release-linux

# Build AAB for Play Store
npm run android-build-aab
```

## Architecture

### Navigation Structure

The app uses a role-based navigation system that conditionally renders different bottom tab layouts:

- **Root Navigation** (`src/navigation/navigate.tsx`): Handles authentication flow, shows `Login` or `BottomTabsComponent` based on auth state
- **Bottom Tabs** (`src/navigation/bottom-tabs.tsx`): Renders `MahasiswaComponent` or `DosenComponent` based on `user.role`
- **Stack Navigators**: Each bottom tab item has its own stack navigator in `src/navigation/stack/` or `src/navigation/`

Both roles share most tabs (Home, Gamifikasi, Absensi, Kuliah, CBT, Profile) but with different configurations:
- Students: Standard home with challenges
- Lecturers: Dosen-specific home with recommendations

### State Management

**Global State (Zustand):** `src/store/auth.ts`
- Persisted to AsyncStorage
- Contains: `token`, `user`, `auth`, `rememberMe`, `cbt_token`, `cbt_user_id`
- Used for authentication and user context throughout the app

**Server State (TanStack Query):** Used in `src/services/` for API calls
- Services are organized by feature (auth, absen, cbt, home, perkuliahan)
- Custom hooks pattern (e.g., `useCbtLogin`, `useExamList`, `useSubmitExam`)

### API Configuration

Three separate Axios instances for different backends:

1. **axios-tias** (`src/config/axios-tias.ts`): Main TIAS API
   - Base URL: `https://api-tias.ti.ft.uika-bogor.ac.id/`
   - Handles: auth, attendance, courses, home content

2. **axios-cbt** (`src/config/axios-cbt.ts`): CBT/Exam API
   - Base URL: `https://u-talent.uika-bogor.ac.id/cbt-api/`
   - Auto-injects CBT token from Zustand store
   - Auto-clears token on 401 responses

3. **axios-ti** (`src/config/axios-ti.ts`): Additional TI services (if exists)

All instances have request/response interceptors for logging and error handling.

### Feature Organization

The codebase uses a hybrid organization approach:

- **Legacy views:** `src/views/` - screens organized by feature
- **New features:** `src/features/` - contains screens, services, and types co-located
  - Example: `src/features/cbt/` contains CBT screens, services, and types
  - Example: `src/features/attendance-face/` contains face recognition attendance

When adding new features, prefer the `src/features/` pattern for better encapsulation.

### CBT (Computer-Based Test) Module

The CBT module implements a dual-authentication flow:

1. User logs into main app with TIAS credentials (gets main `token`)
2. When accessing CBT, performs SSO login to CBT API (gets `cbt_token`)
3. Both tokens stored in Zustand and persisted separately
4. CBT token auto-injected via axios-cbt interceptor
5. On 401 from CBT API, `cbt_token` cleared and SSO repeated

**CBT Flow:**
- Entry → Token validation → Exam list → Exam session → Submit → History/Results
- Screens can be in `src/views/` or `src/features/cbt/` (transitioning)

### Attendance Features

Two attendance modes:
- **QR Code scanning:** Standard barcode-based check-in
- **Face recognition:** Uses Vision Camera with face detector for biometric attendance

## Code Patterns

### Service Layer Pattern

Services return typed responses and use async/await:

```typescript
export async function login(data: any): Promise<any> {
  const response = await axios.post('auth/login', data);
  return response.data;
}
```

For React Query hooks:

```typescript
export const useExamList = () => {
  return useQuery({
    queryKey: ['cbt', 'exams'],
    queryFn: () => getCbtExams(),
  });
};
```

### Authentication Check Pattern

Components check auth state from Zustand:

```typescript
const { auth, token, user } = useTokenStore();
const isLoggedIn = Boolean(auth && token && (user?.npm || user?.email));
```

### Multi-part Form Submission

For file uploads (e.g., exam answers with attachments):

```typescript
const formData = new FormData();
formData.append('exam_id', examId);
formData.append('file', fileObject);

await axios.post('endpoint', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

## Platform-Specific Notes

### Android Build

- Gradle files in `android/` directory
- Build outputs to `android/app/build/outputs/apk/`
- Before building release, ensure signing config is set up in `android/app/build.gradle`

### iOS Setup

Requires Xcode and CocoaPods:

```bash
cd ios
pod install
cd ..
npm run ios
```

## Debugging

- Metro bundler logs to console
- Axios interceptors log all requests/responses with `[AXIOS-TIAS]` or `[AXIOS-CBT]` prefix
- Use React Native Debugger or Flipper for advanced debugging
- Check AsyncStorage for persisted auth state if login issues occur

## Testing

- Jest configured for unit tests
- Test files should be co-located with components or in `__tests__` directories
- Run `npm test` to execute test suite
