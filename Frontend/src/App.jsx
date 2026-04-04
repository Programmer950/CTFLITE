import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BuilderProvider } from './context/BuilderContext';
import BuilderLayout from './components/builder/BuilderLayout';
import CTFdAdmin from './components/admin/CTFdAdmin';
import PublicLayout from './components/home/PublicLayout';
import Home from './components/home/Home';
import Login from './components/home/Login';
import Register from './components/home/Register';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <BuilderProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/builder" element={<BuilderLayout />} />
          <Route path="/admin/*" element={<CTFdAdmin />} />
        </Routes>
      </BuilderProvider>
    </BrowserRouter>
  );
}
