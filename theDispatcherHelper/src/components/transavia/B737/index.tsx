import { useEffect, useState } from "react";

export default function TransaviaB737() {
    const [total, setTotal] = useState("");
    const [h2, setH2] = useState(0);
    const [h3, setH3] = useState(0);

    useEffect(() => {
        const res = calcB737(Number(total));
        setH2(res.h2);
        setH3(res.h3);
    }, [total]);

    function calcB737(totalBags: number) {
        if (!totalBags) return { h2: 0, h3: 0 };
        return {
            h2: Math.ceil(totalBags / 2),
            h3: Math.floor(totalBags / 2),
        };
    }

    return (
        <div>
            <h3>B737-800 (Transavia)</h3>

            <input
                type="number"
                placeholder="Total de malas"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
            />

            <br /><br />

            <div><strong>Malas destinadas ao H2:</strong> {h2}</div>
            <div><strong>Malas destinadas ao H3:</strong> {h3}</div>
        </div>
    )
}