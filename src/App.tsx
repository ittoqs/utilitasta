import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Utility from './pages/Utility';
import { AlertProvider } from './components/ui/ModalAlertContext';

function App() {
  return (
    <AlertProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="utilities/:id" element={<Utility />} />
        </Route>
      </Routes>
    </AlertProvider>
  );
}

export default App;
