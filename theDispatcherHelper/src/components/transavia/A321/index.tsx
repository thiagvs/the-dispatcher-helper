import { useEffect, useState } from "react";

interface GenericProps {
    pesoMedio: number;
    totalBags: number;
    pesoTotal: number;
}

export default function TransaviaA321({ pesoMedio, totalBags, pesoTotal }: GenericProps) {
    const [h1, setH1] = useState(0);
    const [h3, setH3] = useState(0);
    const [h4, setH4] = useState(0);

    useEffect(() => {
        if (!pesoMedio || totalBags <= 0) {
            setH1(0); setH3(0); setH4(0);
            return;
        }

        if (pesoTotal <= 800) {
            setH1(0); setH4(0); setH3(totalBags);
        } else {
            const porcoes = [
                { id: "h1", percent: 0.30 },
                { id: "h3", percent: 0.40 },
                { id: "h4", percent: 0.30 }
            ];

            const calculados = porcoes.map(p => {
                const exato = totalBags * p.percent;
                return {
                    id: p.id,
                    inteiro: Math.floor(exato),
                    decimal: exato - Math.floor(exato)
                };
            });


            const somaInteiros = calculados.reduce((acc, curr) => acc + curr.inteiro, 0);
            let faltam = totalBags - somaInteiros;

            const ordenadosPorDecimal = [...calculados].sort((a, b) => b.decimal - a.decimal);

            for (let i = 0; i < faltam; i++) {
                const poraoAlvo = ordenadosPorDecimal[i].id;
                const index = calculados.findIndex(c => c.id === poraoAlvo);
                calculados[index].inteiro += 1;
            }

            setH1(calculados.find(c => c.id === "h1")?.inteiro || 0);
            setH3(calculados.find(c => c.id === "h3")?.inteiro || 0);
            setH4(calculados.find(c => c.id === "h4")?.inteiro || 0);
        }
    }, [pesoMedio, totalBags, pesoTotal]);

    // --- CÁLCULO DOS PESOS (Mantendo a precisão do Peso Total) ---
    const pH1 = Math.round(h1 * pesoMedio);
    const pH4 = Math.round(h4 * pesoMedio);
    // H3 continua sendo o fiel da balança para o peso bater com o digitado
    const pH3 = totalBags > 0 ? (pesoTotal - (pH1 + pH4)) : 0;

    return (
        <div style={{ padding: "15px", border: "2px solid #00ab61", borderRadius: "8px", backgroundColor: "#121212", color: "#fff" }}>
            <h3 style={{ color: "#00ab61", marginTop: 0 }}>A321 (Transavia)</h3>

            <div style={{
                marginBottom: "15px", padding: "8px", borderRadius: "5px", textAlign: "center", fontWeight: "bold",
                backgroundColor: pesoTotal <= 800 ? "#1e3a8a" : "#431407",
                color: pesoTotal <= 800 ? "#bfdbfe" : "#ffedd5"
            }}>
                {pesoTotal <= 800 ? "⚠️ PRIORIDADE H3 (Até 800kg)" : "📊 DISTRIBUIÇÃO BALANCEADA (> 800kg)"}
            </div>

            {pesoTotal > 800 ? (
                <div>
                    <strong>Resumo de Carregamento:</strong>
                    <div style={{ marginTop: "10px" }}>
                        H1 (30%): {h1} bags || Peso: {pH1} kg <br />
                        H3 (40%*): {h3} bags || Peso: {pH3} kg <br />
                        H4 (30%): {h4} bags || Peso: {pH4} kg <br />
                    </div>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#00d66c" }}>
                        <span>Total Bags: <strong>{totalBags}</strong></span>
                        <span>Peso Total: <strong>{pesoTotal} kg</strong></span>
                    </div>
                </div>
            ) : (
                <div>
                    <strong>Resumo de Carregamento:</strong>
                    <div style={{ marginTop: "10px" }}>
                        H3 (100%): {h3} bags || Peso: {pesoTotal} kg <br />
                    </div>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#00d66c" }}>
                        <span>Total Bags: <strong>{totalBags}</strong></span>
                        <span>Peso Total: <strong>{pesoTotal} kg</strong></span>
                    </div>
                </div>
            )}
        </div>
    );
}