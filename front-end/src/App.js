import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import EditorPage from "./Pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    
    <div>
      <Toaster
      position="top-right"
      toastOptions={{
        success : {
          primarry : "#4aed88"
        }
      }}
      ></Toaster>
    </div>

      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          Home Page
        </Route>
        <Route path="/editor/:roomId" element={<EditorPage />}>
          Editor Page
        </Route>
      </Routes>
    </BrowserRouter>
    
    </>
  );
}

export default App;
