import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Protected from "./Protected";
import { isAuthenticated } from "./helpers";
import Signin from "./pages/Signin";
import Moves from "./pages/Moves";
import CreateOrEditMove from "./pages/CreateOrEditMove";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<Protected />}>
        <Route index element={<Moves />} />
        <Route
          path="/create-move"
          element={<CreateOrEditMove page={"create"} />}
        />
        <Route path="/edit-move" element={<CreateOrEditMove page={"edit"} />} />
      </Route>
      <Route
        path="signin"
        element={<Signin />}
        loader={async () => await isAuthenticated()}
      />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Route>
  )
);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
