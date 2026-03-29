import { useState } from "react";
import OperationalTips from "./components/operationalTips";
import Footer from "./components/customFooter";
import TransaviaB737 from "./components/transavia/B737";
import TransaviaA320 from "./components/transavia/A320";
import TransaviaA321 from "./components/transavia/A321";
import EasyJetA319 from "./components/easyJet/A319";
import EasyJetA320 from "./components/easyJet/A320";
import EasyJetA321 from "./components/easyJet/A321";

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

  const renderAircraft = () => {
    if (company === "TVF" && aircraft === "B737-800") return <TransaviaB737 />;
    if (company === "TVF" && aircraft === "A320") return <TransaviaA320 />;
    if (company === "TVF" && aircraft === "A321") return <TransaviaA321 />;

    //     if (company === "EWG" && aircraft === "A319") return <EurowingsA319 />;
    //     if (company === "EWG" && aircraft === "A320") return <EurowingsA320 />;
    //     if (company === "EWG" && aircraft === "A321") return <EurowingsA321 />;

    if (company === "EZY" && aircraft === "A319") return <EasyJetA319 />;
    if (company === "EZY" && aircraft === "A320") return <EasyJetA320 />;
    if (company === "EZY" && aircraft === "A321") return <EasyJetA321 />;

    //     return null;
  };



  return (
    <div style={{ padding: 20 }}>
      <h2>Load Control - The Dispatcher Helper</h2>

      {/* Companhia */}
      <select onChange={(e) => setCompany(e.target.value as CompanyCode)}>
        {Object.entries(companies).map(([code, c]) => (
          <option key={code} value={code}>
            {code} - {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      {/* Avião */}
      <select
        disabled={!company}
        onChange={(e) => setAircraft(e.target.value)}
      >
        {company &&
          companies[company].aircrafts.map((a: any) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
      </select>

      <hr />
      <div>
        {renderAircraft()}
      </div>
      <hr></hr>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow p-6">
          {/* Seus outros componentes de Body aqui */}

          <div className="mt-10 max-w-4xl mx-auto">
            <OperationalTips />
          </div>
        </main>

        <Footer />
      </div>
    </div >
  );
}