import { Toaster } from "sonner";
import "./App.css";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

function App() {
  return (
    // <Router>
    <>
      <Toaster richColors position="top-right" />
      {/* <LoginForm /> */}
      <RegisterForm />
    </>
    // <Router/>
  );
}

export default App;
