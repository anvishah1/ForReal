import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto pl-4 lg:pl-8 pr-6 lg:pr-12 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-br from-white to-gray-300 rounded-full flex items-center justify-center font-bold text-black text-base transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] group-hover:scale-105">
            Fr
          </div>
          <span className="font-syne font-bold text-xl tracking-tight">
            ForReal
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-12 ml-auto mr-8">
          <NavItem title="DETECT" subtitle="AI image analysis" />
          <NavItem title="FEATURES" subtitle="Explore capabilities" />
          <NavItem title="ABOUT" subtitle="How it works" />
        </nav>

      </div>
      
      {/* Accent line */}
      <div className="h-0.5 shimmer-line opacity-50"></div>
    </header>
  );
}

function NavItem({ title, subtitle }) {
  return (
    <div className="cursor-pointer group">
      <div className="text-xs font-syne font-semibold tracking-widest text-white/90 mb-0.5 group-hover:text-white transition-colors">
        {title}
      </div>
      <div className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">
        {subtitle}
      </div>
    </div>
  );
}
