import { Route, Routes } from 'react-router-dom';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<>Home Page</>} />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
