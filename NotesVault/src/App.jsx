/*export default function App() {
  return (
    <main>
      <h1>This is inside App</h1>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </main>
  );
}*/

import { RouterProvider } from "react-router-dom";
import router from "./Router.jsx";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
