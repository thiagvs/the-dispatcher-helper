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
          <br />
          <br />
          <p><span className="opacity-70">Supervisão:</span> 61496 / 62405</p>
          <span>Email: supervisaopaxfao@portway.pt</span>

          <p><span className="opacity-70">Suporte:</span> 62428</p>
          <span>Email: Opssupport.fao@portway.pt</span>
          <br />
          <p><span className="opacity-70">Sala de descanso:</span> 61498</p>
          <p><span className="opacity-70">Lost:</span> 61498</p>
          <p><span className="opacity-70">Tapete PART:</span> 61424</p>
          <p><span className="opacity-70">SOA:</span> 62613</p>
          <p><span className="opacity-70">Carga:</span> 62625</p>
          <p><span className="opacity-70">Check-in:</span> 636+N°</p>
          <p><span className="opacity-70">MyWay:</span> 63373</p>
          <p><span className="opacity-70">Recursos Humanos:</span> 62410</p>
          <p><span className="opacity-70">Balcão:</span> 62406 / 62885</p>
          <br />
          <br />
          <p><span className="opacity-70">GoPads:</span> Ptw.fao.f4s | 654321</p>
          <p><span className="opacity-70">GoPadsGate:</span> Ptw | 123456</p>
          <p><span className="opacity-70">MyWayAPP:</span> Ptw.fao | portway01</p>
        </div>
      </section>
    </div>
  );
};

export default Contacts;