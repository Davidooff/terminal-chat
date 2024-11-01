import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import './reset.css'
import Auth from './pages/Auth/Auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
    ,
  },
  {
    path: "auth/:authType",
    element: <Auth />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
