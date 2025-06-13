import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePageWithForm from "./HomePageWithForm";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <HomePageWithForm />
    </QueryClientProvider>
  );
}

export default App;
