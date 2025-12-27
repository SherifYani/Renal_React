# Equipment Management Dashboard

A React-based web application for managing equipment, reservations, maintenance, and analytics through a clean and modular dashboard interface.

## 🚀 Features

- **Dashboard Overview** – High-level view of equipment and system status
- **Equipment Management** – View equipment, statuses, and details
- **Reservations** – Manage equipment reservations
- **Maintenance Tracking** – Track and manage maintenance activities
- **Analytics** – Visual insights and statistics
- **Reusable Components** – Modular and scalable component structure
- **Responsive Layout** – Sidebar, navbar, and page layout components
- **Notification System** – Success notifications for user actions

## 🧱 Project Structure

```
src/
├── components/
│   ├── common/          # Shared reusable components
│   ├── equipment/       # Equipment-related components
│   ├── layout/          # Layout components (Navbar, Sidebar, PageLayout)
│   └── modals/          # Modal dialogs
├── pages/               # Application pages (Dashboard, Equipment, etc.)
├── services/            # API and data service layers
├── routes.jsx           # Application routes
├── App.js               # Root application component
└── App.css              # Global styles
```

## 🛠️ Technologies Used

- **React**
- **JavaScript (ES6+)**
- **CSS**
- **Component-based architecture**
- **Service-based API layer**

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## 🔌 Services Layer

The `services/` directory contains API abstraction logic:
- `api.js` – Base API configuration
- `equipment.service.js` – Equipment-related API calls
- `reservation.service.js` – Reservation management
- `maintenance.service.js` – Maintenance operations
- `analytics.service.js` – Analytics data retrieval

## 🧪 Testing

Run tests using:
```bash
npm test
```

## 📄 Notes

- Ensure your backend API is properly configured and accessible.
- Environment variables (if required) should be configured before running the app.

## 📜 License

This project is open-source and available under the MIT License.
