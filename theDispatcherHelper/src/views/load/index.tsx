import { useState } from "react";

const companies = {
    EZY: {
        name: "easyJet",
        aircrafts: ["A319", "A320", "A321"],
    },
    TVF: {
        name: "Transavia",
        aircrafts: ["B737-800", "A320", "A321"],
    },
    EW: {
        name: "Eurowings",
        aircrafts: ["A319", "A320", "A321"],
    },
};

type SpecialLoad = {
    id: string;
    type: "AVIH" | "WCMP" | "WCBD" | "WCBW" | "WCLB";
    weight: number;
    hold: string;
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


export default function Loads() {
    const [company, setCompany] = useState<keyof typeof companies | "">("");
    const [aircraft, setAircraft] = useState("");
    const [pesoTotal, setPesoTotal] = useState<number | "">("");
    const [totalBags, setTotalBags] = useState<number | "">("");
    const [specialLoads, setSpecialLoads] = useState<SpecialLoad[]>([]);
    const [tempType, setTempType] = useState<"AVIH" | "WCMP" | "WCBD" | "WCBW" | "WCLB">("AVIH");
    const [tempWeight, setTempWeight] = useState<number | "">("");
    const [holdSelected, setHoldSelected] = useState<"H1" | "H2" | "H3" | "H4" | "H5">("H1");

    const getDistribution = (): Distribution | null => {
        if (!company || !aircraft) return null;

        const bags = Number(totalBags) || 0;
        const totalWeightInput = Number(pesoTotal) || 0;

        const avihItems = specialLoads.filter(l => l.type === "AVIH");
        const avihWeight = avihItems.reduce((acc, curr) => acc + curr.weight, 0);
        const avihPcs = avihItems.length;

        const wchItems = specialLoads.filter(l => l.type !== "AVIH");
        const wchWeight = wchItems.reduce((acc, curr) => acc + curr.weight, 0);
        const wchPcs = wchItems.length;

        const specialPcs = avihPcs + wchPcs;
        const regularBags = Math.max(0, bags - specialPcs);
        const weight = Math.max(0, totalWeightInput - avihWeight - wchWeight);
        const bagWeightPerPiece = regularBags > 0 ? weight / regularBags : 0;

        const pesoTotalInput = Number(pesoTotal) || 0;
        const pesoEspeciais = specialLoads.reduce((a, b) => a + b.weight, 0);
        const pesoBagagemLiquido = Math.max(0, pesoTotalInput - pesoEspeciais);

        let seq: LoadingStep[] = [];
        let regraGeral = "";

        if (company === "TVF") {
            if (aircraft === "B737-800") {
                regraGeral = "H1 heavy · H2 50% · H3 50%";

                // 1. Calcular o peso total que DEVE ser dividido (Bagagem Comum + Especiais destinados a H2/H3)
                let totalWeightToSplit = weight; // Peso das malas regulares
                let totalPcsToSplit = regularBags;

                // Filtramos apenas os especiais que o usuário designou para H2 ou H3
                const splitSpecials = specialLoads.filter(load => load.hold === "H2" || load.hold === "H3");

                splitSpecials.forEach(load => {
                    totalWeightToSplit += load.weight;
                    // Se quiser contar peças de especiais nas malas, adicione aqui, 
                    // mas geralmente especial é contado separado.
                });

                // 2. Criar os steps de H2 e H3 com o balanceamento de 50%
                seq.push({
                    hold: "H2",
                    ruleLabel: "50% Bags",
                    pcs: Math.ceil(totalPcsToSplit / 2),
                    weight: Math.ceil(totalWeightToSplit / 2)
                });

                seq.push({
                    hold: "H3",
                    ruleLabel: "50% Bags",
                    pcs: Math.floor(totalPcsToSplit / 2),
                    weight: Math.floor(totalWeightToSplit / 2)
                });

                specialLoads.forEach(load => {
                    if (load.hold !== "H2" && load.hold !== "H3") {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: "Special Load",
                            pcs: 0, 
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            }
        } else if (aircraft === "A320") {
            regraGeral = "H1 50% · H3 50% · H4/H5 AVIH";
            seq.push({ hold: "H1", ruleLabel: "50% Bags", pcs: Math.ceil(regularBags / 2), weight: Math.ceil(weight / 2) });
            seq.push({ hold: "H3", ruleLabel: "50% Bags", pcs: Math.floor(regularBags / 2), weight: Math.floor(weight / 2) });
            if (avihWeight > 0 || wchWeight > 0) seq.push({ hold: "H5", ruleLabel: "AVIH", pcs: avihPcs + wchPcs, weight: avihWeight + wchWeight, isSpecialOnly: true });
        } else if (aircraft === "A321") {
            if (weight <= 800) {
                regraGeral = "≤ 800 kg H3 prioritário";
                seq.push({ hold: "H3", ruleLabel: "Prioritário", pcs: regularBags, weight: weight });
                if (avihWeight > 0 || wchWeight > 0) seq.push({ hold: "H5", ruleLabel: "AVIH/WCH", pcs: avihPcs + wchPcs, weight: avihWeight + wchWeight, isSpecialOnly: true });
            } else {
                regraGeral = "> 800 kg H1 30% · H3 40% · H4 30% · H2 rest · H5 AVIH";
                seq.push({ hold: "H2", ruleLabel: "30% Bags", pcs: Math.round(regularBags * 0.3), weight: Math.round(weight * 0.3) });
                seq.push({ hold: "H3", ruleLabel: "40% Bags", pcs: Math.round(regularBags * 0.4), weight: Math.round(weight * 0.4) });
                seq.push({ hold: "H4", ruleLabel: "30% Bags", pcs: regularBags - Math.round(regularBags * 0.3) - Math.round(regularBags * 0.4), weight: weight - Math.round(weight * 0.3) - Math.round(weight * 0.4) });
                if (avihWeight > 0 || wchWeight > 0) seq.push({ hold: "H5", ruleLabel: "AVIH/WCH", pcs: avihPcs + wchPcs, weight: avihWeight + wchWeight, isSpecialOnly: true });
            }
        
    } else if (company === "EZY") {
        if (aircraft === "A319") {
            regraGeral = "H1 rest · H4 ~100 pcs";
            const h4Bags = Math.min(regularBags, 100);
            const h4Weight = Math.round(h4Bags * bagWeightPerPiece);
            seq.push({ hold: "H4", ruleLabel: "~100 pcs", pcs: h4Bags + wchPcs, weight: h4Weight + wchWeight });
            seq.push({ hold: "H1", ruleLabel: "Rest", pcs: (regularBags - h4Bags) + avihPcs, weight: (weight - h4Weight) + avihWeight });
        } else if (aircraft === "A320") {
            regraGeral = "H1 85 pcs · H3 60 pcs · H4 rest";
            const h1Bags = Math.min(regularBags, 85); const h1Weight = Math.round(h1Bags * bagWeightPerPiece);
            const h3Bags = Math.min(regularBags - h1Bags, 60); const h3Weight = Math.round(h3Bags * bagWeightPerPiece);
            seq.push({ hold: "H1", ruleLabel: "85 pcs", pcs: h1Bags + avihPcs, weight: h1Weight + avihWeight });
            seq.push({ hold: "H3", ruleLabel: "60 pcs", pcs: h3Bags, weight: h3Weight });
            seq.push({ hold: "H4", ruleLabel: "Rest", pcs: (regularBags - h1Bags - h3Bags) + wchPcs, weight: (weight - h1Weight - h3Weight) + wchWeight });
        } else if (aircraft === "A321") {
            regraGeral = "H1 NIL · H2 rest · H3 100 pcs · H4 50 pcs";
            const h3Bags = Math.min(regularBags, 100); const h3Weight = Math.round(h3Bags * bagWeightPerPiece);
            const h4Bags = Math.min(regularBags - h3Bags, 50); const h4Weight = Math.round(h4Bags * bagWeightPerPiece);
            seq.push({ hold: "H3", ruleLabel: "100 pcs", pcs: h3Bags, weight: h3Weight });
            seq.push({ hold: "H4", ruleLabel: "50 pcs", pcs: h4Bags + avihPcs + wchPcs, weight: h4Weight + avihWeight + wchWeight });
            seq.push({ hold: "H2", ruleLabel: "Rest", pcs: Math.max(0, regularBags - h3Bags - h4Bags), weight: Math.max(0, weight - h3Weight - h4Weight) });
        }
    } else if (company === "EW") {
        if (aircraft === "A319") {
            regraGeral = "H4 Max 85 pcs / 1350 kg · H5 450 kg · H1 rest";

            // 1. Descobre o peso médio de cada mala
            const pesoMedio = regularBags > 0 ? pesoBagagemLiquido / regularBags : 0;

            // 2. Lógica H4 (Duplo limite: 85 peças OU 1350kg - o que atingir primeiro)
            const maxPeçasPorPesoH4 = pesoMedio > 0 ? Math.floor(1350 / pesoMedio) : 0;

            // O teto de malas do H4 será o menor valor entre o limite de peso e o limite físico de 85 malas
            const limitePecasH4 = Math.min(maxPeçasPorPesoH4, 85);

            // Preenche o H4 com as malas disponíveis, respeitando o limite calculado acima
            const h4Bags = Math.min(regularBags, limitePecasH4);
            const h4Weight = Math.round(h4Bags * pesoMedio);

            // 3. Atualiza o que sobrou de malas após preencher o H4
            const restanteBagsPosH4 = regularBags - h4Bags;

            // 4. Lógica H5 (Preenche o que sobrou até o máximo de 450kg)
            const maxPeçasH5 = pesoMedio > 0 ? Math.floor(450 / pesoMedio) : 0;
            const h5Bags = Math.min(restanteBagsPosH4, maxPeçasH5);
            const h5WeightBags = Math.round(h5Bags * pesoMedio);

            // Peso total do H5 inclui as malas + pesos especiais
            const avihW = typeof avihWeight !== 'undefined' ? avihWeight : 0;
            const wchW = typeof wchWeight !== 'undefined' ? wchWeight : 0;
            const h5TotalWeight = h5WeightBags + avihW + wchW;

            // 5. Lógica H1 (O Excedente de tudo)
            const h1Bags = restanteBagsPosH4 - h5Bags;

            // Subtração exata para evitar perdas de quilos nos arredondamentos
            const h1Weight = regularBags > 0 ? Math.round(pesoBagagemLiquido - h4Weight - h5WeightBags) : 0;

            // 6. Insere no Array
            seq.push({ hold: "H4", ruleLabel: "Max 85pcs/1350kg", pcs: h4Bags, weight: h4Weight });
            seq.push({ hold: "H5", ruleLabel: "Max 450 kg", pcs: h5Bags, weight: h5TotalWeight });
            seq.push({ hold: "H1", ruleLabel: "Rest", pcs: h1Bags, weight: h1Weight });
        } else if (aircraft === "A320") {
            regraGeral = "H1 85pcs/1500kg · H3 1000kg · H4 1000kg · H5 rest";
            const pesoMedio = regularBags > 0 ? pesoBagagemLiquido / regularBags : 0;
            let malasRestantes = regularBags;
            const wcmpWeightValue = wchItems.filter(l => l.type === "WCMP").reduce((acc, curr) => acc + curr.weight, 0);
            const wcmpWeight = typeof wcmpWeightValue !== 'undefined' ? wcmpWeightValue : 0;

            // 2. Lógica H1
            const maxPcsPesoH1 = pesoMedio > 0 ? Math.floor(1500 / pesoMedio) : 0;
            const h1Bags = Math.min(malasRestantes, Math.min(maxPcsPesoH1, 85));
            const h1WeightBase = Math.ceil(h1Bags * pesoMedio);
            malasRestantes -= h1Bags;

            // 3. Lógica H3
            const maxPcsH3 = pesoMedio > 0 ? Math.floor(1000 / pesoMedio) : 0;
            const h3Bags = Math.min(malasRestantes, maxPcsH3);
            const h3WeightBase = Math.ceil(h3Bags * pesoMedio);
            malasRestantes -= h3Bags;

            // 4. Lógica H4
            const maxPcsH4 = pesoMedio > 0 ? Math.floor(1000 / pesoMedio) : 0;
            const h4Bags = Math.min(malasRestantes, maxPcsH4);
            const h4WeightBase = Math.ceil(h4Bags * pesoMedio);
            malasRestantes -= h4Bags;

            // 5. Lógica H5 (Restante das malas)
            const h5Bags = malasRestantes;
            const h5WeightBase = Math.round(pesoBagagemLiquido - h1WeightBase - h3WeightBase - h4WeightBase) < 0
                ? 0
                : Math.ceil(pesoBagagemLiquido - h1WeightBase - h3WeightBase - h4WeightBase);

            const pesos = [h1WeightBase, h3WeightBase, h4WeightBase, h5WeightBase];

            let diferenca = pesoBagagemLiquido - pesos.reduce((a, b) => a + b, 0);

            let i = 0;
            while (diferenca !== 0) {
                pesos[i % pesos.length] += diferenca > 0 ? 1 : -1;
                diferenca += diferenca > 0 ? -1 : 1;
                i++;
            }

            const [h1Final, h3Final, h4Final, h5Final] = pesos;

            const distribution: any = {
                H1: { pcs: h1Bags, weight: h1Final },
                H3: { pcs: h3Bags, weight: h3Final },
                H4: { pcs: h4Bags, weight: h4Final },
                H5: { pcs: h5Bags, weight: h5Final }
            };

            if (distribution[holdSelected]) {
                distribution[holdSelected].weight += wcmpWeight;
            } else {
                distribution["H5"].weight += wcmpWeight;
            }

            seq.push({ hold: "H1", ruleLabel: "Max 85pcs/1500kg", pcs: distribution.H1.pcs, weight: distribution.H1.weight });
            seq.push({ hold: "H3", ruleLabel: "Max 1000 kg", pcs: distribution.H3.pcs, weight: distribution.H3.weight });
            seq.push({ hold: "H4", ruleLabel: "Max 1000 kg", pcs: distribution.H4.pcs, weight: distribution.H4.weight });
            seq.push({ hold: "H5", ruleLabel: "Restante", pcs: distribution.H5.pcs, weight: distribution.H5.weight });
        } else if (aircraft === "A321") {
            regraGeral = "H3 500 kg · H2 500 kg · H1 500 kg (CLC)";

            const MAX = 500;

            let pesoRestante = pesoBagagemLiquido + avihWeight;
            let bagsRestantes = bags;

            const avgWeight = bags > 0 ? pesoRestante / bagsRestantes : 0;

            const distribution: any = {
                H1: { pcs: 0, weight: 0 },
                H2: { pcs: 0, weight: 0 },
                H3: { pcs: 0, weight: 0 },
            };

            // 🔹 1. Distribuir entre H1 e H3 (balanceamento)
            ["H1", "H3"].forEach((hold) => {
                const capacidade = Math.min(MAX, pesoRestante);
                const pcs = avgWeight > 0 ? Math.floor(capacidade / avgWeight) : 0;

                distribution[hold].pcs = pcs;
                distribution[hold].weight = pcs * avgWeight;

                pesoRestante -= distribution[hold].weight;
                bagsRestantes -= pcs;
            });

            // 🔹 2. Jogar o restante no H2
            if (pesoRestante > 0) {
                const capacidade = Math.min(MAX, pesoRestante);
                const pcs = avgWeight > 0 ? Math.floor(capacidade / avgWeight) : 0;

                distribution.H2.pcs = pcs;
                distribution.H2.weight = pcs * avgWeight;

                pesoRestante -= distribution.H2.weight;
                bagsRestantes -= pcs;
            }

            // 🔹 3. Se ainda sobrar (casos extremos), redistribuir
            if (pesoRestante > 0) {
                // joga no mais leve
                const holds = ["H1", "H2", "H3"].sort(
                    (a, b) => distribution[a].weight - distribution[b].weight
                );

                for (const hold of holds) {
                    const espaco = MAX - distribution[hold].weight;
                    if (espaco <= 0) continue;

                    const add = Math.min(espaco, pesoRestante);
                    const pcs = avgWeight > 0 ? Math.floor(add / avgWeight) : 0;

                    distribution[hold].pcs += pcs;
                    distribution[hold].weight += pcs * avgWeight;

                    pesoRestante -= pcs * avgWeight;
                    bagsRestantes -= pcs;

                    if (pesoRestante <= 0) break;
                }
            }

            seq.push({ hold: "H3", ruleLabel: "500 kg", pcs: distribution.H3.pcs, weight: Math.round(distribution.H3.weight) });
            seq.push({ hold: "H2", ruleLabel: "500 kg", pcs: distribution.H2.pcs, weight: Math.round(distribution.H2.weight) });
            seq.push({ hold: "H1", ruleLabel: "500 kg", pcs: distribution.H1.pcs, weight: Math.round(distribution.H1.weight) });
        }
    }

    return { sequence: seq, regraGeral };
};

const dist = getDistribution();
const pesoTotalInput = Number(pesoTotal) || 0;
const pesoEspeciais = specialLoads.reduce((a, b) => a + b.weight, 0);
const pesoBagagemLiquido = Math.max(0, pesoTotalInput - pesoEspeciais);
const avihItems = specialLoads.filter(l => l.type === "AVIH");
const avihPcs = avihItems.length;
const wchItems = specialLoads.filter(l => l.type !== "AVIH");
const wchPcs = wchItems.length;
const specialPcs = avihPcs + wchPcs;
const regularBags = Math.max(0, Number(totalBags) - specialPcs);
const specialStepWeights = dist?.sequence.filter(step => step.isSpecialOnly).map(step => step.weight) ?? [];
const totalBagsNum = Number(totalBags) || 0;
const pesoMedioReal = regularBags > 0 ? (pesoBagagemLiquido / regularBags).toFixed(2) : "0";
const totalPcsGeral = totalBagsNum;

const handleAddSpecialLoad = () => {
    if (!tempWeight || !aircraft) return alert("Selecione avião e peso");

    setSpecialLoads([...specialLoads, { id: crypto.randomUUID(), type: tempType, weight: Number(tempWeight), hold: holdSelected }]);
    setTempWeight("");
};

return (
    <>
        <div className="max-w-4xl mx-auto p-6 font-sans text-slate-800">
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
                    {totalBags !== "" && <p className="text-sm font-bold text-blue-600">Peso Médio: {pesoMedioReal} kg</p>}
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

                        <div>
                            <select className="flex-1 p-2 rounded-lg border" value={holdSelected} onChange={(e) => setHoldSelected(e.target.value as any)}>
                                <option value="H1">H1</option>
                                <option value="H2">H2</option>
                                <option value="H3">H3</option>
                                <option value="H4">H4</option>
                                <option value="H5">H5</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {specialLoads.map(l => (
                            <span key={l.id} className="bg-white border text-xs px-2 py-1 rounded flex items-center gap-2 shadow-sm">
                                {l.type} - {l.hold}: {l.weight}kg <button onClick={() => setSpecialLoads(specialLoads.filter(i => i.id !== l.id))} className="text-red-500 font-black px-1">X</button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {dist && (
                <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl mt-4">
                    <hr />
                    <div className="w-full bg-slate-800 border-b border-slate-700 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Peso Médio</p>
                                <p className="text-2xl font-black text-white">{pesoMedioReal} <small className="text-xs font-normal text-slate-500">kg</small></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase">Peso total bagagem:</p>
                                <p className="text-sm font-bold text-slate-300">{pesoBagagemLiquido} kg</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="text-blue-400 font-black tracking-widest text-lg">
                            {company} - {aircraft}
                        </h3>
                        <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">
                            <p>Regra: {dist.regraGeral}</p>
                        </span>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <hr />
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


                        {specialStepWeights.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Peso Bruto Total:</p>
                                <p className="text-lg font-mono font-bold leading-tight text-slate-700">
                                    {pesoBagagemLiquido} + {specialStepWeights.length > 0 ? specialStepWeights.join(" + ") : 0} = <span className="text-green-600">{pesoTotalInput} kg</span> ✔️
                                </p>
                            </div>
                        )}


                        <p>Informações completas:</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase">Bagagem</p>
                                <p className="font-bold">{totalBags} pcs / {pesoBagagemLiquido} kg</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase">Especiais (AVIH/WCH)</p>
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
            <main className="mt-12 opacity-80"></main>
        </div>
    </>

);
}