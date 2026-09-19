import React from 'react';

const Footer: React.FC = () => {
   const versao = import.meta.env.PACKAGE_VERSION;

  return (
    <footer className="w-full text-center py-4">
      <hr className="border-gray-800 mb-4" />
      <p className="text-sm text-gray-400">
        Bom trabalho <span className="text-red-500">❤️</span>
      </p>
      <p className="text-sm text-gray-400 mt-1">
        © The Dispatcher Helper V.{versao} - 2026
      </p>
    </footer>
  );
};

export default Footer;