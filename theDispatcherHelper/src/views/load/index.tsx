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
    V7: {
        name: "Volotea",
        aircrafts: ["A319", "A320"],
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

        const weight = Math.max(0, totalWeightInput - avihWeight - wchWeight);
        const bagWeightPerPiece = bags > 0 ? weight / bags : 0;

        const pesoTotalInput = Number(pesoTotal) || 0;
        const pesoEspeciais = specialLoads.reduce((a, b) => a + b.weight, 0);
        const pesoBagagemLiquido = Math.max(0, pesoTotalInput - pesoEspeciais);

        let seq: LoadingStep[] = [];
        let regraGeral = "";
        let totalWeightToSplit = weight;

        if (company === "TVF") {
            if (aircraft === "B737-800") {
                regraGeral = "H1 heavy · H2 50% · H3 50%";
                let weightToDistribute = pesoBagagemLiquido;
                const splitSpecials = specialLoads.filter(load => load.hold === "H2" || load.hold === "H3");

                splitSpecials.forEach(load => {
                    weightToDistribute += load.weight;
                });

                const h2Pcs = Math.ceil(bags / 2);
                const h3Pcs = bags - h2Pcs;
                const h2WeightTotal = Math.round(weightToDistribute / 2);
                const h3WeightTotal = weightToDistribute - h2WeightTotal; // Garante que o peso total bata 100%

                seq.push({
                    hold: "H2",
                    ruleLabel: "50% Bags",
                    pcs: h2Pcs,
                    weight: h2WeightTotal
                });

                seq.push({
                    hold: "H3",
                    ruleLabel: "50% Bags",
                    pcs: h3Pcs,
                    weight: h3WeightTotal
                });

                specialLoads.forEach(load => {
                    const existingStep = seq.find(s => s.hold === load.hold);

                    if (existingStep) {
                        if (!existingStep.ruleLabel.includes(load.type)) {
                            existingStep.ruleLabel += ` + ${load.type || "Special"}`;
                        }
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type || "Special Load",
                            pcs: 0,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            } else if (aircraft === "A320") {
                regraGeral = "H1 50% · H3 50%";
                const splitSpecials = specialLoads.filter(load => load.hold === "H1" || load.hold === "H3");

                splitSpecials.forEach(load => {
                    totalWeightToSplit += load.weight;
                });

                seq.push({
                    hold: "H1",
                    ruleLabel: "50% Bags",
                    pcs: Math.ceil(bags / 2),
                    weight: Math.ceil(totalWeightToSplit / 2)
                });

                seq.push({
                    hold: "H3",
                    ruleLabel: "50% Bags",
                    pcs: Math.floor(bags / 2),
                    weight: Math.floor(totalWeightToSplit / 2)
                });

                specialLoads.forEach(load => {
                    const existingStep = seq.find(s => s.hold === load.hold);

                    if (existingStep) {
                        existingStep.ruleLabel += ` + ${load.type || "Special"}`;
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type || "Special Load",
                            pcs: 0,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            } else if (aircraft === "A321") {
                if (weight <= 800) {
                    regraGeral = "≤ 800 kg H3 prioritário";
                    const splitSpecials = specialLoads.filter(load => load.hold === "H3");


                    splitSpecials.forEach(load => {
                        totalWeightToSplit += load.weight;
                    });

                    seq.push({ hold: "H3", ruleLabel: "Prioritário", pcs: bags, weight: weight });

                    specialLoads.forEach(load => {
                        const existingStep = seq.find(s => s.hold === load.hold);

                        if (existingStep) {
                            existingStep.ruleLabel += ` + ${load.type || "Special"}`;
                        } else {
                            seq.push({
                                hold: load.hold,
                                ruleLabel: load.type || "Special Load",
                                pcs: 0,
                                weight: load.weight,
                                isSpecialOnly: true
                            });
                        }
                    });
                } else {
                    regraGeral = "> 800 kg H2 30% · H3 40% · H4 30% · H2 rest · H5 AVIH";

                    const splitSpecials = specialLoads.filter(load => load.hold === "H2" || load.hold === "H3" || load.hold === "H4");

                    splitSpecials.forEach(load => {
                        totalWeightToSplit += load.weight;
                    });

                    // 2. Cálculo das Peças (evitando que sobrem ou faltem malas)
                    let pcsH1 = Math.round(bags * 0.3);
                    let pcsH3 = Math.round(bags * 0.4);
                    let pcsH4 = bags - (pcsH1 + pcsH3); // O último porão pega o que sobrar para fechar 100%

                    // 3. Cálculo dos Pesos (usando o totalWeightToSplit)
                    let weightH1 = Math.round(totalWeightToSplit * 0.3);
                    let weightH3 = Math.round(totalWeightToSplit * 0.4);
                    let weightH4 = totalWeightToSplit - (weightH1 + weightH3); // Garante que o peso bruto total bata

                    seq.push({
                        hold: "H2",
                        ruleLabel: "30% Bags",
                        pcs: pcsH1,
                        weight: weightH1
                    });

                    seq.push({
                        hold: "H3",
                        ruleLabel: "40% Bags",
                        pcs: pcsH3,
                        weight: weightH3
                    });

                    seq.push({
                        hold: "H4",
                        ruleLabel: "30% Bags",
                        pcs: pcsH4,
                        weight: weightH4
                    });

                    // 4. Processar labels dos especiais e adicionar porões extras (H1, H5)
                    specialLoads.forEach(load => {
                        const existingStep = seq.find(s => s.hold === load.hold);

                        if (existingStep) {
                            existingStep.ruleLabel += ` + ${load.type || "Special"}`;

                        } else {
                            seq.push({
                                hold: load.hold,
                                ruleLabel: load.type || "Special Load",
                                pcs: 0,
                                weight: load.weight,
                                isSpecialOnly: true
                            });
                        }
                    });
                }
            }


        } else if (company === "EZY") {
            if (aircraft === "A319") {
                regraGeral = "H1 rest · H4 ~100 pcs";
                const h4Bags = Math.min(bags, 100);
                const h4Weight = Math.round(h4Bags * bagWeightPerPiece);
                seq.push({ hold: "H4", ruleLabel: "~100 pcs", pcs: h4Bags + wchPcs, weight: h4Weight + wchWeight });
                seq.push({ hold: "H1", ruleLabel: "Rest", pcs: (bags - h4Bags) + avihPcs, weight: (weight - h4Weight) + avihWeight });
            } else if (aircraft === "A320") {
                regraGeral = "H1 85 pcs · H3 60 pcs · H4 rest";
                const h1Bags = Math.min(bags, 85); const h1Weight = Math.round(h1Bags * bagWeightPerPiece);
                const h3Bags = Math.min(bags - h1Bags, 60); const h3Weight = Math.round(h3Bags * bagWeightPerPiece);
                seq.push({ hold: "H1", ruleLabel: "85 pcs", pcs: h1Bags + avihPcs, weight: h1Weight + avihWeight });
                seq.push({ hold: "H3", ruleLabel: "60 pcs", pcs: h3Bags, weight: h3Weight });
                seq.push({ hold: "H4", ruleLabel: "Rest", pcs: (bags - h1Bags - h3Bags) + wchPcs, weight: (weight - h1Weight - h3Weight) + wchWeight });
            } else if (aircraft === "A321") {
                regraGeral = "H1 NIL · H2 rest · H3 100 pcs · H4 50 pcs";
                const h3Bags = Math.min(bags, 100); const h3Weight = Math.round(h3Bags * bagWeightPerPiece);
                const h4Bags = Math.min(bags - h3Bags, 50); const h4Weight = Math.round(h4Bags * bagWeightPerPiece);
                seq.push({ hold: "H3", ruleLabel: "100 pcs", pcs: h3Bags, weight: h3Weight });
                seq.push({ hold: "H4", ruleLabel: "50 pcs", pcs: h4Bags + avihPcs + wchPcs, weight: h4Weight + avihWeight + wchWeight });
                seq.push({ hold: "H2", ruleLabel: "Rest", pcs: Math.max(0, bags - h3Bags - h4Bags), weight: Math.max(0, weight - h3Weight - h4Weight) });
            }
        } else if (company === "EW") {
            if (aircraft === "A319") {
                regraGeral = "H4 Max 85 pcs / 1350 kg · H5 450 kg · H1 rest";
                const pesoMedio = bags > 0 ? pesoBagagemLiquido / bags : 0;

                let weightSpecialsH4 = 0;
                specialLoads.filter(l => l.hold === "H4").forEach(l => weightSpecialsH4 += l.weight);

                const espacoDisponivelH4 = Math.max(0, 1350 - weightSpecialsH4);
                const maxPecasPorPesoH4 = pesoMedio > 0 ? Math.floor(espacoDisponivelH4 / pesoMedio) : 0;

                const h4Bags = Math.min(bags, maxPecasPorPesoH4, 85);
                const h4WeightBags = Math.round(h4Bags * pesoMedio);

                let weightSpecialsH5 = 0;
                specialLoads.filter(l => l.hold === "H5").forEach(l => weightSpecialsH5 += l.weight);

                const espacoDisponivelH5 = Math.max(0, 450 - weightSpecialsH5);
                const restanteBagsPosH4 = bags - h4Bags;
                const maxPecasH5 = pesoMedio > 0 ? Math.floor(espacoDisponivelH5 / pesoMedio) : 0;

                const h5Bags = Math.min(restanteBagsPosH4, maxPecasH5);
                const h5WeightBags = Math.round(h5Bags * pesoMedio);
                const h1Bags = restanteBagsPosH4 - h5Bags;
                const h1WeightBags = Math.max(0, Math.round(pesoBagagemLiquido - h4WeightBags - h5WeightBags));

                seq.push({
                    hold: "H4",
                    ruleLabel: "Max 85pcs/1350kg",
                    pcs: h4Bags,
                    weight: h4WeightBags + weightSpecialsH4
                });

                seq.push({
                    hold: "H5",
                    ruleLabel: "Max 450 kg",
                    pcs: h5Bags,
                    weight: h5WeightBags + weightSpecialsH5
                });

                seq.push({
                    hold: "H1",
                    ruleLabel: "Rest",
                    pcs: h1Bags,
                    weight: h1WeightBags + (specialLoads.find(l => l.hold === "H1")?.weight || 0)
                });

                specialLoads.forEach(load => {
                    const existingStep = seq.find(s => s.hold === load.hold);
                    if (existingStep) {
                        if (!existingStep.ruleLabel.includes(load.type)) {
                            existingStep.ruleLabel += ` + ${load.type || "Special"}`;
                        }
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type || "Special Load",
                            pcs: 0,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            } else if (aircraft === "A320") {
                regraGeral = "H1 85pcs/1500kg · H3 1000kg · H4 1000kg · H5 rest";
                const pesoMedio = bags > 0 ? pesoBagagemLiquido / bags : 0;
                let malasRestantes = bags;
                const specialWeightsByHold: Record<string, number> = {};
                specialLoads.forEach(load => {
                    specialWeightsByHold[load.hold] = (specialWeightsByHold[load.hold] || 0) + load.weight;
                });

                const calcularPorão = ({ limitWeight, limitPcs, holdName }: any) => {
                    const pesoEspecialNoHold = specialWeightsByHold[holdName] || 0;
                    const espacoDisponivel = Math.max(0, limitWeight - pesoEspecialNoHold);

                    let qtdMalas = pesoMedio > 0 ? Math.floor(espacoDisponivel / pesoMedio) : 0;
                    if (limitPcs) qtdMalas = Math.min(qtdMalas, limitPcs);

                    const finalBags = Math.min(malasRestantes, qtdMalas);
                    malasRestantes -= finalBags;

                    return {
                        pcs: finalBags,
                        weightBags: Math.round(finalBags * pesoMedio),
                        weightSpecial: pesoEspecialNoHold
                    };
                };

                const resH1 = calcularPorão({ limitWeight: 1500, limitPcs: 85, holdName: "H1" });
                const resH3 = calcularPorão({ limitWeight: 1000, limitPcs: null, holdName: "H3" });
                const resH4 = calcularPorão({ limitWeight: 1000, limitPcs: null, holdName: "H4" });
                const h5Bags = malasRestantes;
                const pesoEspecialH5 = specialWeightsByHold["H5"] || 0;
                const h5WeightBags = Math.max(0, Math.round(pesoBagagemLiquido - resH1.weightBags - resH3.weightBags - resH4.weightBags));

                const distribution: Record<string, { pcs: number; weight: number }> = {
                    H1: { pcs: resH1.pcs, weight: resH1.weightBags + resH1.weightSpecial },
                    H3: { pcs: resH3.pcs, weight: resH3.weightBags + resH3.weightSpecial },
                    H4: { pcs: resH4.pcs, weight: resH4.weightBags + resH4.weightSpecial },
                    H5: { pcs: h5Bags, weight: h5WeightBags + pesoEspecialH5 }
                };

                const holdsConfig = [
                    { id: "H1", label: "Max 85pcs/1500kg" },
                    { id: "H3", label: "Max 1000 kg" },
                    { id: "H4", label: "Max 1000 kg" },
                    { id: "H5", label: "Restante" }
                ];

                holdsConfig.forEach(conf => {
                    seq.push({
                        hold: conf.id,
                        ruleLabel: conf.label,
                        pcs: distribution[conf.id].pcs,
                        weight: distribution[conf.id].weight
                    });
                });

                specialLoads.forEach(load => {
                    const existingStep = seq.find(s => s.hold === load.hold);
                    if (existingStep) {
                        if (!existingStep.ruleLabel.includes(load.type)) {
                            existingStep.ruleLabel += ` + ${load.type || "Special"}`;
                        }
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type || "Special Load",
                            pcs: 0,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            } else if (aircraft === "A321") {
                regraGeral = "H3 500 kg · H2 500 kg · H1 500 kg (CLC)";
                const MAX = 500;
                const avgWeight = bags > 0 ? pesoBagagemLiquido / bags : 0;
                let bagsRestantes = bags;
                const specialWeightsByHold: { [key: string]: number } = {};
                specialLoads.forEach(load => {
                    specialWeightsByHold[load.hold] = (specialWeightsByHold[load.hold] || 0) + load.weight;
                });

                const distribution: { [key: string]: { pcs: number; weight: number } } = {};
                ["H3", "H2"].forEach((hold) => {
                    const pesoEspecial = specialWeightsByHold[hold] || 0;
                    const espacoLivre = Math.max(0, MAX - pesoEspecial);

                    let qtdMalas = avgWeight > 0 ? Math.floor(espacoLivre / avgWeight) : 0;
                    const finalBags = Math.min(bagsRestantes, qtdMalas);

                    distribution[hold] = {
                        pcs: finalBags,
                        weight: Math.round(finalBags * avgWeight) + pesoEspecial
                    };

                    bagsRestantes -= finalBags;
                });

                const pesoEspecialH1 = specialWeightsByHold["H1"] || 0;
                const pesoMalasH1 = Math.round(pesoBagagemLiquido - (distribution["H3"].weight - (specialWeightsByHold["H3"] || 0)) - (distribution["H2"].weight - (specialWeightsByHold["H2"] || 0)));

                distribution["H1"] = {
                    pcs: bagsRestantes,
                    weight: pesoMalasH1 + pesoEspecialH1
                };

                ["H3", "H2", "H1"].forEach(h => {
                    seq.push({
                        hold: h,
                        ruleLabel: "500 kg",
                        pcs: distribution[h].pcs,
                        weight: distribution[h].weight
                    });
                });

                specialLoads.forEach(load => {
                    const step = seq.find(s => s.hold === load.hold);
                    if (step) {
                        if (!step.ruleLabel.includes(load.type)) {
                            step.ruleLabel += ` + ${load.type}`;
                        }
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type,
                            pcs: 0,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            }
        } else if (company === "V7") {
            if (aircraft === "A319") {
                regraGeral = "H4 85 bags (máx 3021kgs) · H5 30 bags (máx 1497kgs) · H1 rest (máx 2268kgs)";
                const pesoMedio = bags > 0 ? pesoBagagemLiquido / bags : 0;
                let malasRestantes = bags;
                const specialWeightsByHold : any = {};
                specialLoads.forEach(load => {
                    specialWeightsByHold[load.hold] = (specialWeightsByHold[load.hold] || 0) + load.weight;
                });

                const calcularPorãoA319 = ({limitWeight, limitPcs, holdName} : any) => {
                    const pesoEspecialNoHold = specialWeightsByHold[holdName] || 0;
                    const espacoDisponivelParaMalas = Math.max(0, limitWeight - pesoEspecialNoHold);
                    let qtdMalas = pesoMedio > 0 ? Math.floor(espacoDisponivelParaMalas / pesoMedio) : 0;
                    if (limitPcs) qtdMalas = Math.min(qtdMalas, limitPcs);
                    const finalBags = Math.min(malasRestantes, qtdMalas);
                    malasRestantes -= finalBags;

                    return {
                        pcs: finalBags,
                        weightBags: Math.round(finalBags * pesoMedio),
                        weightSpecial: pesoEspecialNoHold
                    };
                };

                const resH4 = calcularPorãoA319({ limitWeight: 3021, limitPcs: 85, holdName: "H4" });
                const resH5 = calcularPorãoA319({ limitWeight: 1497, limitPcs: 30, holdName: "H5" });
                const h1Bags = malasRestantes;
                const pesoEspecialH1 = specialWeightsByHold["H1"] || 0;
                const h1WeightBags = Math.max(0, Math.round(pesoBagagemLiquido - resH4.weightBags - resH5.weightBags));

                const distribution: Record<string, { pcs: number; weight: number }> = {
                    H4: { pcs: resH4.pcs, weight: resH4.weightBags + resH4.weightSpecial },
                    H5: { pcs: resH5.pcs, weight: resH5.weightBags + resH5.weightSpecial },
                    H1: { pcs: h1Bags, weight: h1WeightBags + pesoEspecialH1 }
                };

                const holdsConfig = [
                    { id: "H4", label: "85 bags (máx 3021kg)" },
                    { id: "H5", label: "30 bags (máx 1497kg)" },
                    { id: "H1", label: "Rest (máx 2268kg)" }
                ];

                holdsConfig.forEach(conf => {
                    seq.push({
                        hold: conf.id,
                        ruleLabel: conf.label,
                        pcs: distribution[conf.id].pcs,
                        weight: distribution[conf.id].weight
                    });
                });

                specialLoads.forEach(load => {
                    const existingStep = seq.find(s => s.hold === load.hold);
                    if (existingStep) {
                        if (!existingStep.ruleLabel.includes(load.type)) {
                            existingStep.ruleLabel += ` + ${load.type}`;
                        }
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type,
                            pcs: 0,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });

            }
            else if (aircraft === "A320") {
                regraGeral = "H1 95 bags (máx 3402 kgs) · H3 55 bags (máx 2426 kgs) · H4 rest(máx 2110 kgs)";

                 const pesoMedio = bags > 0 ? pesoBagagemLiquido / bags : 0;
                let malasRestantes = bags;
                const specialWeightsByHold : any = {};
                specialLoads.forEach(load => {
                    specialWeightsByHold[load.hold] = (specialWeightsByHold[load.hold] || 0) + load.weight;
                });

                const calcularPorãoA320 = ({limitWeight, limitPcs, holdName} : any) => {
                    const pesoEspecialNoHold = specialWeightsByHold[holdName] || 0;
                    const espacoDisponivelParaMalas = Math.max(0, limitWeight - pesoEspecialNoHold);
                    let qtdMalas = pesoMedio > 0 ? Math.floor(espacoDisponivelParaMalas / pesoMedio) : 0;
                    if (limitPcs) qtdMalas = Math.min(qtdMalas, limitPcs);
                    const finalBags = Math.min(malasRestantes, qtdMalas);
                    malasRestantes -= finalBags;

                    return {
                        pcs: finalBags,
                        weightBags: Math.round(finalBags * pesoMedio),
                        weightSpecial: pesoEspecialNoHold
                    };
                };

                const resH1 = calcularPorãoA320({ limitWeight: 3402, limitPcs: 95, holdName: "H1" });
                const resH3 = calcularPorãoA320({ limitWeight: 2426, limitPcs: 55, holdName: "H3" });
                const resH4 = calcularPorãoA320({ limitWeight: 2110, limitPcs: null, holdName: "H4" });

                const distribution: Record<string, { pcs: number; weight: number }> = {
                    H1: { pcs: resH1.pcs, weight: resH1.weightBags + resH1.weightSpecial },
                    H3: { pcs: resH3.pcs, weight: resH3.weightBags + resH3.weightSpecial },
                    H4: { pcs: resH4.pcs, weight: resH4.weightBags + resH4.weightSpecial }
                };

                const holdsConfig = [
                    { id: "H1", label: "95 bags (máx 3402 kgs)" },
                    { id: "H3", label: "30 bags (máx 2426 kgs)" },
                    { id: "H4", label: "Rest (máx 2110 kgs)" }
                ];

                holdsConfig.forEach(conf => {
                    seq.push({
                        hold: conf.id,
                        ruleLabel: conf.label,
                        pcs: distribution[conf.id].pcs,
                        weight: distribution[conf.id].weight
                    });
                });

                specialLoads.forEach(load => {
                    const existingStep = seq.find(s => s.hold === load.hold);
                    if (existingStep) {
                        if (!existingStep.ruleLabel.includes(load.type)) {
                            existingStep.ruleLabel += ` + ${load.type}`;
                        }
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type,
                            pcs: 0,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
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
    const bags = Math.max(0, Number(totalBags) - specialPcs);
    const specialStepWeights = dist?.sequence.filter(step => step.isSpecialOnly).map(step => step.weight) ?? [];
    const totalBagsNum = Number(totalBags) || 0;
    const pesoMedioReal = bags > 0 ? (pesoBagagemLiquido / bags).toFixed(2) : "0";
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