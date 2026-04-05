import React from "react";

type Company = {
  icao: string;
  iata: string;
  operator: string;
  wc: number;
  agua: number;
  gpu: number;
};

const companies: Company[] = [
  { icao: "ABR", iata: "AG", operator: "AIR CONTRACTORS", wc: 1, agua: 1, gpu: 60 },
  { icao: "ADR", iata: "JP", operator: "ADRIA AIRWAYS", wc: 0, agua: 0, gpu: 60 },
  { icao: "ANE", iata: "YW", operator: "AIR NOSTRUM", wc: 0, agua: 0, gpu: 60 },
  { icao: "ART", iata: "6Y", operator: "SMART LYNX", wc: 1, agua: 1, gpu: 60 },
  { icao: "AXY", iata: "6V", operator: "AXIS AIRWAYS", wc: 1, agua: 1, gpu: 60 },
  { icao: "BTI", iata: "BT", operator: "AIR BALTIC", wc: 1, agua: 0, gpu: 0 },
  { icao: "BEL", iata: "SN", operator: "SN BRUSSELS AIRLINES", wc: 0, agua: 0, gpu: 60 },
  { icao: "BLX", iata: "6B", operator: "TUIFLY NORDIC", wc: 0, agua: 0, gpu: 60 },
  { icao: "CND", iata: "CD", operator: "CORENDON", wc: 1, agua: 0, gpu: 60 },
  { icao: "CSA", iata: "OK", operator: "CZECH AIRLINES", wc: 1, agua: 1, gpu: 110 },
  { icao: "DLH", iata: "LH", operator: "LUFTHANSA", wc: 1, agua: 1, gpu: 0 },
  { icao: "EDW", iata: "WK", operator: "EDELWEISS", wc: 0, agua: 0, gpu: 60 },
  { icao: "ENT", iata: "E4", operator: "ENTER AIR", wc: 1, agua: 1, gpu: 0 },
  { icao: "EVJ", iata: "XH", operator: "EVERJETS", wc: 1, agua: 1, gpu: 60 },
  { icao: "EWG", iata: "EW", operator: "EUROWINGS", wc: 0, agua: 0, gpu: 45 },
  { icao: "EXS", iata: "LS", operator: "JET2 COM", wc: 0, agua: 0, gpu: 60 },
  { icao: "EZS", iata: "DS", operator: "EASYJET SWITZERLAND", wc: 0, agua: 0, gpu: 60 },
  { icao: "EZY", iata: "U2", operator: "EASYJET AIRLINE COMPANY, LDA", wc: 0, agua: 0, gpu: 60 },
  { icao: "FIN", iata: "AY", operator: "FINNAIR", wc: 1, agua: 1, gpu: 60 },
  { icao: "FPO", iata: "5O", operator: "EUROPE AIRPOST", wc: 1, agua: 1, gpu: 50 },
  { icao: "GER", iata: "ZQ", operator: "GERMAN AIRWAYS", wc: 0, agua: 0, gpu: 60 },
  { icao: "GJT", iata: "GW", operator: "GET JET", wc: 1, agua: 1, gpu: 60 },
  { icao: "GXL", iata: "XL", operator: "XL AIRWAYS GERMANY", wc: 1, agua: 1, gpu: 60 },
  { icao: "HFY", iata: "5K", operator: "HIFLY", wc: 1, agua: 1, gpu: 60 },
  { icao: "HLX", iata: "X3", operator: "TUI", wc: 0, agua: 0, gpu: 60 },
  { icao: "ICE", iata: "FI", operator: "ICELANDAIR", wc: 1, agua: 1, gpu: 60 },
  { icao: "JTG", iata: "JO", operator: "JET TIME", wc: 1, agua: 0, gpu: 60 },
  { icao: "JAF", iata: "TB", operator: "JETAIRFLY/TUI AIRLINE BELGIUM", wc: 0, agua: 0, gpu: 60 },
  { icao: "LGL", iata: "LG", operator: "LUXAIR", wc: 1, agua: 1, gpu: 60 },
  { icao: "NOZ", iata: "DY", operator: "NORWEGIAN AIR SHUTTLE, S.A.", wc: 0, agua: 0, gpu: 60 },
  { icao: "IBK", iata: "D8", operator: "NORWEGIAN INT.", wc: 0, agua: 0, gpu: 60 },
  { icao: "OBS", iata: "6O", operator: "ORBEST", wc: 1, agua: 1, gpu: 60 },
  { icao: "PVG", iata: "P6", operator: "PRIVILEDGE STYLE", wc: 1, agua: 1, gpu: 60 },
  { icao: "SAS", iata: "SK", operator: "SAS SCANDINAVIAN AIRLINES SYSTEM", wc: 1, agua: 1, gpu: 60 },
  { icao: "SQP", iata: "PQ", operator: "SKY UP", wc: 1, agua: 1, gpu: 60 },
  { icao: "SWR", iata: "LX", operator: "SWISS INTERNATIONAL AIRLINES", wc: 1, agua: 1, gpu: 60 },
  { icao: "TFL", iata: "OR", operator: "ARKEFLY (TUI AIRLINES NEDERLANDS B.V.)", wc: 0, agua: 0, gpu: 60 },
  { icao: "TOM", iata: "BY", operator: "THOMSONFLY LIMITED", wc: 0, agua: 0, gpu: 60 },
  { icao: "TRA", iata: "HV", operator: "TRANSAVIA", wc: 0, agua: 0, gpu: 40 },
  { icao: "TVF", iata: "TO", operator: "TRANSAVIA FRANCE", wc: 0, agua: 0, gpu: 0 },
  { icao: "TSC", iata: "TS", operator: "AIR TRANSAT", wc: 1, agua: 1, gpu: 75 },
  { icao: "VOE", iata: "V7", operator: "VOLOTEA", wc: 0, agua: 0, gpu: 60 },
  { icao: "WIZZ", iata: "W6", operator: "WIZZ AIR", wc: 0, agua: 0, gpu: 45 },
];

const CompaniesRights: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 text-sm pb-24">
      <h2 className="text-xl font-bold text-center mb-4 text-white">
        SERVIÇOS CONTRATADOS - UPDATE - 17 FEB 2026
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse bg-gray-800 text-gray-200">
          <thead>
            <tr className="bg-gray-700 text-xs uppercase tracking-wider">
              <th className="border border-gray-600 p-2">ICAO</th>
              <th className="border border-gray-600 p-2">IATA</th>
              <th className="border border-gray-600 p-2 text-left">Operator</th>
              <th className="border border-gray-600 p-2 bg-yellow-600 text-white w-16">WC</th>
              <th className="border border-gray-600 p-2 bg-blue-600 text-white w-16">Agua</th>
              <th className="border border-gray-600 p-2 bg-green-600 text-white w-16">GPU</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((c, index) => (
              <tr
                key={index}
                className="text-center hover:bg-gray-700 transition-colors"
              >
                <td className="border border-gray-600 p-2 font-mono">{c.icao}</td>
                <td className="border border-gray-600 p-2 font-mono">{c.iata}</td>
                <td className="border border-gray-600 p-2 text-left text-xs">{c.operator}</td>

                <td className={`border border-gray-600 p-2 font-bold ${c.wc > 0 ? 'bg-yellow-900/40 text-yellow-200' : 'text-gray-500'}`}>
                  {c.wc}
                </td>

                <td className={`border border-gray-600 p-2 font-bold ${c.agua > 0 ? 'bg-blue-900/40 text-blue-200' : 'text-gray-500'}`}>
                  {c.agua}
                </td>

                <td className={`border border-gray-600 p-2 font-bold ${c.gpu > 0 ? 'bg-green-900/40 text-green-200' : 'text-gray-500'}`}>
                  {c.gpu}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-3 bg-blue-900/30 border border-blue-500 rounded text-center">
        <p className="text-blue-200 font-bold uppercase tracking-widest text-xs">
          NOTA: EFETUAR SEMPRE H2O ANTES DO WC
        </p>
      </div>
    </div>
  );
};

export default CompaniesRights;