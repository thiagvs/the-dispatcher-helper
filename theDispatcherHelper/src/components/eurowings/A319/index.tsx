import { useEffect, useState } from "react";

interface EurowingsProps {
    pesoMedio: number;
    totalBags: number;
    pesoTotal: number;
}

export default function EurowingsA319({ pesoMedio, totalBags, pesoTotal }: EurowingsProps) {
    const [h4, setH4] = useState(0);
    const [h5, setH5] = useState(0);
    const [h1, setH1] = useState(0);

    useEffect(() => {
        if (!pesoMedio || totalBags <= 0) {
            setH4(0); setH5(0); setH1(0);
            return;
        }

        const capH4 = Math.floor(1350 / pesoMedio);
        const capH5 = Math.floor(400 / pesoMedio);

        const resH4 = Math.min(capH4, totalBags);
        const resH5 = Math.min(capH5, totalBags - resH4);
        const resH1 = totalBags - resH4 - resH5;

        setH4(resH4); setH5(resH5); setH1(resH1);
    }, [pesoMedio, totalBags]);

    const ph4 = Math.round(h4 * pesoMedio);
    const ph5 = Math.round(h5 * pesoMedio);
    const ph1 = totalBags > 0 ? (pesoTotal - (ph4 + ph5)) : 0;

    return (
        <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#121212" }}>
            <h3>A319 (EuroWings)</h3>
            H4 (Máx 1350kg): {h4} bags || Peso: {ph4} kg <br />
            H5 (Máx 400kg): {h5} bags || Peso: {ph5} kg <br />
            H1 (Restante): {h1} bags || Peso: {ph1} kg <br />
            <hr />
            <strong>Total: {totalBags} bags || {pesoTotal} kg</strong>
        </div>
    );
}