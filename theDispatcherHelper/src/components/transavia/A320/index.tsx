import { useEffect, useState } from "react";

interface DefaultProps {
  pesoMedio: number;
  totalBags: number;
  pesoTotal: number;
}

export default function TransaviaA320({
  pesoMedio,
  totalBags,
  pesoTotal,
}: DefaultProps) {
  const [h1, setH1] = useState(0);
  const [h3, setH3] = useState(0);

  useEffect(() => {
    if (!pesoMedio || totalBags <= 0 || pesoTotal <= 0) {
      setH1(0);
      setH3(0);
      return;
    }

    // 🎯 Divide o peso
    const metadePeso = pesoTotal / 2;

    // 🎯 Converte para bags (sempre pra baixo)
    let h1Bags = Math.floor(metadePeso / pesoMedio);
    let h3Bags = Math.floor(metadePeso / pesoMedio);

    // 🎯 Ajuste fino pra bater o total de bags
    let totalCalculado = h1Bags + h3Bags;

    while (totalCalculado < totalBags) {
      h1Bags++; // distribui diferença
      totalCalculado++;
    }

    setH1(h1Bags);
    setH3(h3Bags);
  }, [pesoMedio, totalBags, pesoTotal]);

  // 🎯 Peso real baseado nas bags
  const pesoH1 = Math.round(h1 * pesoMedio);
  const pesoH3 = Math.round(h3 * pesoMedio);

  // 🔥 Ajuste final pra garantir soma exata
  const diferenca = pesoTotal - (pesoH1 + pesoH3);

  const pesoH3Final = pesoH3 + diferenca;

  return (
    <div>
      <div
        style={{
          padding: "15px",
          border: "2px solid #00ab61",
          borderRadius: "8px",
          backgroundColor: "#121212",
          color: "#fff",
        }}
      >
        <h3 style={{ color: "#00ab61", marginTop: 0 }}>
          A320 (Transavia)
        </h3>

        H1 (50%) {h1} bags || Peso: {pesoH1} kg <br />
        H3 (50%) {h3} bags || Peso: {pesoH3Final} kg <br />

        <hr />
        <strong>
          Total: {totalBags} bags || {pesoTotal} kg
        </strong>
      </div>
    </div>
  );
}