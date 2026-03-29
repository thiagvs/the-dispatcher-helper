import { useState, useEffect } from "react";

export default function TransaviaA321() {
    const [total, setTotal] = useState("");
    const [h1, setH1] = useState(0);
    const [h2, setH2] = useState(0);
    const [h3, setH3] = useState(0);

    useEffect(() => {
        const res = calcA321(Number(total));
        setH1(res.h1);
        setH2(res.h2);
        setH3(res.h3);
    }, [total]);

    function calcA321(totalBags: number) {
        if (!totalBags) return { h1: 0, h2: 0, h3: 0 };

        // Placeholder — ajustar quando tiver regra real
        const base = Math.floor(totalBags / 3);
        const remainder = totalBags % 3;

        return {
            h1: base + (remainder > 0 ? 1 : 0),
            h2: base + (remainder > 1 ? 1 : 0),
            h3: base,
        };
    }

    return (
        <div>
            <h3>A321 (Transavia)</h3>

            <input
                type="number"
                placeholder="Total de malas"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
            />

            <br /><br />

            <div><strong>H1:</strong> {h1}</div>
            <div><strong>H2:</strong> {h2}</div>
            <div><strong>H3:</strong> {h3}</div>
        </div>
    );
}