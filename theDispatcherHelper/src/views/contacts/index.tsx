import React from 'react';

const Contacts: React.FC = () => {
  return (
    <div className="w-full text-xs text-gray-300 space-y-4">
      {/* Contatos - Compacto em Linha Única ou Coluna Curta */}
      <section className="border-t border-gray-700 pt-2">
        <h3 className="font-bold text-green-400 mb-1 flex items-center gap-1">
          📞 TEL Contactos
        </h3>
        <div className="grid grid-cols-1 gap-1 text-[11px]">
          <p><span className="opacity-70">Portway:</span> VHF 131.875</p>
          <p><span className="opacity-70">FAO Safety:</span> 131.450</p>
          <p><span className="opacity-70">Coord:</span> 62401</p>
        </div>
      </section>
    </div>
  );
};

export default Contacts;