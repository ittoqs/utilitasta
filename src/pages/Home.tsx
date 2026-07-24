import { Link } from 'react-router-dom';
import utilities from '../data/utilities.json';

export default function Home() {
  return (
    <>
      <div className="container mx-auto text-center my-10 px-4">
        <h1 className="text-5xl sm:text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#e95420] to-orange-400 drop-shadow-sm inline-block hover:scale-105 transition-transform duration-300">UTILITASTA</h1>
        <p className="text-base sm:text-lg text-muted max-w-xl mx-auto font-light">
          Kumpulan alat bantu pengembangan yang ringan, cepat, gratis, open-source, dan bebas iklan.
        </p>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilities.map((util) => (
          <div
            key={util.path}
            className="rounded-xl border bg-card p-6 flex flex-col justify-between shadow-sm hover:shadow-lg"
          >
            <p className="mb-6 text-sm sm:text-base font-light text-muted leading-relaxed">
              {util.description}
            </p>
            <Link
              to={util.path}
              className="w-full py-2.5 px-4 rounded-lg text-center font-semibold text-base btn-action block"
            >
              {util.title}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
