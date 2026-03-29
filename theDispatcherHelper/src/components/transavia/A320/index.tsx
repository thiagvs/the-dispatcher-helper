import { useEffect, useState } from "react";

export default function TransaviaA320() {
    const [total, setTotal] = useState("");
    const [h1, setH1] = useState(0);
    const [h3, setH3] = useState(0);

    const [h4Animals, setH4Animals] = useState(0);
    const [h5Animals, setH5Animals] = useState(0);

    useEffect(() => {
        const res = calcA320(Number(total));
        setH1(res.h1);
        setH3(res.h3);
    }, [total]);

    function calcA320(totalBags: number) {
        if (!totalBags) return { h1: 0, h3: 0 };

        return {
            h1: Math.ceil(totalBags / 2), // prioridade
            h3: Math.floor(totalBags / 2),
        };
    }

    return (
        <div>
            <h3>A320 (Transavia)</h3>

            <input
                type="number"
                placeholder="Total de malas"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
            />
            <br /><br />

            <div><strong>H1:</strong> {h1}</div>
            <div><strong>H3:</strong> {h3}</div>
            <br />

            <h4>Animais</h4>

            <input
                type="number"
                placeholder="H4 animais"
                value={h4Animals}
                onChange={(e) => setH4Animals(Number(e.target.value))}
            />
            <br /><br />
            <input
                type="number"
                placeholder="H5 animais"
                value={h5Animals}
                onChange={(e) => setH5Animals(Number(e.target.value))}
            />
            <br /><br />

            <div>
                <strong>Resumo:</strong>
                <br />
                H1: {h1} bags
                <br />
                H3: {h3} bags
                <br />
                H4: {h4Animals} animais
                <br />
                H5: {h5Animals} animais
            </div>
        </div>
    );
}