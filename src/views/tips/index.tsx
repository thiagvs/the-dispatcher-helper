import React from 'react';

const Tips: React.FC = () => {
  return (
    <div className="w-full text-xs text-gray-300 space-y-4">
      {/* Contatos - Compacto em Linha Única ou Coluna Curta */}
      <section className="border-t border-gray-700 pt-2">
        <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-1">
          💼 CG Comportamento
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

      <section className="border-t border-gray-700 pt-2">
        <h3 className="font-bold text-green-400 mb-2 flex items-center gap-1">
          🧑‍✈️ Dicas - Companhias
        </h3>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="font-bold text-red-400"><b>Transavia</b></span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-red-400">HV = Holanda (TRA)</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-red-400">TO = França (TVF)</span>
        </div>
        <br />
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="font-bold text-red-400"><b>EasyJet</b></span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-red-400">U2 = sempre</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-red-400">EZY / EJU / EZS = muda só ICAO</span>
        </div>
        <br />
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="font-bold text-red-400"><b>Norwegian</b></span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-red-400">DY = Noruega (NAX)</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-red-400">D8 = Suécia (NSZ)</span>
        </div>
        <br />
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="font-bold text-red-400"><b>Eurowings</b></span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-red-400">EW = Alemanha (EWG)</span>
        </div>
      </section >

      <section className="border-t border-gray-700 pt-2">
        <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-1">
          🧑‍✈️ Significados
        </h3>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="font-bold text-yellow-400"><b>IATA</b></span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-yellow-400">(2 letras / número do voo)</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-yellow-400"><i>Ex: HV1234, U21234, D81234</i></span>
        </div>

        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-yellow-400"><b>ICAO (3 letras)</b></span>
        </div>

        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-yellow-400">Usado em:</span>
        </div>
          ATC (rádio) - 
          Plano de voo - 
          Callsign

      </section>
    </div >
  );
};

export default Tips;