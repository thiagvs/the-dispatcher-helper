import React from 'react';

const OperationalTips: React.FC = () => {
  return (
    <div className="w-full text-xs text-gray-300 space-y-4">
      
      {/* CG - Estilo Lista (Melhor que tabela para telas estreitas) */}
      <section className="border-t border-gray-700 pt-2">
        <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-1">
          ✈️ CG Comportamento
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between border-b border-gray-800 pb-1">
            <span className="font-bold">B737 </span>
            <span>Dianteiro <span className="text-orange-500 font-medium ml-1">(Cuidado Aft)</span></span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-1">
            <span className="font-bold">A320 </span>
            <span>Neutro / Flexível</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-1">
            <span className="font-bold text-red-400">A321</span>
            <span className="text-red-400">Sensível: Distribuir Holds</span>
          </div>
        </div>
      </section>

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

      {/* Dicas - Lista Vertical sem Grids complexos */}
      <section className="border-t border-gray-700 pt-2">
        <h3 className="font-bold text-amber-400 mb-1 flex items-center gap-1">
          💡 TIP Dicas Dispatch
        </h3>
        <ul className="space-y-1 text-[11px] leading-tight">
          <li><span className="text-amber-500 font-bold">1.</span> Evitar concentração no aft</li>
          <li><span className="text-amber-500 font-bold">2.</span> Usar forward desde o início</li>
          <li><span className="text-amber-500 font-bold">3.</span> Balancear antes do fechamento</li>
          <li><span className="text-amber-500 font-bold">4.</span> Bulk enche rápido (antecipar)</li>
          <li><span className="text-amber-500 font-bold">5.</span> A321: Lógica 30/40/30</li>
          <li><span className="text-amber-500 font-bold">6.</span> B737: Nunca tudo atrás no final</li>
        </ul>
      </section>
    </div>
  );
};

export default OperationalTips;