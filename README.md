# Project Tracking System - Login, Register, and Dashboard

## 🎯 Overview
This is a complete and updated login, registration, and dashboard system designed for a graduation project tracking system. It's built using React.js and Tailwind CSS, featuring a consistent design across all pages and dynamic content based on user interaction.

## ✨ Features

### Login Page
- ✅ "Login" as the main heading
- ✅ Input field for Email or Username
- ✅ Input field for Password
- ✅ "Login" button
- ✅ "Don't have an account? Register" link to navigate to the registration page

### Register Page
- ✅ "Register" as the main heading
- ✅ Input field for Email
- ✅ Input field for Username
- ✅ **🆕 "Register as" dropdown with "Student" and "Supervisor" options**
- ✅ Input field for Password
- ✅ "Register" button
- ✅ "Already have an account? Login" link to navigate back to the login page

### Dashboard Page
- ✅ **User Profile Card:** Blue card with user image, dynamic greeting (Good Morning/Afternoon/Evening), username, and user type.
- ✅ **Navigation Sidebar:** Buttons for "Dashboard", "Tasks", "Files", and "Discussion" with active state indicator.
- ✅ **Dynamic Content Area:** Displays content relevant to the selected navigation item.
- ✅ **Top Right Action Buttons:**
  - **+ (Add) button:** For creating new items (e.g., team, task).
  - **Bell icon:** For notifications.
  - **Logout icon:** To log out of the system.

### General Features
- ✅ Consistent and modern design across all pages
- ✅ Responsive layout for various screen sizes
- ✅ Interactive visual effects (hover, focus, animations)
- ✅ Smooth page transitions
- ✅ Client-side form validation
- ✅ **Seamless navigation between Login, Register, and Dashboard pages**

## 🛠️ Technologies Used
- **React.js 18** - JavaScript library for building user interfaces
- **Tailwind CSS 3** - Utility-first CSS framework for styling
- **HTML5** - Page structure
- **CSS3** - Styling and visual effects
- **JavaScript ES6+** - Application logic

## 🚀 How to Run the Project (using VS Code)

### Prerequisites
Before you begin, ensure you have the following installed on your system:
- **Node.js (version 14 or higher):** Includes npm (Node Package Manager).
  - Download from: [https://nodejs.org/](https://nodejs.org/)
- **VS Code:** A powerful and popular code editor.
  - Download from: [https://code.visualstudio.com/](https://code.visualstudio.com/)

### Step-by-Step Instructions

1.  **Extract the Project Files:**
    Unzip the `project_tracking_app_full.zip` file to a location on your computer. This will create a folder named `project_tracking_app_full`.

2.  **Open the Project in VS Code:**
    *   Open VS Code.
    *   Go to `File` > `Open Folder...` (or `Open...` on macOS).
    *   Navigate to and select the `project_tracking_app_full` folder you just extracted.
    *   Click `Open`.

3.  **Open the Integrated Terminal in VS Code:**
    *   In VS Code, go to `Terminal` > `New Terminal`.
    *   This will open a terminal window at the bottom of VS Code, automatically set to your project's root directory (`project_tracking_app_full`).

4.  **Install Project Dependencies:**
    In the VS Code terminal, run the following command to install all necessary Node.js packages (React, Tailwind CSS, etc.):
    ```bash
    npm install
    ```
    *Wait for the installation to complete. This might take a few minutes.*

5.  **Start the Development Server:**
    Once the dependencies are installed, run the following command in the same terminal to start the React development server:
    ```bash
    npm start
    ```

6.  **View the Application:**
    *   After running `npm start`, your default web browser should automatically open a new tab displaying the application at `http://localhost:3000`.
    *   If it doesn't open automatically, copy and paste `http://localhost:3000` into your browser's address bar.

    You should now see the Login page. You can navigate to the Register page, create an account, and then be redirected to the Dashboard.

### Important Notes for VS Code Users
*   **File Structure:** The `src` folder contains all your React components (`App.jsx`, `Dashboard.jsx`, `RegisterPage.jsx`) and the main CSS file (`index.css`).
*   **Tailwind CSS Configuration:** `tailwind.config.js` and `postcss.config.js` are located in the root of the project. These are essential for Tailwind CSS to work correctly.
*   **`package.json`:** This file lists all project dependencies and scripts. `npm install` reads this file to set up your project.
*   **Live Reloading:** When the development server is running (`npm start`), any changes you save to your React or CSS files will automatically trigger a recompile and refresh your browser, allowing for a fast development workflow.

## 📁 Project Structure
```
project_tracking_app_full/
├── public/                  # Public assets (e.g., index.html)
├── src/                     # Source code for React components
│   ├── App.jsx              # Main application component (handles routing between pages)
│   ├── Dashboard.jsx        # Dashboard page component
│   ├── RegisterPage.jsx     # Register page component
│   └── index.css            # Main CSS file with Tailwind directives
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Project dependencies and scripts
├── README.md                # This file
└── .gitignore               # Files/folders to ignore in Git
```

## 🎨 Design and Styling
- **Background:** Light blue gradient (`bg-gradient-to-br from-blue-50 to-blue-100`)
- **Cards/Containers:** White background with soft shadows (`bg-white shadow-xl`)
- **Primary Accent Color:** Blue (`bg-blue-600`, `text-blue-600`)
- **Input Fields:** Light gray background (`bg-gray-50`) with rounded borders
- **Text:** Dark gray for headings, medium gray for body text
- **Links:** Blue with underline on hover

## 🚀 Technical Highlights
- **State Management:** Utilizes React's `useState` hook for managing UI state and user data.
- **Conditional Rendering:** Dynamically renders Login, Register, or Dashboard components based on application state.
- **Form Handling:** Basic form submission and input change handling.
- **Dynamic Greeting:** The dashboard greeting updates based on the current time of day.
- **Modular Components:** Each page (Login, Register, Dashboard) is a separate, reusable React component.

## 💡 Customization and Extension
- **Styling:** Modify `tailwind.config.js` or `src/index.css` to change the overall look and feel.
- **Content:** Update the `renderMainContent` function in `Dashboard.jsx` to add more sections or dynamic data.
- **Authentication:** Integrate with a real backend API for user authentication and data persistence.
- **Routing:** For a more complex application, consider using `react-router-dom` for advanced routing.

## 📞 Support
If you encounter any issues or have questions, please refer to the `README.md` file first. If the problem persists, feel free to ask for further assistance.

---
**This project provides a solid foundation for your graduation project tracking system, offering a clean UI and essential functionalities.**

