import { useEffect, useState } from "react";

interface DefaultProps {
    pesoMedio: number;
    totalBags: number;
    pesoTotal: number
}


export default function EasyJetA319({ pesoMedio, totalBags, pesoTotal }: DefaultProps) {
    const [h1, setH1] = useState(0);
    const [h4, setH4] = useState(0);

    useEffect(() => {
        const res = calcA319(Number(totalBags));
        setH1(res.h1);
        setH4(res.h4);
    }, [pesoMedio, totalBags, pesoTotal]);

    function calcA319(totalBags: number) {
        if (!totalBags) return { h1: 0, h4: 0 };

        if (totalBags <= 100) {
            return {
                h1: 0,
                h4: totalBags,
            };
        }

        const h4 = 100;
        const h1 = totalBags - 100;

        return { h1, h4 };
    }

    const pH1 = Math.round(h1 * pesoMedio);
    const pH4 = pesoTotal - pH1;

    return (
        <div>
            <div style={{ padding: "15px", border: "2px solid #e65022", borderRadius: "8px", backgroundColor: "#121212", color: "#fff" }}>
                <h3 style={{ color: "#e65022", marginTop: 0 }}>A319 (EasyJet)</h3>
                H4 (Máx ~100 pcs): {h4} bags || Peso: {pH4} kg <br />
                H1 (Restante): {h1} bags || Peso: {pH1} kg <br />
                <hr />
                <strong>Total: {totalBags} bags || {pesoTotal} kg</strong>
            </div>
        </div>
    )
}