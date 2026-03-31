import { useEffect, useState } from "react";

interface EurowingsProps {
    pesoMedio: number;
    totalBags: number;
}

export default function EurowingsA319({ pesoMedio, totalBags }: EurowingsProps) {
    // Mantemos apenas os estados das malas
    const [h4, setH4] = useState(0);
    const [h5, setH5] = useState(0);
    const [h1, setH1] = useState(0);

    useEffect(() => {
        // Fazemos o cálculo de distribuição
        if (!pesoMedio || totalBags <= 0) {
            setH4(0); setH5(0); setH1(0);
            return;
        }

        // 1. Limites de malas baseados no peso máximo permitido de cada porão
        const maxH4 = Math.floor(1350 / pesoMedio);
        const maxH5 = Math.floor(400 / pesoMedio);

        // 2. Distribuição real (respeitando o total de malas do voo)
        const realH4 = Math.min(maxH4, totalBags);
        const realH5 = Math.min(maxH5, totalBags - realH4);
        const realH1 = totalBags - realH4 - realH5;

        // Atualiza os estados
        setH4(realH4);
        setH5(realH5);
        setH1(realH1);
        
    }, [pesoMedio, totalBags]);

    // Calculamos o peso em tempo real durante a renderização 
    // Isso garante que o peso sempre condiz com o número de bags na tela
    const pesoH4 = Math.round(h4 * pesoMedio);
    const pesoH5 = Math.round(h5 * pesoMedio);
    const pesoH1 = Math.round(h1 * pesoMedio);

    return (
        <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>A319 (EuroWings)</h3>
            <div>
                <strong>Resumo:</strong>
                <br />
                H4: {h4} bags || Peso: {pesoH4} kg
                <br />
                H5: {h5} bags || Peso: {pesoH5} kg
                <br />
                H1: {h1} bags || Peso: {pesoH1} kg
                <hr />
                <strong>Total: {h4 + h5 + h1} bags || {Math.round(pesoH4 + pesoH5 + pesoH1)} kg</strong>

                <hr />
                <strong>Regra utilizada: H4 1350 kg · H5 400 kg · H1 rest</strong>
            </div>
        </div>
    );
}