import { useState } from "react";

export default function EurowingsA319() {
  const [bags, setBags] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  return (
    <div>
      <h3>Eurowings A319</h3>

      <input
        type="number"
        placeholder="Total de bags"
        value={bags}
        onChange={(e) => setBags(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Peso total"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <br /><br />

      {/* <button onClick={handleCalc}>Calcular</button> */}

      <br /><br />

      {result && (
        <div>
          <p>Peso médio: {result.avg}</p>

          {result.holds.map((h) => (
            <div key={h.name}>
              <strong>{h.name}</strong> → Bags: {h.bags} | KG: {h.kg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}