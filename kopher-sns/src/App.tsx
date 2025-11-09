import RootRoute from "@/root-route.tsx";
import SessionProvider from "@/provider/session-provider.tsx";

function App() {
  return (
    <SessionProvider>
      <RootRoute />
    </SessionProvider>
  );
}

export default App;
