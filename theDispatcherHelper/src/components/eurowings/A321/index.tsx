import { useEffect, useState } from "react";

interface EurowingsProps {
    pesoMedio: number;
    totalBags: number;
    pesoTotal: number;
}

export default function EurowingsA321({ pesoMedio, totalBags, pesoTotal }: EurowingsProps) {
    const [h1, setH1] = useState(0);
    const [h2, setH2] = useState(0);
    const [h3, setH3] = useState(0);

    useEffect(() => {
        if (!pesoMedio || totalBags <= 0) {
            setH1(0); setH2(0); setH3(0);
            return;
        }

        // Distribuição equalitária (1/3 para cada)
        const porcoes = [
            { id: "h1", p: 1 / 3 }, { id: "h2", p: 1 / 3 }, { id: "h3", p: 1 / 3 }
        ];

        const calculados = porcoes.map(item => {
            const exato = totalBags * item.p;
            return {
                id: item.id,
                inteiro: Math.floor(exato),
                decimal: exato - Math.floor(exato)
            };
        });

        let faltam = totalBags - calculados.reduce((acc, c) => acc + c.inteiro, 0);
        const ordenados = [...calculados].sort((a, b) => b.decimal - a.decimal);

        for (let i = 0; i < faltam; i++) {
            const alvo = calculados.find(c => c.id === ordenados[i].id);
            if (alvo) alvo.inteiro += 1;
        }

        setH1(calculados[0].inteiro);
        setH2(calculados[1].inteiro);
        setH3(calculados[2].inteiro);
    }, [pesoMedio, totalBags]);

    const ph1 = Math.round(h1 * pesoMedio);
    const ph2 = Math.round(h2 * pesoMedio);
    const ph3 = totalBags > 0 ? (pesoTotal - (ph1 + ph2)) : 0;

    return (
        <div>
            <div style={{ padding: "15px", border: "2px solid #871c54", borderRadius: "8px", backgroundColor: "#121212", color: "#fff" }}>
                <h3 style={{ color: "#871c54", marginTop: 0 }}>A320 (EuroWings)</h3>
                H3: {h3} bags || Peso: {ph3} kg <br />
                H2: {h2} bags || Peso: {ph2} kg <br />
                H1: {h1} bags || Peso: {ph1} kg <br />
                <hr />
                <strong>Total: {totalBags} bags || {pesoTotal} kg</strong>
            </div>
        </div>
    );
}