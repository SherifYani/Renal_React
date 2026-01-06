import { useLocation } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout";
import AppRoutes from "./routes";

function App() {
  const location = useLocation();

  const layoutRoutes = [
    "/dashboard",
    "/",
    "/equipment",
    "/maintenance",
    "/reservations",
    "/analytics",
  ];

  if (layoutRoutes.includes(location.pathname)) {
    return (
      <PageLayout>
        <AppRoutes />
      </PageLayout>
    );
  }

  return <AppRoutes />;
}

export default App;
