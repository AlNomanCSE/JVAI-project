# JVAI Healthcare Chat Application

A full-stack healthcare chat application with AI integration, built with Next.js 14, TypeScript, Redux Toolkit, and RTK Query. This application provides user authentication, profile management, and real-time chat with multiple AI healthcare models.

## 🚀 Features

### Authentication & User Management
- ✅ **User Sign Up** - Create new accounts with email/password
- ✅ **User Sign In** - Secure authentication with JWT tokens
- ✅ **User Profile** - View and display complete user information
- ✅ **Profile Update** - Edit name and subscription status (PATCH API)
- ✅ **Logout** - Secure session termination

### AI Chat System
- ✅ **Multiple AI Models** - Choose from 4 healthcare AI assistants:
  - **Chartwright** - Healthcare documentation assistant
  - **TranscriptX** - Medical transcription specialist
  - **Redactify** - Document redaction and privacy
  - **Validify** - Data validation and verification
- ✅ **Real-time Messaging** - Send and receive messages instantly
- ✅ **Chat Management** - Create, rename, and delete conversations
- ✅ **Chat History** - View all past conversations
- ✅ **Auto-save** - Conversations saved automatically

### UI/UX Features
- 🎨 **Modern Dark Theme** - Professional healthcare interface
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Fast & Efficient** - Optimized with RTK Query caching
- 🔄 **Loading States** - Visual feedback for all actions
- ✨ **Smooth Animations** - Professional transitions and effects

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **API Integration:** RTK Query
- **Styling:** Tailwind CSS
- **Authentication:** JWT Tokens with localStorage persistence
- **API Base URL:** `https://lbserver.clintechso.com/api/`

## 📁 Project Structure

```
jvai-auth-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── proxy/
│   │   │       └── [...path]/
│   │   │           └── route.ts          # API proxy to handle CORS
│   │   ├── chat/
│   │   │   └── page.tsx                  # Chat interface
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # User dashboard
│   │   ├── signin/
│   │   │   └── page.tsx                  # Sign in page
│   │   ├── signup/
│   │   │   └── page.tsx                  # Sign up page
│   │   ├── layout.tsx                    # Root layout with providers
│   │   ├── page.tsx                      # Home/landing page
│   │   └── globals.css                   # Global styles
│   └── lib/
│       ├── features/
│       │   └── auth/
│       │       ├── authApi.ts            # RTK Query API endpoints
│       │       ├── authSlice.ts          # Auth state management
│       │       └── AuthInitializer.tsx   # Token hydration component
│       ├── hooks.ts                      # Typed Redux hooks
│       ├── store.ts                      # Redux store configuration
│       └── StoreProvider.tsx             # Client-side Redux provider
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlNomanCSE/JVAI-project
   cd jvai-auth-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📖 API Documentation

### Base URL
```
https://lbserver.clintechso.com/api/
```

### Authentication Endpoints

#### Sign Up
```http
POST /authentication_app/signup/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

#### Sign In
```http
POST /authentication_app/signin/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourPassword123"
}

Response:
{
  "accessToken": "...",
  "idToken": "...",
  "message": "Logged in successfully"
}
```

#### Get User Profile
```http
GET /authentication_app/user_profile/
Authorization: Bearer {accessToken}
```

#### Update User Profile
```http
PATCH /authentication_app/user_profile/
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "John Doe",
  "subscription_status": "active"
}
```

#### Logout
```http
POST /authentication_app/logout/
Authorization: Bearer {accessToken}
```

### Chat Endpoints

#### Create Chat
```http
POST /chat/create_chat/
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "model_name": "Chartwright",
  "message_content": "Hello"
}

Response:
{
  "Message": "Successfully created chat.",
  "data": {
    "id": 103,
    "title": "Untitled Chat",
    "messages": [...]
  }
}
```

#### Add Message to Chat
```http
POST /chat/add_message_to_chat/
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "chat_id": 103,
  "model_name": "Chartwright",
  "message_content": "How can I help you?"
}
```

#### Get User's Chat List
```http
GET /chat/get_users_chat_list/
Authorization: Bearer {accessToken}
```

#### Get Chat Content
```http
GET /chat/get_a_chat_content/{chat_id}/
Authorization: Bearer {accessToken}
```

#### Update Chat Title
```http
PATCH /chat/update_chat_title/{chat_id}/
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "New Chat Title"
}
```

#### Delete Chat
```http
DELETE /chat/delete_chat/{chat_id}/
Authorization: Bearer {accessToken}
```

## 💡 Usage Guide

### First Time Setup

1. **Sign Up**
   - Go to `/signup`
   - Enter your email and password (min 8 characters)
   - Confirm password
   - Click "Sign up"

2. **Sign In**
   - Go to `/signin`
   - Enter your credentials
   - Click "Sign in"

3. **View Dashboard**
   - After signing in, you'll be redirected to `/dashboard`
   - View your profile information
   - Click "Edit Profile" to update your details

### Using the Chat

1. **Access Chat**
   - From dashboard, click the "Chat" button
   - Or navigate directly to `/chat`

2. **Select AI Model**
   - Choose from: Chartwright, TranscriptX, Redactify, or Validify
   - Each model specializes in different healthcare tasks

3. **Start Chatting**
   - Type your message in the input box at the bottom
   - Press Enter or click the send button
   - A new chat will be created automatically

4. **Manage Chats**
   - View all chats in the left sidebar
   - Click on any chat to view its messages
   - Hover over a chat to rename or delete it
   - Click "New Chat" to start a fresh conversation

## 🔐 State Management

### Redux Store Structure

```typescript
{
  auth: {
    token: string | null,           // JWT access token
    refreshToken: string | null,    // JWT refresh token
    isAuthenticated: boolean        // Auth status
  },
  authApi: {
    queries: {...},                 // RTK Query cache
    mutations: {...}                // RTK Query mutations
  }
}
```

### RTK Query Hooks

**Authentication:**
- `useSignUpMutation()` - Register new user
- `useSignInMutation()` - Authenticate user
- `useGetUserProfileQuery()` - Fetch user profile
- `useUpdateUserProfileMutation()` - Update user profile
- `useLogoutMutation()` - Logout user

**Chat:**
- `useCreateChatMutation()` - Create new chat
- `useAddMessageToChatMutation()` - Send message
- `useGetUserChatListQuery()` - Get all chats
- `useGetChatContentQuery()` - Get chat messages
- `useUpdateChatTitleMutation()` - Rename chat
- `useDeleteChatMutation()` - Delete chat

## 🎨 Design Decisions

### CORS Handling
- Implemented Next.js API proxy at `/api/proxy/[...path]`
- Forwards requests to external API to bypass CORS restrictions
- Maintains security by keeping tokens server-side

### Token Management
- Tokens stored in localStorage for persistence
- Auto-hydration on app load via `AuthInitializer`
- Automatic token inclusion in all authenticated requests
- Secure logout clears both Redux state and localStorage

### UI/UX Patterns
- Dark theme optimized for healthcare professionals
- Loading states for all async operations
- Error handling with user-friendly messages
- Responsive design mobile-first approach
- Smooth transitions and animations

## 🐛 Troubleshooting

### Common Issues

**Issue:** CORS errors
- **Solution:** Ensure you're using the proxy route (`/api/proxy/...`)

**Issue:** Token not persisting
- **Solution:** Check localStorage in DevTools, clear site data and re-login

**Issue:** Messages not displaying
- **Solution:** Check browser console for API response structure

**Issue:** Build errors
- **Solution:** Delete `.next` folder and `node_modules`, reinstall dependencies

### Debug Mode

Enable debug logging by checking the browser console:
```javascript
// Look for logs starting with:
"===== CHAT CONTENT DEBUG ====="
"Chat List:"
"POST Response - Data:"
```

## 📝 Environment Variables

Create a `.env.local` file (optional):

```env
# API Base URL (already configured in code)
NEXT_PUBLIC_API_BASE_URL=https://lbserver.clintechso.com/api/
```

## 🧪 Testing

The application can be tested with the provided Postman collection:
- Import `ALI HEALTHCARE.postman_collection.json`
- Set the base URL to `https://lbserver.clintechso.com/api/`
- Test all API endpoints

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy with default settings

### Other Platforms

```bash
npm run build
npm start
```

Deploy the `.next` folder to your hosting platform.

## 📄 License

This project was created for the JVAI React.js Developer position technical assessment.

## 👨‍💻 Author

**Developed by:** [Your Name]
**Date:** October 2025
**Purpose:** JVAI Technical Assessment

## 🙏 Acknowledgments

- Join Venture AI (JVAI) for the opportunity
- Next.js team for the excellent framework
- Redux team for Redux Toolkit and RTK Query
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review API logs in browser console
3. Contact the development team

---

**Built with ❤️ for Healthcare Innovation**