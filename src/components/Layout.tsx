import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="pb-12 min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
