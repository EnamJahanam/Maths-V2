# Math Trainer 🧠✨

A comprehensive educational application built with **React, TypeScript, and Supabase**. It's designed to run in any modern web browser to monitor and improve students' mathematics skills through timed quizzes and progress tracking.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

---

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started: Supabase Setup](#getting-started-supabase-setup)
  - [Step 1: Create a Supabase Project](#step-1-create-a-supabase-project)
  - [Step 2: Run SQL Scripts](#step-2-run-sql-scripts)
  - [Step 3: Configure Application](#step-3-configure-application)
- [Local Development](#local-development)
- [Deployment to Vercel](#deployment-to-vercel)
- [Project Structure](#project-structure)
- [User Roles & Functionality](#user-roles--functionality)
- [Admin Functionality Notes](#admin-functionality-notes)

---

## About The Project

Math Trainer is a role-based educational platform that uses a **Supabase backend** for robust data persistence and user authentication. It makes learning and tracking math skills an interactive and insightful experience for four distinct user types—Admins, Teachers, Students, and Parents—each with a tailored dashboard and specific functionalities.

The application has been upgraded from a `localStorage`-based prototype to a scalable web app with a real database and secure authentication.

---

## Key Features

- **Supabase Backend**: All data is stored in a robust PostgreSQL database.
- **Secure Authentication**: User sign-up and sign-in are handled by Supabase Auth, including email confirmations.
- **Role-Based Access Control**: Four roles (Admin, Teacher, Student, Parent) with unique dashboards and permissions, enforced by database policies.
- **Customizable Math Quizzes**:
  - **Operations**: Addition, Subtraction, and Multiplication.
  - **Difficulty Stages**: Multiple levels of difficulty.
  - **Timed Challenges**: Three timer options (8s, 4s, 3s) for speed training.
- **Comprehensive Progress Tracking**: Visual analytics show performance over time.
- **Admin User Management**: Admins can manage user profiles directly from the UI.
- **Parental Monitoring**: Parents can link to their child's account to view progress reports securely.
- **Responsive Design**: Clean UI styled with Tailwind CSS for all screen sizes.

---

## Technology Stack

- **UI Library**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend-as-a-Service**: [Supabase](https://supabase.com/)
  - **Database**: PostgreSQL
  - **Authentication**: Supabase Auth
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (loaded via CDN)
- **State Management**: React Hooks & Context API
- **Module Loading**: ES Modules with `importmap` (via esm.sh CDN)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started: Supabase Setup

To run this project, you first need to set up a free Supabase project.

### Step 1: Create a Supabase Project

1.  Go to [supabase.com](https://supabase.com/) and sign up or log in.
2.  Create a new project. Give it a name and generate a secure database password (save this password somewhere safe).
3.  Wait for your project to be provisioned.

### Step 2: Run SQL Scripts

Once your project is ready, navigate to the **SQL Editor** in the Supabase dashboard sidebar. Click **+ New query** and run the following scripts one by one.

#### A. Create `profiles` Table & Policies

This script creates a table to store public user data and sets up security policies to control who can view or modify it.

```sql
-- 1. Create a table for public user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  name text,
  role text check (role in ('admin', 'teacher', 'student', 'parent')),
  child_id uuid references public.profiles(id)
);

-- 2. Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

create policy "Admins can manage all profiles." on profiles
  for all using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- 3. Create a trigger to automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### B. Create `progress` Table & Policies

This script creates the table for storing quiz results and sets up fine-grained security rules. For example, a parent can only see the progress of their own linked child.

```sql
-- 1. Create the progress table
create table progress (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  operation text not null,
  stage integer not null,
  score integer not null check (score >= 0 and score <= 100),
  total_time real -- Total time for the quiz in seconds
);

-- 2. Set up Row Level Security (RLS)
alter table progress enable row level security;

create policy "Students can insert and view their own progress." on progress
  for all using (auth.uid() = user_id);

create policy "Admins and Teachers can view all progress." on progress
  for select using ((select role from public.profiles where id = auth.uid()) in ('admin', 'teacher'));

create policy "Parents can view their linked child's progress." on progress
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'parent' and child_id = progress.user_id
    )
  );
```

#### C. Disable Realtime (Optional)

For this project, realtime is not needed. You can save resources by disabling it for the tables you just created. Go to **Database > Replication** and disable it for `profiles` and `progress`.

### Step 3: Configure Application

The application is now configured with valid Supabase credentials.

If you wish to connect to your own Supabase project:

1.  Go to your new Supabase project dashboard and navigate to **Project Settings > API**.
2.  Find your **Project URL** and the **Project API Keys** (use the `anon` `public` key).
3.  Open the file `services/supabaseClient.ts` in the project.
4.  Replace the existing values for `supabaseUrl` and `supabaseAnonKey` with your new credentials.

---

## Local Development

To run the application on your own computer, you need a simple local web server.

1.  **Download Files**: Create a new folder on your computer and place all the project files inside it.
2.  **Install a Web Server**: We recommend `live-server`.
    ```bash
    npm install -g live-server
    ```
3.  **Run the Server**: Navigate to the project folder and run the server.
    ```bash
    cd path/to/your/project-folder
    live-server
    ```
4.  **Open the App**: `live-server` will automatically open the application in your default web browser.

---

## Deployment to Vercel

This project is a static web application and can be easily deployed for free with [Vercel](https://vercel.com/).

1.  **Push Project to Git**: Push your project code, including your updated `services/supabaseClient.ts` file, to a Git repository (e.g., on GitHub).
2.  **Create Vercel Project**: In Vercel, import the Git repository.
3.  **Configure Project**: Vercel will automatically detect this as a static site ("Other"). No build command is needed.
4.  **Deploy**: Click the **Deploy** button. Your app will be live!

---

## Project Structure

The project structure is organized for clarity and scalability.

```
/
├── components/
│   ├── screens/         # Top-level screen components (Dashboards, Login, etc.)
│   ├── ui/              # Reusable UI elements (Button, Card, Modal, etc.)
│   └── UserManagementForm.tsx
├── context/
│   └── AppContext.tsx   # Global state management powered by Supabase
├── hooks/
│   └── useAppContext.ts # Custom hook to access the AppContext
├── services/
│   ├── quizService.ts   # Logic for generating quiz questions
│   └── supabaseClient.ts # Initializes and exports the Supabase client
├── App.tsx              # Main app component with routing logic
└── ... other files
```

---

## User Roles & Functionality

#### 👨‍💻 Admin
- Manages all user profiles. Can add, edit, and delete users.

#### 👩‍🏫 Teacher
- Views progress dashboards for all students.

#### 🧑‍🎓 Student
- Takes quizzes and tracks personal progress.

#### 👨‍👩‍👧 Parent
- Securely views the progress report for their linked child only.

---

## Admin Functionality Notes

Due to security constraints of client-side applications, admin actions have some limitations:

-   **Adding Users**: When an admin adds a new user, it uses the `signUp` flow. This will temporarily log the admin out. This is a necessary security measure when not using a full backend server.
-   **Deleting Users**: An admin can delete a user's `profile` and `progress` data, which effectively removes them from the app. However, the underlying authentication user in Supabase Auth is not deleted. Deleting auth users requires server-side admin privileges (e.g., via a Supabase Edge Function), which is outside the scope of this client-only project.
-   **Editing Users**: An admin can edit a user's name, role, and parent/child link. They cannot change a user's email or password from the admin panel.