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

  const [company, setCompany] = useState<CompanyCode | "">("");
  const [aircraft, setAircraft] = useState("");
  const [pesoTotal, setPesoTotal] = useState(0);
  const [totalBags, setTotalBags] = useState(0);
  const [pesoMedio, setPesoMedio] = useState(0);

  useEffect(() => {
    let valor = 0;
    if (pesoTotal !== 0 || totalBags !== 0)
      valor = pesoTotal / totalBags;
    setPesoMedio(parseFloat(valor.toFixed(1)));
  }, [pesoTotal, totalBags])

  const handleCompanyChange = (value: string) => {
    setCompany(value as CompanyCode);
    setAircraft("");
  };

  const renderAircraft = () => {
    if (!company || !aircraft) return null;

    if (company === "TVF" && aircraft === "B737-800") return <TransaviaB737 />;
    if (company === "TVF" && aircraft === "A320") return <TransaviaA320 pesoMedio={pesoMedio} totalBags={totalBags} />;
    if (company === "TVF" && aircraft === "A321") return <TransaviaA321 pesoMedio={pesoMedio} totalBags={totalBags} pesoTotal={pesoTotal} />;

    if (company === "EZY" && aircraft === "A319") return <EasyJetA319 />;
    if (company === "EZY" && aircraft === "A320") return <EasyJetA320 />;
    if (company === "EZY" && aircraft === "A321") return <EasyJetA321 />;

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

      <hr />
      <div>{renderAircraft()}</div>
      <hr />

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