# RBAC Configuration Tool

A full-stack Role-Based Access Control (RBAC) configuration tool built with Next.js, TypeScript, and Supabase.

## What is RBAC? (Explained for a Kid)

Think of RBAC like a school with different jobs. Teachers can grade papers, principals can hire teachers, and students can only do homework. Everyone has a "role" (like teacher or student) and each role has special "permissions" (things they're allowed to do). This tool helps grown-ups set up these rules for computer programs!
## Features

- **User Authentication**: Secure login system using Supabase Auth
- **Permission Management**: Create, read, update, and delete permissions
- **Role Management**: Full CRUD operations for user roles
- **Role-Permission Assignment**: Visual interface to assign permissions to roles
- **Natural Language Configuration**: AI-powered command interface (demo implementation)
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components
- **Real-time Updates**: Instant UI updates when managing RBAC settings

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Supabase (Database, Authentication, APIs)
- **UI**: shadcn/ui components with Tailwind CSS
- **Deployment**: Vercel

## Database Schema

The application uses the following database tables:

- `permissions`: Individual permissions (e.g., can_edit_articles)
- `roles`: User roles (e.g., Administrator, Editor)
- `role_permissions`: Junction table linking roles to permissions
- `user_roles`: Junction table linking users to roles

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rbac-configuration-tool
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
```

5. Run the database migrations in your Supabase project (copy the SQL from `supabase/migrations/create_rbac_schema.sql`)

6. Start the development server:
```bash
npm run dev
```

## Usage

1. **Authentication**: Sign up or log in to access the tool
2. **Permissions Tab**: Create and manage individual permissions
3. **Roles Tab**: Create and manage user roles
4. **Role-Permissions Tab**: Assign permissions to roles using the visual interface
5. **Natural Language Tab**: Use plain English commands to configure RBAC (demo feature)

## Test Credentials

For testing purposes, you can create an account through the sign-up page, or use these test credentials if provided:

- Email: [Will be provided]
- Password: [Will be provided]

## Deployment

The application is deployed on Vercel. Any pushes to the main branch will automatically trigger a new deployment.

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/              # Reusable UI components
├── lib/                  # Utility functions and services
│   ├── services/        # API service functions
│   ├── types/           # TypeScript type definitions
│   └── supabase/        # Supabase client configuration
├── supabase/            # Database migrations
└── hooks/               # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
