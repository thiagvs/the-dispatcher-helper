import { useEffect, useState } from "react";

export default function EasyJetA320() {
    const [total, setTotal] = useState("");
    const [h1, setH1] = useState(0);
    const [h3, setH3] = useState(0);
    const [h4, setH4] = useState(0);

    useEffect(() => {
        const res = calcA320(Number(total));
        setH1(res.h1);
        setH3(res.h3);
        setH4(res.h4);
    }, [total]);

    function calcA320(totalBags: number) {
        if (!totalBags) return { h1: 0, h3: 0, h4: 0 };

        let remaining = totalBags;

        const h1 = Math.min(remaining, 85);
        remaining -= h1;

        const h3 = Math.min(remaining, 60);
        remaining -= h3;

        const h4 = remaining;

        return {
            h1,
            h3,
            h4,
        };
    }

    return (
        <div>
            <h3>A320 (EasyJet)</h3>

            <input
                type="number"
                placeholder="Total de malas"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
            />

            <br /><br />

            <div><strong>Malas destinadas ao H1: </strong>{h1}</div>
            <div><strong>Malas destinadas ao H3: </strong>{h3}</div>
            <div><strong>Malas destinadas ao H4: </strong>{h4}</div>
        </div>
    )
}