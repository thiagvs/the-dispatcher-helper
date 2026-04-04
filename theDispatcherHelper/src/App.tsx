import { useState } from "react";
import OperationalTips from "./components/operationalTips";
import Footer from "./components/customFooter";
import SidebarMenu from "./components/sideBar";

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

type SpecialLoad = {
  id: string;
  type: "AVIH" | "WCMP" | "WCBD" | "WCBW" | "WCLB";
  weight: number;
};

type Distribution = {
  sequence: LoadingStep[];
  regraGeral: string;
};

type LoadingStep = {
  hold: string;
  ruleLabel: string;
  pcs: number;
  weight: number;
  isSpecialOnly?: boolean;
};

export default function App() {
  const [company, setCompany] = useState<keyof typeof companies | "">("");
  const [aircraft, setAircraft] = useState("");
  const [pesoTotal, setPesoTotal] = useState<number | "">("");
  const [totalBags, setTotalBags] = useState<number | "">("");
  const [specialLoads, setSpecialLoads] = useState<SpecialLoad[]>([]);
  const [tempType, setTempType] = useState<"AVIH" | "WCMP" | "WCBD" | "WCBW" | "WCLB">("AVIH");
  const [tempWeight, setTempWeight] = useState<number | "">("");

  const getDistribution = (): Distribution | null => {
    if (!company || !aircraft) return null;

    const bags = Number(totalBags) || 0;
    const totalWeightInput = Number(pesoTotal) || 0;

    // Filtros de Itens Especiais (Geral)
    const avihItems = specialLoads.filter(l => l.type === "AVIH");
    const avihWeight = avihItems.reduce((acc, curr) => acc + curr.weight, 0);
    const avihPcs = avihItems.length;

    const wchItems = specialLoads.filter(l => l.type !== "AVIH");
    const wchWeight = wchItems.reduce((acc, curr) => acc + curr.weight, 0);
    const wchPcs = wchItems.length;

    // Filtros Específicos para regra da Transavia B737 (Isolando WCMP das demais cadeiras)
    const wcmpItems = specialLoads.filter(l => l.type === "WCMP");
    const wcmpWeight = wcmpItems.reduce((acc, curr) => acc + curr.weight, 0);
    const wcmpPcs = wcmpItems.length;

    const otherWchItems = specialLoads.filter(l => ["WCBD", "WCBW", "WCLB"].includes(l.type));
    const otherWchWeight = otherWchItems.reduce((acc, curr) => acc + curr.weight, 0);
    const otherWchPcs = otherWchItems.length;

    // O peso usado para calcular a divisão percentual dos porões (Peso Líquido)
    const weight = Math.max(0, totalWeightInput - avihWeight - wchWeight);

    let seq: LoadingStep[] = [];
    let regraGeral = "";

    if (company === "TVF") {
      if (aircraft === "B737-800") {
        regraGeral = "H1 heavy · H2 50% · H3 50% (+ WCMP)";

        if (avihWeight > 0) {
          seq.push({ hold: "H1", ruleLabel: "Heavy/AVIH", pcs: avihPcs, weight: avihWeight, isSpecialOnly: true });
        }

        seq.push({ hold: "H2", ruleLabel: "50% Bags", pcs: Math.ceil(bags / 2), weight: Math.ceil(weight / 2) });

        // 🔥 H3 agora recebe 50% das malas + a cadeira WCMP
        seq.push({
          hold: "H3",
          ruleLabel: wcmpPcs > 0 ? "50% Bags + WCMP" : "50% Bags",
          pcs: Math.floor(bags / 2) + wcmpPcs,
          weight: Math.floor(weight / 2) + wcmpWeight
        });

        // H4 recebe apenas as cadeiras COM bateria (WCBD, WCBW, WCLB)
        if (otherWchWeight > 0) {
          seq.push({ hold: "H4", ruleLabel: "WCH (Bat)", pcs: otherWchPcs, weight: otherWchWeight, isSpecialOnly: true });
        }
      } else if (aircraft === "A320") {
        regraGeral = "H1 50% · H3 50% · H4/H5 AVIH";
        seq.push({ hold: "H1", ruleLabel: "50% Bags", pcs: Math.ceil(bags / 2), weight: Math.ceil(weight / 2) });
        seq.push({ hold: "H3", ruleLabel: "50% Bags", pcs: Math.floor(bags / 2), weight: Math.floor(weight / 2) });
        if (avihWeight > 0 || wchWeight > 0) seq.push({ hold: "H4/H5", ruleLabel: "Especiais", pcs: avihPcs + wchPcs, weight: avihWeight + wchWeight, isSpecialOnly: true });
      } else if (aircraft === "A321") {
        if (weight <= 800) {
          regraGeral = "≤ 800 kg H3 prioritário";
          seq.push({ hold: "H3", ruleLabel: "Prioritário", pcs: bags, weight: weight });
          if (avihWeight > 0 || wchWeight > 0) seq.push({ hold: "H5", ruleLabel: "AVIH/WCH", pcs: avihPcs + wchPcs, weight: avihWeight + wchWeight, isSpecialOnly: true });
        } else {
          regraGeral = "> 800 kg H1 30% · H3 40% · H4 30% · H2 rest · H5 AVIH";
          seq.push({ hold: "H1", ruleLabel: "30% Bags", pcs: Math.round(bags * 0.3), weight: Math.round(weight * 0.3) });
          seq.push({ hold: "H3", ruleLabel: "40% Bags", pcs: Math.round(bags * 0.4), weight: Math.round(weight * 0.4) });
          seq.push({ hold: "H4", ruleLabel: "30% Bags", pcs: bags - Math.round(bags * 0.3) - Math.round(bags * 0.4), weight: weight - Math.round(weight * 0.3) - Math.round(weight * 0.4) });
          if (avihWeight > 0 || wchWeight > 0) seq.push({ hold: "H5", ruleLabel: "AVIH/WCH", pcs: avihPcs + wchPcs, weight: avihWeight + wchWeight, isSpecialOnly: true });
        }
      }
    } else if (company === "EZY") {
      if (aircraft === "A319") {
        regraGeral = "H1 rest · H4 ~100 pcs";
        const h4Bags = Math.min(bags, 100);
        const h4Weight = Math.round(h4Bags * (weight / bags || 0));
        seq.push({ hold: "H4", ruleLabel: "~100 pcs", pcs: h4Bags + wchPcs, weight: h4Weight + wchWeight });
        seq.push({ hold: "H1", ruleLabel: "Rest", pcs: (bags - h4Bags) + avihPcs, weight: (weight - h4Weight) + avihWeight });
      } else if (aircraft === "A320") {
        regraGeral = "H1 85 pcs · H3 60 pcs · H4 rest";
        const h1Bags = Math.min(bags, 85); const h1Weight = Math.round(h1Bags * (weight / bags || 0));
        const h3Bags = Math.min(bags - h1Bags, 60); const h3Weight = Math.round(h3Bags * (weight / bags || 0));
        seq.push({ hold: "H1", ruleLabel: "85 pcs", pcs: h1Bags + avihPcs, weight: h1Weight + avihWeight });
        seq.push({ hold: "H3", ruleLabel: "60 pcs", pcs: h3Bags, weight: h3Weight });
        seq.push({ hold: "H4", ruleLabel: "Rest", pcs: (bags - h1Bags - h3Bags) + wchPcs, weight: (weight - h1Weight - h3Weight) + wchWeight });
      } else if (aircraft === "A321") {
        regraGeral = "H1 NIL · H2 rest · H3 100 pcs · H4 50 pcs";
        const h3Bags = Math.min(bags, 100); const h3Weight = Math.round(h3Bags * (weight / bags || 0));
        const h4Bags = Math.min(bags - h3Bags, 50); const h4Weight = Math.round(h4Bags * (weight / bags || 0));
        seq.push({ hold: "H3", ruleLabel: "100 pcs", pcs: h3Bags, weight: h3Weight });
        seq.push({ hold: "H4", ruleLabel: "50 pcs", pcs: h4Bags + avihPcs + wchPcs, weight: h4Weight + avihWeight + wchWeight });
        seq.push({ hold: "H2", ruleLabel: "Rest", pcs: Math.max(0, bags - h3Bags - h4Bags), weight: Math.max(0, weight - h3Weight - h4Weight) });
      }
    } else if (company === "EWG") {
      if (aircraft === "A319") {
        regraGeral = "H4 1350 kg · H5 400 kg · H1 rest";
        const h4Weight = Math.min(weight, 1350);
        const h5Weight = Math.min(weight - h4Weight, 400);
        seq.push({ hold: "H4", ruleLabel: "Max 1350 kg", pcs: 0, weight: h4Weight });
        seq.push({ hold: "H5", ruleLabel: "Max 400 kg", pcs: avihPcs + wchPcs, weight: h5Weight + avihWeight + wchWeight });
        seq.push({ hold: "H1", ruleLabel: "Rest", pcs: bags, weight: weight - h4Weight - h5Weight });
      } else if (aircraft === "A320") {
        regraGeral = "H1 1500 kg · H3 1000 kg · H4 1000 kg";
        const h1Weight = Math.min(weight, 1500);
        const h3Weight = Math.min(weight - h1Weight, 1000);
        seq.push({ hold: "H1", ruleLabel: "Max 1500 kg", pcs: avihPcs, weight: h1Weight + avihWeight });
        seq.push({ hold: "H3", ruleLabel: "Max 1000 kg", pcs: 0, weight: h3Weight });
        seq.push({ hold: "H4", ruleLabel: "Rest", pcs: bags + wchPcs, weight: weight - h1Weight - h3Weight + wchWeight });
      } else if (aircraft === "A321") {
        regraGeral = "H3 500 kg · H2 500 kg · H1 500 kg (CLC)";
        seq.push({ hold: "H3", ruleLabel: "500 kg", pcs: 0, weight: 500 });
        seq.push({ hold: "H2", ruleLabel: "500 kg", pcs: 0, weight: 500 });
        seq.push({ hold: "H1", ruleLabel: "CLC", pcs: bags + avihPcs + wchPcs, weight: Math.max(0, weight - 1000) + avihWeight + wchWeight });
      }
    }

    return { sequence: seq, regraGeral };
  };

  const dist = getDistribution();
  const pesoTotalInput = Number(pesoTotal) || 0; // O input já é o GWT que inclui bags e especiais

  const pesoEspeciais = specialLoads.reduce((a, b) => a + b.weight, 0);
  const pesoBagagemLiquido = Math.max(0, pesoTotalInput - pesoEspeciais);

  const totalBagsNum = Number(totalBags) || 0;
  const pesoMedioReal = totalBagsNum > 0 ? (pesoBagagemLiquido / totalBagsNum).toFixed(2) : "0";

  // Total geral de itens (malas + cadeiras + animais)
  const totalPcsGeral = totalBagsNum + specialLoads.length;

  const handleAddSpecialLoad = () => {
    if (!tempWeight || !aircraft) return alert("Selecione avião e peso");
    setSpecialLoads([...specialLoads, { id: crypto.randomUUID(), type: tempType, weight: Number(tempWeight) }]);
    setTempWeight("");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 font-sans text-slate-800">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-black text-slate-900">✈️ The Dispatcher Helper</h1>
          <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">Ground Operations - Quick Reference</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-700 uppercase text-sm">Voo & Aeronave</h3>
            <select className="w-full p-3 rounded-lg border shadow-sm" value={company} onChange={(e) => { setCompany(e.target.value as any); setAircraft(""); }}>
              <option value="">Companhia</option>
              {Object.entries(companies).map(([code, c]) => <option key={code} value={code}>{code} - {c.name}</option>)}
            </select>
            <select className="w-full p-3 rounded-lg border shadow-sm" value={aircraft} disabled={!company} onChange={(e) => setAircraft(e.target.value)}>
              <option value="">Aeronave</option>
              {company && companies[company].aircrafts.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Peso Total (Bruto)" className="p-3 rounded-lg border" value={pesoTotal} onChange={(e) => setPesoTotal(e.target.value === "" ? "" : Number(e.target.value))} />
              <input type="number" placeholder="Total Bags (pcs)" className="p-3 rounded-lg border" value={totalBags} onChange={(e) => setTotalBags(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
            {totalBags !== "" && <p className="text-sm font-bold text-blue-600">Peso Médio Real: {pesoMedioReal} kg</p>}
          </div>

          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-700 uppercase text-sm">📦 Cargas Especiais</h3>
            <div className="flex gap-2">
              <select className="flex-1 p-2 rounded-lg border" value={tempType} onChange={(e) => setTempType(e.target.value as any)}>
                <option value="AVIH">AVIH - Animals in Hold</option>
                <option value="WCMP">WCMP - Cadeira manual (sem bateria)</option>
                <option value="WCBD">WCBD - Cadeira com bateria seca (dry cell)</option>
                <option value="WCBW">WCBW - Cadeira com bateria molhada (wet cell)</option>
                <option value="WCLB">WCLB - Cadeira com bateria de lítio</option>
              </select>
              <input type="number" placeholder="kg" className="w-20 p-2 rounded border" value={tempWeight} onChange={(e) => setTempWeight(e.target.value === "" ? "" : Number(e.target.value))} />
              <button onClick={handleAddSpecialLoad} className="bg-slate-900 text-white px-3 rounded font-bold">ADD</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialLoads.map(l => (
                <span key={l.id} className="bg-white border text-xs px-2 py-1 rounded flex items-center gap-2 shadow-sm">
                  {l.type}: {l.weight}kg <button onClick={() => setSpecialLoads(specialLoads.filter(i => i.id !== l.id))} className="text-red-500 font-black px-1">X</button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <hr className="border-dashed" />
        {dist && (

          <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl mt-4">
            <div className="w-full bg-slate-800 border-b border-slate-700 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Peso Médio Real</p>
                  <p className="text-2xl font-black text-white">{pesoMedioReal} <small className="text-xs font-normal text-slate-500">kg</small></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Total Peso Bagagem:</p>
                  <p className="text-sm font-bold text-slate-300">{pesoBagagemLiquido} kg</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-blue-400 font-black tracking-widest text-lg">
                {company}{aircraft}
              </h3>
              <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">
                <p>Regra: {dist.regraGeral}</p>
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-700">
                    <th className="p-3 text-center w-12">Ordem</th>
                    <th className="p-3 w-20">Porão</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3 text-right w-24">Qtd (Pcs)</th>
                    <th className="p-3 text-right w-32">Peso (Kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {dist.sequence.map((step, index) => (
                    <tr
                      key={index}
                      className={`transition-colors ${step.isSpecialOnly ? 'bg-orange-500/5' : 'hover:bg-blue-500/5'}`}
                    >
                      <td className="p-3 text-center">
                        <span className="text-slate-500 font-bold text-sm">{index + 1}º</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-black text-xs ${step.hold.includes('H1') || step.hold.includes('H2')
                          ? 'bg-blue-900/40 text-blue-400 border border-blue-800'
                          : 'bg-orange-900/40 text-orange-400 border border-orange-800'
                          }`}>
                          {step.hold}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-300 text-sm font-medium">
                          {step.ruleLabel}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-400 font-bold">
                        {step.pcs > 0 ? step.pcs : "—"}
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-white font-mono font-black text-lg">
                          {step.weight}
                          <small className="text-slate-500 text-[10px] ml-1 font-normal uppercase">kg</small>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-black text-xl flex items-center gap-2">
                  <span className="text-green-500">✅</span> CONFERÊNCIA
                </h3>
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-400">FINAL CHECK</span>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Peças Totais (Bags):</p>
                <p className="text-lg font-mono font-bold text-slate-700">
                  <span className="text-blue-600">{totalPcsGeral} pcs</span> ✔️
                </p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Peso Bruto Total:</p>
                <p className="text-lg font-mono font-bold leading-tight text-slate-700">
                  {pesoBagagemLiquido} + {pesoEspeciais} = <span className="text-green-600">{pesoTotalInput} kg</span> ✔️
                </p>
              </div>

              <hr className="border-dashed" />
              <p>Informações completas:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Bagagem/Cargo</p>
                  <p className="font-bold">{totalBags} pcs / {pesoBagagemLiquido} kg</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Especiais (AVIH/WCH)</p>
                  <p className="font-bold text-orange-600">{specialLoads.length} itens / {pesoEspeciais} kg</p>
                </div>
              </div>

              <div className="space-y-1">
                {dist.sequence.map((step, i) => (
                  <div key={i} className="flex justify-between text-xs font-mono border-b border-slate-50 py-1">
                    <span className="text-slate-500">{step.hold}: </span>
                    <span className="font-bold">{step.pcs > 0 ? `${step.pcs} pcs  / ` : ""}{step.weight} kg</span>
                  </div>
                ))}
              </div>
              <p className="text-center pt-2 text-sm font-black text-slate-800">TOTAL: {totalPcsGeral} pcs / {pesoTotalInput} kg</p>
            </div>
          </div>
        )}
        <hr className="border-dashed" />
        <main className="mt-12 opacity-80"><OperationalTips /></main>
        <Footer />
      </div>
    </>

  );
}