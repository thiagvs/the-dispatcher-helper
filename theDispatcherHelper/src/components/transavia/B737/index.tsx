import { useEffect, useState } from "react";

interface DefaultProps {
    pesoMedio: number;
    totalBags: number;
    pesoTotal: number
}


export default function TransaviaB737({ pesoMedio, totalBags, pesoTotal }: DefaultProps) {
    const [h2, setH2] = useState(0);
    const [h3, setH3] = useState(0);

    useEffect(() => {
        const res = calcB737();
        setH2(res.h2);
        setH3(res.h3);
    }, [pesoMedio, totalBags, pesoTotal]);

    function calcB737() {
        if (!totalBags) return { h2: 0, h3: 0 };
        return {
            h2: Math.ceil(totalBags / 2),
            h3: Math.floor(totalBags / 2),
        };
    }

    const pH2 = Math.round(h2 * pesoMedio);
    const pH3 = pesoTotal - pH2;

    return (
        <div>
            <div style={{ padding: "15px", border: "2px solid #00ab61", borderRadius: "8px", backgroundColor: "#121212", color: "#fff" }}>
                <h3 style={{ color: "#00ab61", marginTop: 0 }}>B737 (Transavia)</h3>

                H2 (50%) {h2} bags || Peso: {pH2} kg <br />
                H3 (50%) {h3} bags || Peso: {pH3} kg <br />
                <hr />
                <strong>Total: {totalBags} bags || {pesoTotal} kg</strong>
            </div>
        </div>
    )
}