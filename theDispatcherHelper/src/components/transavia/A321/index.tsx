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

        let resH1 = 0, resH3 = 0, resH4 = 0;

        if (pesoTotal <= 800) {
            resH3 = totalBags;
        } else {
            resH1 = Math.floor(totalBags * 0.30);
            resH4 = Math.floor(totalBags * 0.30);
            resH3 = totalBags - (resH1 + resH4);
        }

        setH1(resH1);
        setH3(resH3);
        setH4(resH4);
    }, [pesoMedio, totalBags, pesoTotal]);

    const pH1 = Math.round(h1 * pesoMedio);
    const pH4 = Math.round(h4 * pesoMedio);
    const pH3 = (totalBags > 0) ? (pesoTotal - (pH1 + pH4)) : 0;

    return (
        <div style={{ padding: "15px", border: "2px solid #00d66c", borderRadius: "8px", backgroundColor: "#121212", color: "#fff" }}>
            <h3 style={{ color: "#00d66c", marginTop: 0 }}>A321 (Transavia)</h3>

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