import { useEffect, useState } from "react";

export default function EasyJetA319() {
    const [total, setTotal] = useState("");
    const [h1, setH1] = useState(0);
    const [h4, setH4] = useState(0);

    useEffect(() => {
        const res = calcA319(Number(total));
        setH1(res.h1);
        setH4(res.h4);
    }, [total]);

    function calcA319(totalBags: number) {
        if (!totalBags) return { h1: 0, h4: 0 };

        let numeroH4 = 100;
        let numeroH1 = 0;
        let excedente = totalBags - numeroH4;

        if (totalBags <= 100) {
            return {
                h1: 0,
                h4: totalBags
            }
        }

        if (excedente > 0) {
            numeroH1 = excedente
            numeroH4 = 100;
        }
        else {
            numeroH1 = 0;
        }

        return {
            h1: numeroH1,
            h4: numeroH4,
        };
    }

    return (
        <div>
            <h3>A319 (EasyJet)</h3>

            <input
                type="number"
                placeholder="Total de malas"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
            />

            <br /><br />

            <div><strong>Malas destinadas ao H1: </strong>{h1}</div>
            <div><strong>Malas destinadas ao H4: </strong>{h4}</div>
        </div>
    )
}