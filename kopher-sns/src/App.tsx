import RootRoute from "@/root-route.tsx";
import SessionProvider from "@/provider/session-provider.tsx";
import ModalProvider from "@/provider/modal-provider.tsx";

function App() {
  return (
    <SessionProvider>
      <ModalProvider>
        <RootRoute />
      </ModalProvider>
    </SessionProvider>
  );
}

export default App;
