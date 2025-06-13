import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePageWithForm from "./HomePageWithForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <HomePageWithForm />
      <ToastContainer position="top-center" autoClose={2000} />
    </QueryClientProvider>
  );
}

export default App;
