import { useEffect, useState } from "react";

interface EurowingsProps {
    pesoMedio: number;
    totalBags: number;
}

export default function EurowingsA321({ pesoMedio, totalBags }: EurowingsProps) {
    // Mantemos apenas os estados das malas
    const [h1, setH1] = useState(0);
    const [h2, setH2] = useState(0);
    const [h3, setH3] = useState(0);

    useEffect(() => {
        if (!pesoMedio || totalBags <= 0) {
            setH1(0); setH2(0); setH3(0);
            return;
        }

        const maxH1 = Math.floor(500 / pesoMedio);
        const maxH2= Math.floor(500 / pesoMedio);
        const maxH3 = Math.floor(500 / pesoMedio);


        // Atualiza os estados
        setH1(maxH1);
        setH2(maxH2);
        setH3(maxH3);
        
    }, [pesoMedio, totalBags]);

    const pesoH1 = Math.round(h1 * pesoMedio);
    const pesoH2 = Math.round(h2 * pesoMedio);
    const pesoH3 = Math.round(h3 * pesoMedio);

    return (
        <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>A321 (EuroWings)</h3>
            <div>
                <strong>Resumo:</strong>
                <br />
                H1: {h1} bags || Peso: {pesoH1} kg
                <br />
                H5: {h2} bags || Peso: {pesoH2} kg
                <br />
                H1: {h3} bags || Peso: {pesoH3} kg
                <hr />
                <strong>Total: {h1 + h2 + h3} bags || {Math.round(pesoH1 + pesoH2 + pesoH1)} kg</strong>

                <hr />
                <strong>Regra utilizada: H3 500 kg · H2 500 kg · H1 500 kg (CLC)</strong>
            </div>
        </div>
    );
}