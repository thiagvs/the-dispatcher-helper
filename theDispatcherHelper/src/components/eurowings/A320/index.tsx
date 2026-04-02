import { useEffect, useState } from "react";

interface EurowingsProps {
    pesoMedio: number;
    totalBags: number;
    pesoTotal: number
}

export default function EurowingsA320({ pesoMedio, totalBags, pesoTotal }: EurowingsProps) {
    const [h1, setH1] = useState(0);
    const [h3, setH3] = useState(0);
    const [h4, setH4] = useState(0);

    useEffect(() => {
        if (!pesoMedio || totalBags <= 0) {
            setH1(0); setH3(0); setH4(0);
            return;
        }

        const capH1 = Math.floor(1500 / pesoMedio);
        const capH3 = Math.floor(1000 / pesoMedio);

        const resH1 = Math.min(capH1, totalBags);
        const resH3 = Math.min(capH3, totalBags - resH1);
        const resH4 = totalBags - resH1 - resH3;

        setH1(resH1); setH3(resH3); setH4(resH4);
    }, [pesoMedio, totalBags]);

    const pH1 = Math.round(h1 * pesoMedio);
    const pH3 = Math.round(h3 * pesoMedio);
    const pH4 = totalBags > 0 ? (pesoTotal - (pH1 + pH3)) : 0;

    return (
        // <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#af1e65" }}>
        //     <h3>A320 (EuroWings)</h3>
        //     H1 (Máx 1500kg): {h1} bags || Peso: {pH1} kg <br />
        //     H3 (Máx 1000kg): {h3} bags || Peso: {pH3} kg <br />
        //     H4 (Restante): {h4} bags || Peso: {pH4} kg <br />
        //     <hr />
        //     <strong>Total: {totalBags} bags || {pesoTotal} kg</strong>
        // </div>

        <div>
            <div style={{ padding: "15px", border: "2px solid #871c54", borderRadius: "8px", backgroundColor: "#121212", color: "#fff" }}>
                <h3 style={{ color: "#871c54", marginTop: 0 }}>A320 (EuroWings)</h3>
                <h3>A320 (EuroWings)</h3>
                H1 (Máx 1500kg): {h1} bags || Peso: {pH1} kg <br />
                H3 (Máx 1000kg): {h3} bags || Peso: {pH3} kg <br />
                H4 (Restante): {h4} bags || Peso: {pH4} kg <br />
                <hr />
                <strong>Total: {totalBags} bags || {pesoTotal} kg</strong>
            </div>
        </div>
    );
}