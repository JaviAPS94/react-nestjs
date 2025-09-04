import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-rymel-blue">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-auto"
                src="https://rymel.com.co/wp-content/uploads/2024/07/Logo-Rymel-Oscuro.png"
              />
            </div>
            <div className="hidden sm:block sm:w-full sm:ml-6">
              <div className="flex justify-center items-center space-x-10 h-full">
                <Link
                  to="/"
                  className="text-gray-100 hover:bg-rymel-yellow hover:text-white px-3 py-2 rounded-md text-lg font-bold"
                >
                  Normas
                </Link>
                <Link
                  to="/design"
                  className="text-gray-100 hover:bg-rymel-yellow hover:text-white px-3 py-2 rounded-md text-lg font-bold"
                >
                  Diseño
                </Link>
                <a
                  href="#"
                  className="text-gray-100 hover:bg-rymel-yellow hover:text-white px-3 py-2 rounded-md text-lg font-bold"
                >
                  Módulo 3
                </a>
                <a
                  href="#"
                  className="text-gray-100 hover:bg-rymel-yellow hover:text-white px-3 py-2 rounded-md text-lg font-bold"
                >
                  Módulo 4
                </a>
                <a
                  href="#"
                  className="text-gray-100 hover:bg-rymel-yellow hover:text-white px-3 py-2 rounded-md text-lg font-bold"
                >
                  Módulo 5
                </a>
                <a
                  href="#"
                  className="text-gray-100 hover:bg-rymel-yellow hover:text-white px-3 py-2 rounded-md text-lg font-bold"
                >
                  Módulo 6
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Normas
            </Link>
            <Link
              to="/design"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Diseño
            </Link>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Módulo 3
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Módulo 4
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
