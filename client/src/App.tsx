import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { SocketProvider } from "./context/socketContext";
import Toast from "./components/Toast";

function App() {
  return (
    <div className="max-w-screen-xl min-h-screen flex flex-col mx-auto px-6 relative">
      <Header />
      <Toast />
      <SocketProvider>
        <Outlet />
      </SocketProvider>
    </div>
  );
}

export default App;
