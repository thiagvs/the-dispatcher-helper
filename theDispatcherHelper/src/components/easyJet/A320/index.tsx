import { useEffect, useState } from "react";

interface DefaultProps {
    pesoMedio: number;
    totalBags: number;
    pesoTotal: number
}

export default function EasyJetA320({ pesoMedio, totalBags, pesoTotal }: DefaultProps) {
    const [h1, setH1] = useState(0);
    const [h3, setH3] = useState(0);
    const [h4, setH4] = useState(0);

    useEffect(() => {
        const res = calcA320();
        setH1(res.h1);
        setH3(res.h3);
        setH4(res.h4);
    }, [pesoMedio, totalBags]);

    function calcA320() {
        if (!totalBags) return { h1: 0, h3: 0, h4: 0 };

        let remaining = totalBags;

        const h1 = Math.min(remaining, 85);
        remaining -= h1;

        const h3 = Math.min(remaining, 60);
        remaining -= h3;

        const h4 = remaining;

        return {
            h1,
            h3,
            h4,
        };
    }

    const pH1 = Math.round(h1 * pesoMedio);
    const pH3 = Math.round(h3 * pesoMedio);
    const pH4 = pesoTotal - pH1 - pH3;

    return (
        <div>
            <div style={{ padding: "15px", border: "2px solid #e65022", borderRadius: "8px", backgroundColor: "#121212", color: "#fff" }}>
                <h3 style={{ color: "#e65022", marginTop: 0 }}>A320 (EasyJet)</h3>

                H1 (Máx: 85pcs) {h1} bags || Peso: {pH1} kg <br />
                H3 (Máx: 60pcs) {h3} bags || Peso: {pH3} kg <br />
                H4 (Restante) {h4} bags || Peso: {pH4} kg <br />
                <hr />
                <strong>Total: {totalBags} bags || {pesoTotal} kg</strong>
            </div>
        </div>
    )
}