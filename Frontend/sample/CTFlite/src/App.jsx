import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BuilderProvider } from './context/BuilderContext';
import BuilderLayout from './components/builder/BuilderLayout';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <BuilderProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/builder" replace />} />
          <Route path="/builder" element={<BuilderLayout />} />
        </Routes>
      </BuilderProvider>
    </BrowserRouter>
  );
}
