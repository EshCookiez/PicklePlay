import Image from "next/image";
import { Facebook } from "lucide-react";
import PicklePlayLogo from "@/images/PicklePlayLogo.jpg";

export default function Footer() {
  return (
    <footer className="text-white py-8 sm:py-10 md:py-12 bg-[#0a56a7] pb-24 lg:pb-12" id="contact">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Image
              src={PicklePlayLogo}
              alt="PicklePlay Logo"
              width={100}
              height={100}
              className="rounded-full mb-3 sm:mb-4 w-20 h-20 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px]"
              loading="eager"
            />
            <p className="text-white/80 text-xs sm:text-sm">Find courts. Play pickleball. Build community.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">FIND</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-yellow-300 active:text-yellow-400 transition touch-target inline-block py-0.5">
                  Find Courts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 active:text-yellow-400 transition touch-target inline-block py-0.5">
                  Map Search
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 active:text-yellow-400 transition touch-target inline-block py-0.5">
                  Shop
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">LINKS</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-yellow-300 active:text-yellow-400 transition touch-target inline-block py-0.5">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 active:text-yellow-400 transition touch-target inline-block py-0.5">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 active:text-yellow-400 transition touch-target inline-block py-0.5">
                  News
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">Contact</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <a
                  href="https://www.facebook.com/pickleplayofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300 active:text-yellow-400 transition inline-flex items-center gap-1.5 sm:gap-2 touch-target py-0.5"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-white/80">
          <p>© 2025 PicklePlay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
