import { useEffect, useState } from "react";

interface DefaultProps {
    pesoMedio: number;
    totalBags: number;
    pesoTotal: number
}

export default function EasyJetA321({ pesoMedio, totalBags, pesoTotal }: DefaultProps) {
    const [h2, setH2] = useState(0);
    const [h3, setH3] = useState(0);
    const [h4, setH4] = useState(0);

    useEffect(() => {
        const res = calcA321();
        setH2(res.h2);
        setH3(res.h3);
        setH4(res.h4);
    }, [pesoMedio, totalBags]);

    function calcA321() {
        if (!totalBags) return { h2: 0, h3: 0, h4: 0 };

        let remaining = totalBags;

        const h3 = Math.min(remaining, 100);
        remaining -= h3;

        const h4 = Math.min(remaining, 50);
        remaining -= h4;

        const h2 = remaining;

        return {
            h2,
            h3,
            h4,
        };
    }

    const pH2 = Math.round(h2 * pesoMedio);
    const pH3 = Math.round(h3 * pesoMedio);
    const pH4 = pesoTotal - pH2 - pH3;

    return (
       <div>
            <div style={{ padding: "15px", border: "2px solid #e65022", borderRadius: "8px", backgroundColor: "#121212", color: "#fff" }}>
                <h3 style={{ color: "#e65022", marginTop: 0 }}>A321 (EasyJet)</h3>

                H2 (rest) {h2} bags || Peso: {pH2} kg <br />
                H3 (Máx: 100pcs) {h3} bags || Peso: {pH3} kg <br />
                H4 (Máx: 50pcs) {h4} bags || Peso: {pH4} kg <br />
                <hr />
                <strong>Total: {totalBags} bags || {pesoTotal} kg</strong>
            </div>
        </div>
    )
}