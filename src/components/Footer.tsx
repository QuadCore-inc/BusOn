"use client";

import Image from "next/image";
import logo from "../../public/quad.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200  dark:bg-[#EDEAE1] text-white  shadow  bottom-0">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse relative overflow-hidden w-32 h-32">
            <Image src={logo} alt="idev Logo" width={128} height={128} />
          </div>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">          
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025 QuadCore. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;