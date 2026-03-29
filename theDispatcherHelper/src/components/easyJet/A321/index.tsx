import { useEffect, useState } from "react";

export default function EasyJetA321() {
    const [total, setTotal] = useState("");
    const [h2, setH2] = useState(0);
    const [h3, setH3] = useState(0);
    const [h4, setH4] = useState(0);

    useEffect(() => {
        const res = calcA321(Number(total));
        setH2(res.h2);
        setH3(res.h3);
        setH4(res.h4);
    }, [total]);

    function calcA321(totalBags: number) {
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

    return (
        <div>
            <h3>A321 (EasyJet)</h3>

            <input
                type="number"
                placeholder="Total de malas"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
            />

            <br /><br />

            <div><strong>Malas destinadas ao H1: </strong>NIL</div>
            <div><strong>Malas destinadas ao H2: </strong>{h2}</div>
            <div><strong>Malas destinadas ao H3: </strong>{h3}</div>
            <div><strong>Malas destinadas ao H4: </strong>{h4}</div>
        </div>
    )
}