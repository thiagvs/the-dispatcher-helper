import React, { useState, useMemo } from 'react';

interface CargoData {
    company: string;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h1Pcs?: number;
    h2Pcs?: number;
    h3Pcs?: number;
    h4Pcs?: number;
    h5Pcs?: number;
}

export default function LdmModal({ cargoData, onClose }: { cargoData: CargoData, onClose: () => void }) {
    const currentDay = String(new Date().getDate()).padStart(2, '0');

    const [formData, setFormData] = useState({
        company: cargoData.company,
        flightNumber: '',
        day: currentDay,
        registration: '',
        capacity: '',
        crew: '',
        destination: '',
        males: '0',
        females: '0',
        children: '0',
        infants: '0',
        pad: '0',
        bt: '' // Novo campo para Bagagem em Trânsito
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    };

    const ldmString = useMemo(() => {
        const { company, flightNumber, day, registration, capacity, crew, destination, males, females, children, infants, pad, bt } = formData;
        const { h1, h2, h3, h4, h5, h1Pcs = 0, h2Pcs = 0, h3Pcs = 0, h4Pcs = 0, h5Pcs = 0 } = cargoData;

        // Lógica exclusiva para Eurowings (EW)
        if (company === 'EW') {
            let ewStr = `Voo: ${company}${flightNumber}\n\n`;
            ewStr += `Males ${males}\n`;
            ewStr += `Females ${females}\n`;
            ewStr += `Child ${children}\n`;
            ewStr += `Infant ${infants}\n\n`;
            // Como CargoData só tem os pesos, as unidades ficam ocultas ou prontas para edição manual antes de enviar
           ewStr += `H1 ${h1Pcs}/${h1}\n`;
            ewStr += `H2 ${h2Pcs}/${h2}\n`;
            ewStr += `H3 ${h3Pcs}/${h3}\n`;
            ewStr += `H4 ${h4Pcs}/${h4}\n`;
            ewStr += `H5 ${h5Pcs}/${h5}`;

            if (bt && bt.trim() !== '' && bt !== '0') {
                ewStr += `\n\nBT ${bt}`;
            }
            return ewStr;
        }

        // Lógica Padrão para demais companhias
        const totalWeight = h1 + h2 + h3 + h4 + h5;
        const totalPax = (parseInt(males) || 0) + (parseInt(females) || 0) + (parseInt(children) || 0);

        const line1 = `${company}${flightNumber}/${day}.${registration}.${capacity}Y.${crew}`;
        const line2 = `-${destination}.${males}/${females}/${children}/${infants}.T${totalWeight}.H1/${h1}.H2/${h2}.H3/${h3}.H4/${h4}.H5/${h5}.PAX/${totalPax}.PAD/${pad}`;

        return `${line1}\n${line2}`;
    }, [formData, cargoData]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ldmString);
        alert('LDM copiado!');
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-600 w-full max-w-3xl overflow-hidden flex flex-col">

                <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">📡 Transmissão LDM</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-2xl">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[75vh]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Cia</label>
                            <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" maxLength={3} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Voo</label>
                            <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Dia</label>
                            <input type="text" name="day" value={formData.day} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" maxLength={2} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Matrícula</label>
                            <input type="text" name="registration" value={formData.registration} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Capacidade</label>
                            <input type="text" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Tripulação</label>
                            <input type="text" name="crew" value={formData.crew} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Destino</label>
                            <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" maxLength={3} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase text-blue-400">Males (M)</label>
                            <input type="number" name="males" value={formData.males} onChange={handleInputChange} min="0" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase text-pink-400">Females (F)</label>
                            <input type="number" name="females" value={formData.females} onChange={handleInputChange} min="0" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase text-yellow-400">Child (CHD)</label>
                            <input type="number" name="children" value={formData.children} onChange={handleInputChange} min="0" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase text-emerald-400">Infant (INF)</label>
                            <input type="number" name="infants" value={formData.infants} onChange={handleInputChange} min="0" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>

                        {/* Novo campo para Bagagem em Trânsito (BT) */}
                        <div className="space-y-1 md:col-span-4">
                            <label className="text-xs font-bold text-slate-400 uppercase text-orange-400">Bagagem em Trânsito (BT) - Apenas se houver</label>
                            <input type="text" name="bt" value={formData.bt} onChange={handleInputChange} placeholder="Ex: 10/150" className="w-full md:w-1/4 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 relative">
                        <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase">Pré-visualização</h3>
                        <pre className="text-emerald-400 font-mono text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                            {ldmString}
                        </pre>

                        <button onClick={copyToClipboard} className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-600 transition">
                            Copiar
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-900 border-t border-slate-700 flex justify-end">
                    <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded font-bold transition">
                        Fechar
                    </button>
                </div>

            </div>
        </div>
    );
}