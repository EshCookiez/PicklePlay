import Image from "next/image";
import logo from "../images/PicklePlayLogo.jpg"
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0a56a7] text-white shadow-md " >
      
      <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between gap-4">
        <Image
            alt="PicklePlay Logo"
            width={80}
            height={150}
            src={logo}
            className="rounded-full shadow-2xl"
          />

        <nav className="hidden md:flex gap-8 flex-1">
          
          <a href="#" className="hover:text-yellow-300 transition font-large">
            HOME
          </a>
          <a href="#" className="hover:text-yellow-300 transition font-large">
            FIND COURTS
          </a>
          <a href="#" className="hover:text-yellow-300 transition font-medium">
            ABOUT
          </a>
          <a href="#contact" className="hover:text-yellow-300 transition font-medium">
            CONTACT
          </a>
        </nav>

        

        <nav className="hidden md:flex gap-8 flex-1 justify-end items-center">
          <a href="#" className="hover:text-yellow-300 transition font-medium">
            Log in
          </a>
          <a href="#contact" className="hover:text-yellow-300 transition font-medium">
            Sign in
          </a>
          <button className="px-4 py-2 bg-white text-[#0a56a7] rounded-md font-semibold hover:bg-[#a3ff01] transition">
            Download App
          </button>
        </nav>
      </div>
    </header>
  );
}
