import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import CreateRoom from "./pages/CreateRoom.tsx";
import Room from "./pages/Room.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}
    >
      <Route
        path=""
        element={<>home pages</>}
      />
      <Route
        path="/create-room"
        element={<CreateRoom />}
      />
      <Route
        path="/room/:roomId"
        element={<Room />}
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
