import { useAuth } from "@/contexts/AuthContext";
import ProtectedHomePage from "./ProtectedHomePage";
import PublicHomePage from "./PublicHomePage";

const HomePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <PublicHomePage />;
  }

  return <ProtectedHomePage />;
};

export default HomePage;
