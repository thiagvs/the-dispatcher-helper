import { useEffect, useState } from "react";
import OperationalTips from "./components/operationalTips";
import Footer from "./components/customFooter";
import TransaviaB737 from "./components/transavia/B737";
import TransaviaA320 from "./components/transavia/A320";
import TransaviaA321 from "./components/transavia/A321";
import EasyJetA319 from "./components/easyJet/A319";
import EasyJetA320 from "./components/easyJet/A320";
import EasyJetA321 from "./components/easyJet/A321";
import EurowingsA321 from "./components/eurowings/A321";
import EurowingsA319 from "./components/eurowings/A319";
import EurowingsA320 from "./components/eurowings/A320";

const companies = {
  EZY: {
    name: "easyJet",
    aircrafts: ["A319", "A320", "A321"],
  },
  TVF: {
    name: "Transavia",
    aircrafts: ["B737-800", "A320", "A321"],
  },
  EWG: {
    name: "Eurowings",
    aircrafts: ["A319", "A320", "A321"],
  },
};

export default function App() {
  type CompanyCode = keyof typeof companies;

  type SpecialLoad = {
    id: string;
    type: "AVIH" | "WCH";
    weight: number;
  };

  const [company, setCompany] = useState<CompanyCode | "">("");
  const [aircraft, setAircraft] = useState("");
  const [pesoTotal, setPesoTotal] = useState(0);
  const [totalBags, setTotalBags] = useState(0);
  const [specialLoads, setSpecialLoads] = useState<SpecialLoad[]>([]);
  const [tempType, setTempType] = useState<"AVIH" | "WCH">("AVIH");
  const [tempWeight, setTempWeight] = useState(0);
  const [pesoMedio, setPesoMedio] = useState(0);

  const recalculateWeights = (loads: SpecialLoad[], currentPesoTotal: number, currentTotalBags: number) => {
    const pesoEspecial = loads.reduce((acc, item) => acc + item.weight, 0);
    const distribuivel = Math.max(currentPesoTotal - pesoEspecial, 0);
  
    if (distribuivel > 0 && currentTotalBags > 0) {
      const valor = distribuivel / currentTotalBags;
      setPesoMedio(parseFloat(valor.toFixed(1)));
    } else {
      setPesoMedio(0);
    }
  };

  // Update weights when totalBags or pesoTotal changes
  useEffect(() => {
    recalculateWeights(specialLoads, pesoTotal, totalBags);
  }, [pesoTotal, totalBags, specialLoads])

  const handleCompanyChange = (value: string) => {
    setCompany(value as CompanyCode);
    setAircraft("");
  };

  const handleAddSpecialLoad = () => {
    if (!tempWeight) {
      alert('Não há peso ou porão selecionados');
      return;
    }

    if (!aircraft || !company) {
      alert('Selecione o avião');
      return;
    }

    const newLoad: SpecialLoad = {
      id: crypto.randomUUID(),
      type: tempType,
      weight: tempWeight,
    };

    setSpecialLoads((prev) => {
      const updated = [...prev, newLoad];
      recalculateWeights(updated, pesoTotal, totalBags);
      return updated;
    });
    
    setTempWeight(0);
  };

  const handleRemoveSpecialLoad = (id: string) => {
    setSpecialLoads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      recalculateWeights(updated, pesoTotal, totalBags);
      return updated;
    });
  };


  const renderAircraft = () => {
    if (!company || !aircraft) return null;

    if (company === "TVF" && aircraft === "B737-800") return <TransaviaB737 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;
    if (company === "TVF" && aircraft === "A320") return <TransaviaA320 pesoMedio={pesoMedio} totalBags={totalBags}  pesoTotal={pesoTotal} />;
    if (company === "TVF" && aircraft === "A321") return <TransaviaA321 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;

    if (company === "EZY" && aircraft === "A319") return <EasyJetA319 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;
    if (company === "EZY" && aircraft === "A320") return <EasyJetA320 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;
    if (company === "EZY" && aircraft === "A321") return <EasyJetA321 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;

    if (company === "EWG" && aircraft === "A319") return <EurowingsA319 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;
    if (company === "EWG" && aircraft === "A320") return <EurowingsA320 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;
    if (company === "EWG" && aircraft === "A321") return <EurowingsA321 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;

    return null;
  };


  return (
    <div style={{ padding: 20 }}>
      <h2>✈️ Load Control - The Dispatcher Helper</h2>

      {/* Companhia */}
      <select
        value={company}
        onChange={(e) => handleCompanyChange(e.target.value)}
      >
        <option value="">Selecione a companhia</option>

        {Object.entries(companies).map(([code, c]) => (
          <option key={code} value={code}>
            {code} - {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      {/* Avião */}
      <select
        value={aircraft}
        disabled={!company}
        onChange={(e) => setAircraft(e.target.value)}
      >
        <option value="">Selecione o avião</option>

        {company &&
          companies[company].aircrafts.map((a: string) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
      </select>
      <hr />

      <h3>Peso médio:</h3>
      <div id="peso-medio">
        <p>Peso total: </p>
        <input
          type="number"
          placeholder="Peso total"
          value={pesoTotal}
          onChange={(e) => setPesoTotal(Number(e.target.value))}
        />
        <p>Total de bags: </p>
        <input
          type="number"
          placeholder="Total de bags"
          value={totalBags}
          onChange={(e) => setTotalBags(Number(e.target.value))}
        />

        {pesoMedio !== 0 &&
          <p>Peso médio: {pesoMedio}</p>
        }
      </div>

      <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">📦 Cargas especiais</h3>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <p>Categoria: </p>
          <select
            value={tempType}
            onChange={(e) => setTempType(e.target.value as any)}
            className="p-2 border rounded-lg"
          >
            <option value="AVIH">AVIH</option>
            <option value="WCMP">Cadeira manual (sem bateria)</option>
            <option value="WCBD">Cadeira com bateria seca (dry cell)</option>
            <option value="WCBW">Cadeira com bateria molhada (wet cell)</option>
            <option value="WCMP">Cadeira com bateria de lítio</option>
          </select>

          <p>Peso(kgs): </p>
          <input
            type="number"
            placeholder="Peso (kg)"
            value={tempWeight}
            onChange={(e) => setTempWeight(Number(e.target.value))}
            className="p-2 border rounded-lg"
          />
        </div>

        <button
          onClick={handleAddSpecialLoad}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ➕ Confirmar
        </button>
      </div>

      <div className="space-y-3 mt-4">
        {specialLoads.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 text-white rounded-xl p-3 shadow-md flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-400">
                {item.type}
              </span>
              <button
                onClick={() => handleRemoveSpecialLoad(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
              >
                🗑️ Remover
              </button>
            </div>

            {/* Linha 2 */}
            <div className="flex justify-between text-sm">
              <span className="bg-gray-700 px-2 py-1 rounded-md">
                ⚖️ {item.weight} kg
              </span>
            </div>
          </div>
        ))}
      </div>
      <div>{renderAircraft()}</div>


      <div className="min-h-screen flex flex-col">
        <main className="flex-grow p-6">
          <div className="mt-10 max-w-4xl mx-auto">
            <OperationalTips />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}