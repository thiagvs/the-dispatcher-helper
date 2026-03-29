import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-4 pb-4 w-full text-center">
      <hr className="border-gray-800 mb-4" />
      <p className="text-sm text-gray-400">
        Bom trabalho <span className="text-red-500">❤️</span>
      </p>
       © The Dispatcher Helper - 2026
    </footer>
  );
};

export default Footer;