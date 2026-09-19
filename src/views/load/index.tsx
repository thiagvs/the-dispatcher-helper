import { useState } from "react";
import LdmModal from "../modalLDM";
import { useLocalStorage } from './../../hooks/useLocalStorage';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    Divider,
    Alert
} from '@mui/material';

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
    LS: {
        name: "Jet2",
        aircrafts: ["B737-300", "B737-800", "A321"],
    }
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
    hint: string;
};

type LoadingStep = {
    hold: string;
    ruleLabel: string;
    pcs: number;
    weight: number;
    isSpecialOnly?: boolean;
};


export default function Loads() {
    const [company, setCompany] = useLocalStorage<keyof typeof companies | "">("dh-company", "");
    const [aircraft, setAircraft] = useLocalStorage<string>("dh-aircraft", "");
    const [pesoTotal, setPesoTotal] = useLocalStorage<number | "">("dh-pesoTotal", "");
    const [totalBags, setTotalBags] = useLocalStorage<number | "">("dh-totalBags", "");
    const [specialLoads, setSpecialLoads] = useLocalStorage<SpecialLoad[]>("dh-specialLoads", []);
    const [tempType, setTempType] = useState<"AVIH" | "WCMP" | "WCBD" | "WCBW" | "WCLB">("AVIH");
    const [tempWeight, setTempWeight] = useState<number | "">("");
    const [holdSelected, setHoldSelected] = useState<"H1" | "H2" | "H3" | "H4" | "H5">("H1");
    const [isLdmModalOpen, setIsLdmModalOpen] = useState(false);

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
        const specialPcs = specialLoads.length;
        const bagsToDistribute = Math.max(0, bags - specialPcs);
        const bagWeightPerPiece = bags > 0 ? weight / bags : 0;

        const pesoTotalInput = Number(pesoTotal) || 0;
        const pesoEspeciais = specialLoads.reduce((a, b) => a + b.weight, 0);
        const pesoBagagemLiquido = Math.max(0, pesoTotalInput - pesoEspeciais);

        let seq: LoadingStep[] = [];
        let regraGeral = "";
        let totalWeightToSplit = weight;
        let hint = "";

        const addSpecialLoadsToSequence = () => {
            specialLoads.forEach(load => {
                const existingStep = seq.find(s => s.hold === load.hold);

                if (existingStep) {
                    if (!existingStep.ruleLabel.includes(load.type || "Special")) {
                        existingStep.ruleLabel += ` + ${load.type || "Special"}`;
                    }

                    existingStep.pcs += 1;
                } else {
                    seq.push({
                        hold: load.hold,
                        ruleLabel: load.type || "Special Load",
                        pcs: 1,
                        weight: load.weight,
                        isSpecialOnly: true
                    });
                }
            });
        };

        if (company === "TVF") {
            if (aircraft === "B737-800") {
                regraGeral = "H1 heavy · H2 50% · H3 50%";
                hint = "H1 - AVIH e WC";
                let weightToDistribute = pesoBagagemLiquido;

                const splitSpecials = specialLoads.filter(
                    load => load.hold === "H2" || load.hold === "H3"
                );

                splitSpecials.forEach(load => {
                    weightToDistribute += load.weight;
                });

                const h3Pcs = Math.ceil(bagsToDistribute / 2);
                const h2Pcs = bagsToDistribute - h3Pcs;

                const h2WeightTotal = Math.round(weightToDistribute / 2);
                const h3WeightTotal = weightToDistribute - h2WeightTotal;

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

                addSpecialLoadsToSequence();

            } else if (aircraft === "A320") {
                regraGeral = "H1 50% · H3 50%";

                const splitSpecials = specialLoads.filter(
                    load => load.hold === "H1" || load.hold === "H3"
                );

                splitSpecials.forEach(load => {
                    totalWeightToSplit += load.weight;
                });

                const h3BasePcs = Math.ceil(bagsToDistribute / 2);
                const h1BasePcs = Math.floor(bagsToDistribute / 2);

                seq.push({
                    hold: "H1",
                    ruleLabel: "50% Bags",
                    pcs: h1BasePcs,
                    weight: Math.ceil(totalWeightToSplit / 2)
                });

                seq.push({
                    hold: "H3",
                    ruleLabel: "50% Bags",
                    pcs: h3BasePcs,
                    weight: Math.floor(totalWeightToSplit / 2)
                });

                addSpecialLoadsToSequence();
            } else if (aircraft === "A321") {
                if (weight <= 800) {

                    regraGeral = "≤ 800 kg H3 prioritário";

                    const splitSpecials = specialLoads.filter(
                        load => load.hold === "H3"
                    );

                    splitSpecials.forEach(load => {
                        totalWeightToSplit += load.weight;
                    });

                    seq.push({
                        hold: "H3",
                        ruleLabel: "Prioritário",
                        pcs: bagsToDistribute,
                        weight: weight
                    });

                    addSpecialLoadsToSequence();

                } else {

                    regraGeral = "> 800 kg H2 30% · H3 40% · H4 30% · H2 rest · H5 AVIH";

                    const splitSpecials = specialLoads.filter(
                        load =>
                            load.hold === "H2" ||
                            load.hold === "H3" ||
                            load.hold === "H4"
                    );

                    splitSpecials.forEach(load => {
                        totalWeightToSplit += load.weight;
                    });

                    let pcsH2 = Math.round(bagsToDistribute * 0.3);
                    let pcsH3 = Math.round(bagsToDistribute * 0.4);
                    let pcsH4 = bagsToDistribute - (pcsH2 + pcsH3);

                    let weightH2 = Math.round(totalWeightToSplit * 0.3);
                    let weightH3 = Math.round(totalWeightToSplit * 0.4);
                    let weightH4 = totalWeightToSplit - (weightH2 + weightH3);

                    seq.push({
                        hold: "H2",
                        ruleLabel: "30% Bags",
                        pcs: pcsH2,
                        weight: weightH2
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

                    addSpecialLoadsToSequence();
                }
            }

            // to-do: revisar regras da EZY com Bianca, necessário fazer!!!
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
        }
        // to-do: revisar regras da EZY com Bianca, necessário fazer!!!
        else if (company === "EW") {
            if (aircraft === "A319") {
                regraGeral = "H4 Max 85 pcs / 1350 kg · H5 450 kg · H1 rest";
                const pesoMedio = bagsToDistribute > 0 ? pesoBagagemLiquido / bagsToDistribute : 0;

                let weightSpecialsH4 = 0;
                specialLoads.filter(l => l.hold === "H4").forEach(l => weightSpecialsH4 += l.weight);

                const espacoDisponivelH4 = Math.max(0, 1350 - weightSpecialsH4);
                const maxPecasPorPesoH4 = pesoMedio > 0 ? Math.floor(espacoDisponivelH4 / pesoMedio) : 0;

                const h4Bags = Math.min(bagsToDistribute, maxPecasPorPesoH4, 85);
                const h4WeightBags = Math.round(h4Bags * pesoMedio);

                let weightSpecialsH5 = 0;
                specialLoads.filter(l => l.hold === "H5").forEach(l => weightSpecialsH5 += l.weight);

                const espacoDisponivelH5 = Math.max(0, 450 - weightSpecialsH5);
                const restanteBagsPosH4 = bagsToDistribute - h4Bags;
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
                        existingStep.ruleLabel += ` + ${load.type || "Special"}`;
                        existingStep.weight += load.weight;
                        existingStep.pcs += 1;
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type || "Special Load",
                            pcs: 1,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            } else if (aircraft === "A320") {
                regraGeral = "H1 85pcs/1500kg · H3 1000kg · H4 1000kg · H5 rest";
                const pesoMedio = bagsToDistribute > 0 ? pesoBagagemLiquido / bagsToDistribute : 0;
                let malasRestantes = bagsToDistribute;
                let pesoRestanteMalas = pesoBagagemLiquido;

                // 1. Mapear pesos e peças especiais por porão ANTES da distribuição de malas
                const specialWeightsByHold: Record<string, number> = {};
                const specialPcsByHold: Record<string, number> = {};

                specialLoads.forEach(load => {
                    specialWeightsByHold[load.hold] = (specialWeightsByHold[load.hold] || 0) + load.weight;
                    specialPcsByHold[load.hold] = (specialPcsByHold[load.hold] || 0) + 1;
                });

                const calcularPorão = ({ limitWeight, limitPcs, holdName }: any) => {
                    const pesoEspecialNoHold = specialWeightsByHold[holdName] || 0;
                    const pcsEspeciaisNoHold = specialPcsByHold[holdName] || 0;

                    // Desconta o peso especial do limite do porão
                    const espacoDisponivel = Math.max(0, limitWeight - pesoEspecialNoHold);

                    // NOVIDADE: Desconta a quantidade de peças especiais do limite de peças permitido
                    let limitePcsMalas = limitPcs ? Math.max(0, limitPcs - pcsEspeciaisNoHold) : null;

                    let qtdMalas = pesoMedio > 0 ? Math.floor(espacoDisponivel / pesoMedio) : 0;
                    if (limitePcsMalas !== null) qtdMalas = Math.min(qtdMalas, limitePcsMalas);

                    const finalBags = Math.min(malasRestantes, qtdMalas);
                    malasRestantes -= finalBags;

                    // Distribuição de peso dinâmica para eliminar dízimas e quilos fantasmas
                    let weightBags = 0;
                    if (finalBags > 0) {
                        if (malasRestantes === 0) {
                            weightBags = pesoRestanteMalas; // O último porão a receber malas absorve o resto exato
                        } else {
                            weightBags = Math.round(finalBags * pesoMedio);
                        }
                        pesoRestanteMalas -= weightBags;
                    }

                    return {
                        pcs: finalBags,
                        weightBags: weightBags
                    };
                };

                // 2. Executar a distribuição por ordem de prioridade da companhia
                const resH1 = calcularPorão({ limitWeight: 1500, limitPcs: 85, holdName: "H1" });
                const resH3 = calcularPorão({ limitWeight: 1000, limitPcs: null, holdName: "H3" });
                const resH4 = calcularPorão({ limitWeight: 1000, limitPcs: null, holdName: "H4" });

                // H5 pega rigorosamente o que sobrou de malas e peso líquido
                const h5Bags = malasRestantes;
                let h5WeightBags = 0;
                if (h5Bags > 0 || pesoRestanteMalas > 0) {
                    h5WeightBags = pesoRestanteMalas;
                    pesoRestanteMalas = 0;
                }

                // 3. Montar a estrutura da tabela APENAS com as malas calculadas
                const distribution: Record<string, { pcs: number; weight: number }> = {
                    H1: { pcs: resH1.pcs, weight: resH1.weightBags },
                    H3: { pcs: resH3.pcs, weight: resH3.weightBags },
                    H4: { pcs: resH4.pcs, weight: resH4.weightBags },
                    H5: { pcs: h5Bags, weight: h5WeightBags }
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

                // 4. Somar os especiais consolidando as peças e pesos de forma limpa
                specialLoads.forEach(load => {
                    const existingStep = seq.find(s => s.hold === load.hold);
                    if (existingStep) {
                        if (!existingStep.ruleLabel.includes(load.type)) {
                            existingStep.ruleLabel += ` + ${load.type || "Special"}`;
                        }
                        existingStep.weight += load.weight;
                        existingStep.pcs += 1; // Soma o especial aqui com segurança total
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type || "Special Load",
                            pcs: 1,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            } else if (aircraft === "A321") {
                regraGeral = "H3 500 kg · H2 500 kg · H1 500 kg (CLC)";
                const MAX = 500;
                const avgWeight = bagsToDistribute > 0 ? pesoBagagemLiquido / bagsToDistribute : 0;
                let bagsRestantes = bagsToDistribute;
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
                            step.weight += load.weight;
                            step.pcs += 1;
                        }
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type,
                            pcs: 1,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            }
        } else if (company === "V7") {
            if (aircraft === "A319") {
                regraGeral = "H4 85 bags (máx 3021kgs) · H5 30 bags (máx 1497kgs) · H1 rest (máx 2268kgs)";
                const pesoMedio = bagsToDistribute > 0 ? pesoBagagemLiquido / bagsToDistribute : 0;
                let malasRestantes = bagsToDistribute;
                const specialWeightsByHold: any = {};
                specialLoads.forEach(load => {
                    specialWeightsByHold[load.hold] = (specialWeightsByHold[load.hold] || 0) + load.weight;
                });

                const calcularPorãoA319 = ({ limitWeight, limitPcs, holdName }: any) => {
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
                        existingStep.ruleLabel += ` + ${load.type}`;
                        existingStep.weight += load.weight;
                        existingStep.pcs += 1;
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type,
                            pcs: 1,
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
                const specialWeightsByHold: any = {};
                specialLoads.forEach(load => {
                    specialWeightsByHold[load.hold] = (specialWeightsByHold[load.hold] || 0) + load.weight;
                });

                const calcularPorãoA320 = ({ limitWeight, limitPcs, holdName }: any) => {
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
                        existingStep.ruleLabel += ` + ${load.type}`;
                        existingStep.weight += load.weight;
                        existingStep.pcs += 1;
                    } else {
                        seq.push({
                            hold: load.hold,
                            ruleLabel: load.type,
                            pcs: 1,
                            weight: load.weight,
                            isSpecialOnly: true
                        });
                    }
                });
            }
        } else if (company === "LS") {
            hint = "H1 - WC (não aceita AVIH)";
            if (aircraft === "B737-800") {
                regraGeral = "H2 1/3 e H3 2/3";

                let weightToDistribute = pesoBagagemLiquido;
                const splitSpecials = specialLoads.filter(load => load.hold === "H2" || load.hold === "H3");

                splitSpecials.forEach(load => {
                    weightToDistribute += load.weight;
                });

                // 2. DISTRIBUIR PEÇAS (1/3 para H2 e o Resto para H3)
                // Usamos Math.round para evitar que 0.333 quebre a lógica, ou Math.floor se preferir arredondar para baixo
                const h2Pcs = Math.round(bags / 3);
                const h3Pcs = bags - h2Pcs; // O H3 absorve exatamente as malas restantes

                // 3. DISTRIBUIR PESOS (1/3 para H2 e o Resto para H3)
                const h2WeightTotal = Math.round(weightToDistribute / 3);
                const h3WeightTotal = weightToDistribute - h2WeightTotal; // Garante que a soma total feche perfeitamente

                // 4. SOMAR TUDO (Alimentar a sequência de exibição)
                seq.push({
                    hold: "H2",
                    ruleLabel: "1/3 Bags",
                    pcs: h2Pcs,
                    weight: h2WeightTotal
                });

                seq.push({
                    hold: "H3",
                    ruleLabel: "2/3 Bags",
                    pcs: h3Pcs,
                    weight: h3WeightTotal
                });

                addSpecialLoadsToSequence();

            } else if (aircraft === "B737-300") {
                regraGeral = "B733: 20 H4 -> 100 H3 -> Restante H2 | Carregamento Fwd/Aft Simultâneo";
                const h4Pcs = Math.min(bags, 20);
                let remainingBags = bags - h4Pcs;
                const h3Pcs = Math.min(remainingBags, 100);
                const h2Pcs = remainingBags - h3Pcs;

                // Distribuição proporcional dos pesos baseada nas peças
                const avgWeight = bags > 0 ? (pesoBagagemLiquido / bags) : 0;
                const h4Weight = Math.round(h4Pcs * avgWeight);
                const h3Weight = Math.round(h3Pcs * avgWeight);
                const h2Weight = pesoBagagemLiquido - h4Weight - h3Weight; // Absorve resíduo de arredondamento

                // Alimenta a sequência se houver peças
                if (h4Pcs > 0) seq.push({ hold: "H4", ruleLabel: "First 20 Bags", pcs: h4Pcs, weight: h4Weight });
                if (h3Pcs > 0) seq.push({ hold: "H3", ruleLabel: "Next 100 Bags", pcs: h3Pcs, weight: h3Weight });
                if (h2Pcs > 0) seq.push({ hold: "H2", ruleLabel: "Remainder Bags", pcs: h2Pcs, weight: h2Weight });

                addSpecialLoadsToSequence();
            } else if (aircraft === "A321") {
                regraGeral = "80 H3 -> 60 H4 -> Restante H2 | Descarregar min 50 do REAR primeiro";

                const h3Pcs = Math.min(bags, 80);
                let remainingBags = bags - h3Pcs;
                const h4Pcs = Math.min(remainingBags, 60);
                const h2Pcs = remainingBags - h4Pcs;

                // Distribuição proporcional dos pesos baseada nas peças
                const avgWeight = bags > 0 ? (pesoBagagemLiquido / bags) : 0;
                const h3Weight = Math.round(h3Pcs * avgWeight);
                const h4Weight = Math.round(h4Pcs * avgWeight);
                const h2Weight = pesoBagagemLiquido - h3Weight - h4Weight; // Absorve resíduo de arredondamento

                // Alimenta a sequência se houver peças
                if (h3Pcs > 0) seq.push({ hold: "H3", ruleLabel: "First 80 Bags", pcs: h3Pcs, weight: h3Weight });
                if (h4Pcs > 0) seq.push({ hold: "H4", ruleLabel: "Next 60 Bags", pcs: h4Pcs, weight: h4Weight });
                if (h2Pcs > 0) seq.push({ hold: "H2", ruleLabel: "Remainder Bags", pcs: h2Pcs, weight: h2Weight });

                addSpecialLoadsToSequence();
            }
        }

        return { sequence: seq, regraGeral, hint };
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

    // 3. FUNÇÃO DE LIMPEZA
    // Chame esta função no botão de "Finalizar Voo" para zerar o sistema
    const limparDados = () => {
        if (window.confirm("Deseja limpar todos os dados deste voo?")) {
            setCompany("");
            setAircraft("");
            setPesoTotal("");
            setTotalBags("");
            setSpecialLoads([]);

            // Remove as chaves do navegador
            window.localStorage.removeItem("dh-company");
            window.localStorage.removeItem("dh-aircraft");
            window.localStorage.removeItem("dh-pesoTotal");
            window.localStorage.removeItem("dh-totalBags");
            window.localStorage.removeItem("dh-specialLoads");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* PAINÉIS DE ENTRADA DE DADOS */}
            <Grid container spacing={3} sx={{ mb: 4 }}>

                {/* 1. VOO & AERONAVE */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 3,
                            bgcolor: '#1e293b',
                            color: '#f8fafc',
                            borderRadius: 3,
                            border: '1px solid #334155'
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#38bdf8', mb: 2.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                            ✈️ Voo & Aeronave
                        </Typography>

                        <Stack spacing={2.5}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="company-label" sx={{ color: '#94a3b8' }}>Companhia</InputLabel>
                                <Select
                                    labelId="company-label"
                                    value={company}
                                    label="Companhia"
                                    onChange={(e) => { setCompany(e.target.value as any); setAircraft(""); }}
                                    sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#475569' } }}
                                >
                                    <MenuItem value=""><em>Selecione a Companhia...</em></MenuItem>
                                    {Object.entries(companies).map(([code, c]) => (
                                        <MenuItem key={code} value={code}>{code} - {c.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small" disabled={!company}>
                                <InputLabel id="aircraft-label" sx={{ color: '#94a3b8' }}>Aeronave</InputLabel>
                                <Select
                                    labelId="aircraft-label"
                                    value={aircraft}
                                    label="Aeronave"
                                    onChange={(e) => setAircraft(e.target.value)}
                                    sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#475569' } }}
                                >
                                    <MenuItem value=""><em>Selecione a Aeronave...</em></MenuItem>
                                    {company && companies[company].aircrafts.map(a => (
                                        <MenuItem key={a} value={a}>{a}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Peso Total Bruto (kg)"
                                        type="number"
                                        value={pesoTotal}
                                        onChange={(e) => setPesoTotal(e.target.value === "" ? "" : Number(e.target.value))}
                                        sx={{
                                            borderRadius: 1,
                                            '& .MuiInputBase-input': { color: '#f8fafc' },
                                            '& .MuiInputLabel-root': { color: '#94a3b8' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Total Bags (pcs)"
                                        type="number"
                                        value={totalBags}
                                        onChange={(e) => setTotalBags(e.target.value === "" ? "" : Number(e.target.value))}
                                        sx={{
                                            borderRadius: 1,
                                            '& .MuiInputBase-input': { color: '#f8fafc' },
                                            '& .MuiInputLabel-root': { color: '#94a3b8' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {totalBags !== "" && (
                                <Chip
                                    label={`Peso Médio: ${pesoMedioReal} kg`}
                                    color="info"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold', alignSelf: 'flex-start' }}
                                />
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                {/* 2. CARGAS ESPECIAIS */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 3,
                            bgcolor: '#1e293b',
                            color: '#f8fafc',
                            borderRadius: 3,
                            border: '1px solid #334155'
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#38bdf8', mb: 2.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                            📦 Cargas Especiais
                        </Typography>

                        <Grid container spacing={1.5} sx={{ mb: 2, alignItems: 'center' }}>
                            <Grid size={{ xs: 12, sm: 5 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="special-type-label" sx={{ color: '#94a3b8' }}>Tipo</InputLabel>
                                    <Select
                                        labelId="special-type-label"
                                        value={tempType}
                                        label="Tipo"
                                        onChange={(e) => setTempType(e.target.value as any)}
                                        sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#475569' } }}
                                    >
                                        <MenuItem value="AVIH">AVIH - Animals in Hold</MenuItem>
                                        <MenuItem value="WCMP">WCMP - Cadeira manual</MenuItem>
                                        <MenuItem value="WCBD">WCBD - Cadeira bateria seca</MenuItem>
                                        <MenuItem value="WCBW">WCBW - Cadeira bateria molhada</MenuItem>
                                        <MenuItem value="WCLB">WCLB - Cadeira bateria lítio</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 6, sm: 2.5 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="hold-select-label" sx={{ color: '#94a3b8' }}>Porão</InputLabel>
                                    <Select
                                        labelId="hold-select-label"
                                        value={holdSelected}
                                        label="Porão"
                                        onChange={(e) => setHoldSelected(e.target.value as any)}
                                        sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#475569' } }}
                                    >
                                        <MenuItem value="H1">H1</MenuItem>
                                        <MenuItem value="H2">H2</MenuItem>
                                        <MenuItem value="H3">H3</MenuItem>
                                        <MenuItem value="H4">H4</MenuItem>
                                        <MenuItem value="H5">H5</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 6, sm: 2.5 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="kg"
                                    type="number"
                                    value={tempWeight}
                                    onChange={(e) => setTempWeight(e.target.value === "" ? "" : Number(e.target.value))}
                                    sx={{
                                        borderRadius: 1,
                                        '& .MuiInputBase-input': { color: '#f8fafc' },
                                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    disableElevation
                                    onClick={handleAddSpecialLoad}
                                    sx={{ height: 40, fontWeight: 'bold', bgcolor: '#0284c7', '&:hover': { bgcolor: '#0369a1' } }}
                                >
                                    ADD
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Chips de Cargas Adicionadas */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 48, p: 1.5, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155' }}>
                            {specialLoads.length === 0 ? (
                                <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic', m: 'auto' }}>
                                    Nenhuma carga especial vinculada.
                                </Typography>
                            ) : (
                                specialLoads.map(l => (
                                    <Chip
                                        key={l.id}
                                        label={`${l.type} - ${l.hold}: ${l.weight}kg`}
                                        onDelete={() => setSpecialLoads(specialLoads.filter(i => i.id !== l.id))}
                                        size="small"
                                        sx={{ bgcolor: '#334155', color: '#f8fafc', fontWeight: 600, '& .MuiChip-deleteIcon': { color: '#f87171' } }}
                                    />
                                ))
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* PAINEL DE RESULTADOS DA DISTRIBUIÇÃO */}
            {dist && (
                <Paper
                    elevation={6}
                    sx={{
                        bgcolor: '#1e293b',
                        color: '#f8fafc',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid #334155'
                    }}
                >
                    {/* Cabeçalho de Dica e Indicadores */}
                    <Box sx={{ p: 3, bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>
                        {dist.hint && (
                            <Alert severity="info" sx={{ mb: 2.5, bgcolor: '#1e3a8a', color: '#93c5fd', border: '1px solid #1d4ed8' }}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', letterSpacing: 0.5 }}>💡 DICA DE CARREGAMENTO:</Typography>
                                <Typography variant="body2">{dist.hint}</Typography>
                            </Alert>
                        )}

                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Peso Médio Calculado
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff' }}>
                                    {pesoMedioReal} <Typography component="span" variant="body1" sx={{ color: '#64748b' }}>kg</Typography>
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { sm: 'right' } }}>
                                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase' }}>
                                    Peso Total Bagagem Líquido
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#cbd5e1' }}>
                                    {pesoBagagemLiquido} kg
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Identificação do Voo & Regra Aplicada */}
                    <Box sx={{ p: 2, px: 2, bgcolor: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#38bdf8', fontWeight: 650, letterSpacing: 0.1 }}>
                            {company} — {aircraft}
                        </Typography>
                        <Chip
                            label={`Regra: ${dist.regraGeral}`}
                            size="small"
                            sx={{
                                bgcolor: '#334155',
                                color: '#cbd5e1',
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                height: 'auto', // Permite que a altura se ajuste ao conteúdo
                                maxWidth: '100%', // Impede que o chip ultrapasse a largura do container
                                '& .MuiChip-label': {
                                    display: 'block',
                                    whiteSpace: 'normal', // Habilita a quebra automática de linha
                                    py: 0.75,
                                    px: 1.25,
                                    lineHeight: 1.3
                                }
                            }}
                        />
                    </Box>

                    {/* Tabela da Sequência de Carregamento */}
                    <TableContainer>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#0f172a' }}>
                                <TableRow>
                                    <TableCell sx={{ color: '#64748b', fontWeight: 'bold', width: 70, textAlign: 'center' }}>ORDEM</TableCell>
                                    <TableCell sx={{ color: '#64748b', fontWeight: 'bold', width: 100 }}>PORÃO</TableCell>
                                    <TableCell sx={{ color: '#64748b', fontWeight: 'bold' }}>CATEGORIA</TableCell>
                                    <TableCell align="right" sx={{ color: '#64748b', fontWeight: 'bold', width: 120 }}>QTD (PCS)</TableCell>
                                    <TableCell align="right" sx={{ color: '#64748b', fontWeight: 'bold', width: 140 }}>PESO (KG)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dist.sequence.map((step, index) => {
                                    const isFrontHold = step.hold.includes('H1') || step.hold.includes('H2');
                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                bgcolor: step.isSpecialOnly ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                                                '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.05)' },
                                                borderBottom: '1px solid #334155'
                                            }}
                                        >
                                            <TableCell align="center" sx={{ color: '#94a3b8', fontWeight: 'bold' }}>
                                                {index + 1}º
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={step.hold}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 900,
                                                        bgcolor: isFrontHold ? 'rgba(30, 58, 138, 0.6)' : 'rgba(124, 45, 18, 0.6)',
                                                        color: isFrontHold ? '#60a5fa' : '#fb923c',
                                                        border: `1px solid ${isFrontHold ? '#1e40af' : '#9a3412'}`
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                                                {step.ruleLabel}
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                                {step.pcs > 0 ? step.pcs : "—"}
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 900, fontSize: '1.05rem' }}>
                                                {step.weight} <Typography component="span" variant="caption" sx={{ color: '#64748b' }}>KG</Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Cartão de Conferência Final (Destaque Claro para Leitura Rápida) */}
                    <Paper elevation={0} sx={{ m: 3, p: 3, bgcolor: '#ffffff', color: '#0f172a', borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', pb: 1.5, mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                                ✅ CONFERÊNCIA
                            </Typography>
                            <Chip label="FINAL CHECK" size="small" sx={{ fontWeight: 'bold', bgcolor: '#f1f5f9', color: '#64748b' }} />
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                                    Peças Totais (Bags)
                                </Typography>
                                <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#0284c7' }}>
                                    {totalPcsGeral} pcs ✔️
                                </Typography>
                            </Grid>

                            {specialStepWeights.length > 0 && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                                        Peso Bruto Total
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#15803d' }}>
                                        {pesoBagagemLiquido} + {specialStepWeights.join(" + ")} = {pesoTotalInput} kg ✔️
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 6 }}>
                                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Bagagem</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{totalBags} pcs / {pesoBagagemLiquido} kg</Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Especiais (AVIH/WCH)</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{specialLoads.length} item(ns)</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Stack spacing={0.5} sx={{ mb: 2 }}>
                            {dist.sequence.map((step, i) => (
                                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', py: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#64748b' }}>{step.hold}:</Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#0f172a' }}>
                                        {step.pcs > 0 ? `${step.pcs} pcs / ` : ""}{step.weight} kg
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Box sx={{ p: 1.5, bgcolor: '#0f172a', color: '#ffffff', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                                TOTAL: {totalPcsGeral} pcs / {pesoTotalInput} kg
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Botões de Ação na Rodapé */}
                    <Box sx={{ p: 2.5, px: 3, bgcolor: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155' }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={limparDados}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Finalizar Voo / Limpar
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsLdmModalOpen(true)}
                            sx={{ textTransform: 'none', fontWeight: 'bold', px: 3, bgcolor: '#0284c7', '&:hover': { bgcolor: '#0369a1' } }}
                        >
                            Adicionar LDM
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Modal LDM Preservado */}
            {isLdmModalOpen && (
                <LdmModal
                    cargoData={{
                        company: company,
                        h1: dist?.sequence.filter((step) => step.hold === 'H1').pop()?.weight || 0,
                        h2: dist?.sequence.filter((step) => step.hold === 'H2').pop()?.weight || 0,
                        h3: dist?.sequence.filter((step) => step.hold === 'H3').pop()?.weight || 0,
                        h4: dist?.sequence.filter((step) => step.hold === 'H4').pop()?.weight || 0,
                        h5: dist?.sequence.filter((step) => step.hold === 'H5').pop()?.weight || 0,
                        h1Pcs: dist?.sequence.filter((step) => step.hold === 'H1').pop()?.pcs || 0,
                        h2Pcs: dist?.sequence.filter((step) => step.hold === 'H2').pop()?.pcs || 0,
                        h3Pcs: dist?.sequence.filter((step) => step.hold === 'H3').pop()?.pcs || 0,
                        h4Pcs: dist?.sequence.filter((step) => step.hold === 'H4').pop()?.pcs || 0,
                        h5Pcs: dist?.sequence.filter((step) => step.hold === 'H5').pop()?.pcs || 0
                    }}
                    onClose={() => setIsLdmModalOpen(!isLdmModalOpen)} open={isLdmModalOpen} />
            )}
        </Container>
    );
}