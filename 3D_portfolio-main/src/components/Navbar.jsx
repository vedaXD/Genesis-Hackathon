import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className='absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-6'>
      <NavLink to='/'>
        <div className='bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-6 py-3 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all'>
          <h1 className='text-2xl font-black text-black'>CLIMATE CRISIS</h1>
        </div>
      </NavLink>
      <nav className='flex gap-4'>
        <a 
          href='https://www.un.org/en/climatechange/what-is-climate-change'
          target='_blank'
          rel='noopener noreferrer'
          className='bg-green-400 text-black font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all'
        >
          LEARN MORE
        </a>
        <a 
          href='https://www.worldwildlife.org/pages/act-on-climate'
          target='_blank'
          rel='noopener noreferrer'
          className='bg-red-400 text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all'
        >
          TAKE ACTION
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
