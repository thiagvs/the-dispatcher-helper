import  { useState, useMemo } from 'react';

interface DelayCode {
    code: string;
    subCode?: string;
    phrase: string;
    description: string;
}

interface DelayCategory {
    title: string;
    icon: string;
    color: string;
    items: DelayCode[];
}

export default function Delays() {
    const [activeTab, setActiveTab] = useState<'iata' | 'easyjet'>('iata');
    const [searchTerm, setSearchTerm] = useState('');

    // 1. BANCO DE DADOS: IATA PADRÃO (AHM730)
    const iataCategories: DelayCategory[] = useMemo(() => [
        {
            title: "Códigos Internos da Linha Aérea",
            icon: "🏢",
            color: "border-zinc-700 text-zinc-400",
            items: [
                { code: "00-05", phrase: "L/A", description: "Códigos internos privativos da própria companhia aérea" },
                { code: "06", subCode: "OA", phrase: "FALTA DE PORTÃO", description: "Indisponibilidade de portão ou posição de parada devido a atividades da própria linha aérea" },
                { code: "09", subCode: "SG", phrase: "TEMPO INSUFICIENTE", description: "Tempo de solo programado menor do que o tempo mínimo de solo declarado" }
            ]
        },
        {
            title: "Passageiros e Bagagem",
            icon: "🧳",
            color: "border-blue-500 text-blue-400",
            items: [
                { code: "11", subCode: "PD", phrase: "CHECK-IN TARDIO", description: "Check-in tardio, aceitação de passageiros após o encerramento do horário limite" },
                { code: "12", subCode: "PL", phrase: "CONGESTIONAMENTO", description: "Check-in tardio devido a congestionamento na área de atendimento" },
                { code: "13", subCode: "PE", phrase: "ERRO DE CHECK-IN", description: "Erro de processamento de passageiros ou de triagem de bagagem" },
                { code: "14", subCode: "PO", phrase: "OVERBOOKING", description: "Excesso de vendas ou erros de reserva no sistema comercial" },
                { code: "15", subCode: "PH", phrase: "EMBARQUE ATRASADO", description: "Discrepâncias no embarque, chamadas de passageiros no som (paging) ou pax faltante já despachado" },
                { code: "16", subCode: "PS", phrase: "CONVENIÊNCIA / VIP", description: "Publicidade comercial, conveniência do passageiro, atendimento VIP, imprensa, refeições em solo ou itens pessoais esquecidos" },
                { code: "17", subCode: "PC", phrase: "PEDIDO DE CATERING", description: "Pedido de comissaria/catering atrasado ou enviado incorretamente ao fornecedor" },
                { code: "18", subCode: "PB", phrase: "TRIAGEM DE BAGAGEM", description: "Problemas no processamento, esteiras, separação ou triagem de bagagens no terminal" },
                { code: "19", subCode: "PW", phrase: "MOBILIDADE REDUZIDA", description: "Atraso no embarque ou desembarque de passageiros com mobilidade reduzida (PMRs)" }
            ]
        },
        {
            title: "Carga e Correio",
            icon: "📦",
            color: "border-amber-600 text-amber-500",
            items: [
                { code: "21", subCode: "CD", phrase: "DOC DE CARGA", description: "Erros de documentação, manifestos de carga ou trâmites fiscais" },
                { code: "22", subCode: "CP", phrase: "POSICIONAMENTO", description: "Posicionamento tardio da carga na rampa para o carregamento" },
                { code: "23", subCode: "CC", phrase: "ACEITAÇÃO DE CARGA", description: "Aceitação tardia de lotes de carga no terminal" },
                { code: "24", subCode: "CI", phrase: "EMBALAGEM INDEVIDA", description: "Embalagem inadequada ou avariada que exigiu reprocessamento" },
                { code: "25", subCode: "CO", phrase: "EXCESSO DE RESERVA", description: "Overbooking de espaço de carga ou erros de reserva nos porões" },
                { code: "26", subCode: "CU", phrase: "ATRASO NO ARMAZÉM", description: "Preparação ou paletização tardia da carga dentro do armazém de carga" },
                { code: "27", subCode: "CE", phrase: "CORREIO: DOC", description: "Erros de documentação ou embalagem de malas de correio (Apenas Correio)" },
                { code: "28", subCode: "CL", phrase: "CORREIO: ACEITAÇÃO", description: "Aceitação tardia do material postal vindo dos correios (Apenas Correio)" },
                { code: "29", subCode: "CA", phrase: "CORREIO: RAMPA", description: "Posicionamento tardio do correio ao lado da aeronave (Apenas Correio)" }
            ]
        },
        {
            title: "Aeronave e Atendimento de Rampa (Ground Handling)",
            icon: "🚜",
            color: "border-purple-500 text-purple-400",
            items: [
                { code: "31", subCode: "GD", phrase: "DOC DA AERONAVE", description: "Atraso ou incorreção na papelada do voo: peso e balanceamento (Loadsheet), declaração geral, manifesto de pax, etc." },
                { code: "32", subCode: "GL", phrase: "CARREGAMENTO", description: "Problemas no carregamento/descarregamento, carga volumosa, cargas especiais, malas na cabine ou falta de operadores na rampa" },
                { code: "33", subCode: "GE", phrase: "EQUIP. CARREGAMENTO", description: "Falta ou quebra de equipamentos de rampa (ex: esteiras, carregadores de contêineres LDL) ou falta de operadores" },
                { code: "34", subCode: "GS", phrase: "EQUIP. APOIO / ESCADA", description: "Falta ou quebra de equipamentos de atendimento (ex: escadas de passageiros, GPU, LPU) ou falta de pessoal" },
                { code: "35", subCode: "GC", phrase: "LIMPEZA (CLEANING)", description: "Atraso na execução da limpeza interna da cabine da aeronave" },
                { code: "36", subCode: "GF", phrase: "ABASTECIMENTO", description: "Atraso no abastecimento ou reabastecimento de combustível causado pelo fornecedor (Fuel Supplier)" },
                { code: "37", subCode: "GB", phrase: "ABAST. CATERING", description: "Entrega ou carregamento tardio dos carrinhos de comissaria/catering na aeronave" },
                { code: "38", subCode: "GU", phrase: "FALTA DE ULD", description: "Falta de disponibilidade ou condições precárias de uso de contêineres/paletes (ULDs)" },
                { code: "39", subCode: "GT", phrase: "EQUIP. TÉCNICO / PUSH", description: "Falta ou quebra de equipamentos técnicos essenciais, incluindo trator de pushback, barra de reboque ou operadores" }
            ]
        },
        {
            title: "Manutenção e Equipamento Técnico",
            icon: "🔧",
            color: "border-red-500 text-red-400",
            items: [
                { code: "41", subCode: "TD", phrase: "DEFEITOS TÉCNICOS", description: "Pane ou defeitos identificados na aeronave que necessitam de intervenção mecânica" },
                { code: "42", subCode: "TM", phrase: "MANUT. PROGRAMADA", description: "Liberação tardia da aeronave que estava em manutenção de rotina ou programada" },
                { code: "43", subCode: "TN", phrase: "MANUT. IMEDIATA", description: "Manutenção não programada, verificações especiais ou panes de última hora na linha" },
                { code: "44", subCode: "TS", phrase: "FALTA DE PEÇAS", description: "Falta ou quebra de ferramentas mecânicas ou peças de reposição necessárias para o reparo" },
                { code: "45", subCode: "TA", phrase: "TRANSPORTE AOG", description: "Transporte de peças críticas de reposição (Aircraft On Ground) destinadas a outra base da empresa" },
                { code: "46", subCode: "TC", phrase: "TROCA DE CORTE", description: "Troca compulsória de aeronave por motivos estritamente técnicos" },
                { code: "47", subCode: "TL", phrase: "AERONAVE RESERVA", description: "Falta ou indisponibilidade da aeronave reserva (Stand-by) por razões técnicas prévias" },
                { code: "48", subCode: "TV", phrase: "CONFIG. DE CABINE", description: "Ajustes de última hora programados na versão, mapa de assentos ou configuração interna da cabine" }
            ]
        },
        {
            title: "Danos à Aeronave e Sistemas de TI",
            icon: "💻",
            color: "border-teal-500 text-teal-400",
            items: [
                { code: "51", subCode: "DF", phrase: "DANOS EM OPERAÇÃO", description: "Danos sofridos em voo/táxi: colisão com pássaros (bird strike), raio, turbulência extrema, pouso duro ou colisão taxiando" },
                { code: "52", subCode: "DG", phrase: "DANOS EM SOLO", description: "Danos em solo: colisão por veículos da rampa, avarias no carregamento, contaminação de fluidos ou clima extremo" },
                { code: "55", subCode: "ED", phrase: "SISTEMA DE CHECK-IN", description: "Falha de TI nos sistemas automatizados de controle de partida (DCS), check-in ou portão de embarque" },
                { code: "56", subCode: "EC", phrase: "SISTEMA DE CARGA", description: "Falha de TI nos softwares automatizados de manifesto ou pesagem de carga" },
                { code: "57", subCode: "EF", phrase: "SISTEMA DE PLANOS", description: "Falhas em sistemas de computador voltados para o processamento de Planos de Voo" },
                { code: "58", subCode: "EO", description: "Outras panes, bugs ou indisponibilidade em sistemas de computadores gerais da base", phrase: "OUTROS SISTEMAS" }
            ]
        },
        {
            title: "Operações de Voo e Tripulação",
            icon: "🧑‍✈️",
            color: "border-indigo-500 text-indigo-400",
            items: [
                { code: "61", phrase: "DOC DE VOO", subCode: "FP", description: "Conclusão tardia, conferência ou alterações de última hora na documentação ou planos de voo" },
                { code: "62", phrase: "ALTERAÇÃO OPERACIONAL", subCode: "FF", description: "Mudanças operacionais tardias: reajuste de combustível por autonomia ou alteração drástica de carga limite" },
                { code: "63", phrase: "EMBARQUE DE TRIPUL.", subCode: "FT", description: "Procedimentos de partida ou embarque tardio da tripulação inteira (exceto conexões ou tripulação reserva)" },
                { code: "64", phrase: "FALTA DE PILOTOS", subCode: "FS", description: "Falta de pilotos/co-pilotos por motivo de doença, limites de jornada estourados, alimentação ou problemas de visto/vacina" },
                { code: "65", phrase: "SOLICITAÇÃO PILOTO", subCode: "FR", description: "Pedidos especiais ou checagens extras da tripulação técnica fora dos requisitos operacionais padrão" },
                { code: "66", phrase: "EMBARQUE COMISSÁRIOS", subCode: "FL", description: "Embarque tardio ou procedimentos operacionais atrasados da tripulação de cabine (comissários)" },
                { code: "67", phrase: "FALTA DE COMISSÁRIOS", subCode: "FC", description: "Falta de comissários por licença médica, estouro de jornada regulamentar, refeições ou atraso em exames" },
                { code: "68", phrase: "ERRO DE CABINE", subCode: "FA", description: "Erros operacionais internos ou solicitações especiais da equipe de comissários fora do padrão" },
                { code: "69", phrase: "REVISTA DE SEGURANÇA", subCode: "FB", description: "Solicitação extraordinária do Comandante para realização de vistoria ou checagem extra de segurança na aeronave" }
            ]
        },
        {
            title: "Condições Meteorológicas (Weather)",
            icon: "⛈️",
            color: "border-sky-500 text-sky-400",
            items: [
                { code: "71", subCode: "WO", phrase: "METEO DE ORIGEM", description: "Condições meteorológicas adversas operando abaixo dos mínimos na estação de partida" },
                { code: "72", subCode: "WT", phrase: "METEO DE DESTINO", description: "Condições climáticas fechadas ou abaixo dos mínimos na base de destino pretendida" },
                { code: "73", subCode: "WR", phrase: "METEO EM ROTA", description: "Clima adverso ao longo da rota de navegação ou nas bases de alternativa designadas" },
                { code: "75", subCode: "WI", phrase: "DESCONGELAMENTO", description: "Operação obrigatória de de-icing (remoção de neve/gelo) da fuselagem (exclui falha de equipamentos)" },
                { code: "76", subCode: "WS", phrase: "LIMPEZA DE PISTA", description: "Atrasos decorrentes da remoção de neve, gelo, água acumulada ou bolsões de areia nas pistas do aeroporto" },
                { code: "77", subCode: "WG", phrase: "RAMPA INTERDITADA", description: "Operações e atendimento de solo severamente prejudicados ou paralisados por tempestades, raios ou ventos fortes" }
            ]
        },
        {
            title: "ATFM, Aeroportos e Autoridades Governamentais",
            icon: "🛂",
            color: "border-emerald-500 text-emerald-400",
            items: [
                { code: "81", subCode: "AT", phrase: "ATC EM ROTA", description: "Restrições de fluxo de tráfego aéreo (ATFM) devido a problemas de excesso de demanda ou capacidade do controle de rota" },
                { code: "82", subCode: "AX", phrase: "GREVE / APAGÃO ATC", description: "Restrições de ATFM decorrentes de greve de controladores, falta de pessoal, falha de radar ou exercícios militares na área" },
                { code: "83", subCode: "AE", phrase: "RESTRIÇÃO NO DESTINO", description: "Restrições de ATFM por fechamento de pista no destino (obstruções, greves locais, toque de recolher noturno ou ruído)" },
                { code: "84", subCode: "AW", phrase: "METEO ATC NO DESTINO", description: "Restrições de fluxo applied pelo controle de tráfego aéreo devido ao mau tempo severo na área de destino" },
                { code: "85", subCode: "AS", phrase: "SEGURANÇA OBRIGATÓRIA", description: "Inspeções, quebras de protocolos ou exigências de segurança de caráter mandatório pelas autoridades" },
                { code: "86", subCode: "AG", phrase: "ALFÂNDEGA / SAÚDE", description: "Atrasos causados por trâmites lentos ou vistorias de órgãos como Imigração, Alfândega, Receita Federal ou Vigilância Sanitária" },
                { code: "87", subCode: "AF", phrase: "INFRAESTRUTURA", description: "Problemas do aeroporto: falta de posições de estacionamento (stands), congestionamento geral na rampa ou panes nas pontes (pontes de embarque)" },
                { code: "88", subCode: "AD", phrase: "RESTRIÇÃO NA ORIGEM", description: "Restrições na base de partida (fechamento de pista por incidentes, panes no serviço de tráfego de solo, pushback suspenso pelo aeroporto, etc.)" },
                { code: "89", subCode: "AM", phrase: "OUTRAS AUTORIDADES", description: "Restrições diversas emanadas por órgãos de regulação ou gerenciamento de fluxo aéreo geral" }
            ]
        },
        {
            title: "Atrasos Reacionários (Efeito Cascata)",
            icon: "🔄",
            color: "border-pink-500 text-pink-400",
            items: [
                { code: "91", subCode: "RL", phrase: "CONEXÃO DE CARGA", description: "Aeronave retida aguardando a chegada ou transferência de carga e correio vindo de outro voo conectado" },
                { code: "92", subCode: "RT", phrase: "CONEXÃO DE PAX", description: "Erro ou lentidão na transferência de malas ou passageiros em trânsito com conexões apertadas (Through Check-In)" },
                { code: "93", subCode: "RA", phrase: "ROTAÇÃO DE AERONAVE", description: "Chegada tardia da aeronave cumprindo o trecho anterior da malha de voos (Atraso reacionário padrão)" },
                { code: "94", subCode: "RS", phrase: "ROTAÇÃO DE COMISSÁRIOS", description: "Aguardando a chegada de comissários de bordo que estão conectando vindos de outra aeronave atrasada" },
                { code: "95", subCode: "RC", phrase: "ROTAÇÃO DE PILOTOS", description: "Aguardando a chegada de pilotos (Crew Deck) ou da tripulação completa vindos de outro voo in trânsito" },
                { code: "96", subCode: "RO", phrase: "CONTROLE OPERACIONAL", description: "Decisões do Centro de Controle (CCO): alteração de rotas por conveniência, voos alternados, consolidação de voos ou troca por motivos comerciais" }
            ]
        },
        {
            title: "Códigos Diversos (Miscellaneous)",
            icon: "⚠️",
            color: "border-rose-600 text-rose-500",
            items: [
                { code: "97", subCode: "MI", phrase: "GREVE DA COMPANHIA", description: "Paralisações trabalhistas ou greves organizadas pelos funcionários da própria linha aérea" },
                { code: "98", subCode: "MO", phrase: "GREVE EXTERNA", description: "Paralisações externas de prestadores de serviços de rampa ou aeroportuários (exclui controladores de tráfego)" },
                { code: "99", subCode: "MX", phrase: "OUTROS MOTIVOS", description: "Quaisquer outras intercorrências ou incidentes atípicos que não se enquadrem em nenhuma categoria acima" }
            ]
        }
    ], []);

    // 2. BANCO DE DADOS: CODES ESPECÍFICOS DA EASYJET (De acordo com image_454cdb.jpg)
    const easyjetCategories: DelayCategory[] = useMemo(() => [
        {
            title: "Códigos Operacionais Estação easyJet",
            icon: "🟠",
            color: "border-orange-500 text-orange-400",
            items: [
                { code: "35", phrase: "LIMPEZA EXTERNA", description: "Limpeza externa da aeronave (External cleaning)" },
                { code: "36", phrase: "COMBUSTÍVEL", description: "Atrasos relacionados a abastecimento ou reabastecimento de combustível (Fuel)" },
                { code: "41-46", phrase: "MANUTENÇÃO / PANES", description: "Problemas mecânicos, defeitos técnicos ou manutenção de linha na aeronave (Tech problems / Maintenance)" },
                { code: "55", phrase: "FALHA SISTEMA ERES", description: "Pane ou falha no sistema ERES (Software interno de reservas e despacho DCS da easyJet)" },
                { code: "61", phrase: "PLANO DE VOO / DOC", description: "Atraso no processamento do plano de voo ou liberação de documentações regulamentares" },
                { code: "62", phrase: "ALTERAÇÃO DE CARGA", description: "Ajuste manual de carga de última hora ou aeronave fora dos limites operacionais de trim (Load alteration / out of trim)" },
                { code: "63", phrase: "TRIPULAÇÃO ATRASADA", description: "Apresentação ou embarque tardio da tripulação técnica ou de cabine para a aeronave (Late crew to A/C)" },
                { code: "64", phrase: "FALTA DE PILOTOS", description: "Déficit na tripulação técnica devido a faltas, licença médica de pilotos ou problemas de acionamento de stand-by" },
                { code: "65", phrase: "SOLICITAÇÃO DE PILOTO", description: "Pedidos especiais ou checagens de rampa solicitadas pela tripulação técnica (Flight deck special request)" },
                { code: "66", phrase: "LIBERAÇÃO DE CABINE", description: "Atraso na liberação da cabine de passageiros pelos comissários de bordo (Late cabin release)" },
                { code: "67", phrase: "LICENÇA MÉDICA (CREW)", description: "Problemas de saúde ou indisponibilidade por doença da tripulação em solo (Crew sickness)" },
                { code: "68", phrase: "ERRO DE COMISSÁRIOS", description: "Incorreções ou falhas operacionais cometidas pela tripulação de cabine (Cabin crew error)" },
                { code: "71-77", phrase: "CONDIÇÕES CLIMÁTICAS", description: "Atraso motivado por fatores meteorológicos adversos na rota, origem ou destino (Weather)" },
                { code: "81-86", phrase: "RESTRIÇÃO DE SLOT", description: "Restrições de fluxo de tráfego aéreo impostas pelo controle de tráfego (SLOT / ATFM)" },
                { code: "87", phrase: "INFRAESTRUTURA / PMR", description: "Limitações de instalações aeroportuárias, chegada tardia do voo anterior ou problemas com o serviço MyWay de assistência a passageiros com mobilidade reduzida (PRMs)" }
            ]
        }
    ], []);

    // 3. MOTOR DE BUSCA DINÂMICO INTELIGENTE
    const filteredCategories = useMemo(() => {
        const currentCategories = activeTab === 'iata' ? iataCategories : easyjetCategories;
        if (!searchTerm.trim()) return currentCategories;

        const lowerTerm = searchTerm.toLowerCase();
        return currentCategories
            .map(category => {
                const filteredItems = category.items.filter(item =>
                    item.code.toLowerCase().includes(lowerTerm) ||
                    item.subCode?.toLowerCase().includes(lowerTerm) ||
                    item.phrase.toLowerCase().includes(lowerTerm) ||
                    item.description.toLowerCase().includes(lowerTerm)
                );
                return { ...category, items: filteredItems };
            })
            .filter(category => category.items.length > 0);
    }, [searchTerm, activeTab, iataCategories, easyjetCategories]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-zinc-100 font-sans pb-28">
            {/* Header da Página */}
            <div className="p-6 border-b border-zinc-800 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-extrabold text-white tracking-wide flex items-center justify-center gap-2">
                    Central de códigos de atraso
                </h2>
                <p className="text-zinc-400 text-sm mt-1">Interpretação ágil de irregularidades para o gerenciamento de turnos</p>
            </div>

            {/* SELETOR DE ABAS (TABS) ERGONÔMICO */}
            <div className="max-w-md mx-auto px-4 mt-4 flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
                <button
                    onClick={() => { setActiveTab('iata'); setSearchTerm(''); }}
                    className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all tracking-wider uppercase ${activeTab === 'iata'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                >
                    🌐 IATA Padrão
                </button>
                <button
                    onClick={() => { setActiveTab('easyjet'); setSearchTerm(''); }}
                    className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all tracking-wider uppercase ${activeTab === 'easyjet'
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                >
                    🟠 easyJet Codes
                </button>
            </div>

            {/* INPUT DE BUSCA AMPLO, PROMINENTE E ADAPTADO */}
            <div className="p-4 max-w-3xl mx-auto w-full px-4 mt-3">
                <div className="relative shadow-2xl rounded-2xl">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl pointer-events-none">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder={
                            activeTab === 'iata'
                                ? "Buscar código IATA, sigla ou palavra-chave (ex: 93, PB, clima)..."
                                : "Buscar código easyJet ou palavra-chave (ex: 55, ERES, slot)..."
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full bg-zinc-900 border-2 rounded-2xl py-4 pl-12 pr-24 text-white focus:outline-none focus:ring-2 focus:border-transparent placeholder-zinc-500 transition-all text-base md:text-lg font-medium tracking-wide ${activeTab === 'easyjet' ? 'border-orange-600/50 focus:ring-orange-500' : 'border-zinc-700/80 focus:ring-purple-500'
                            }`}
                    />

                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-white font-bold text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition border border-zinc-700"
                        >
                            LIMPAR
                        </button>
                    )}
                </div>
            </div>

            {/* Grid de Exibição das Categorias */}
            <div className="max-w-4xl mx-auto px-4 mt-2 space-y-6">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        Nenhum código localizado para "{searchTerm}" nesta companhia.
                    </div>
                ) : (
                    filteredCategories.map((category, catIdx) => (
                        <div key={catIdx} className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 overflow-hidden shadow-xl">

                            {/* Cabeçalho do Card */}
                            <div className="bg-zinc-900 px-5 py-3 border-b border-zinc-800 flex items-center gap-3">
                                <span className="text-xl">{category.icon}</span>
                                <h2 className="font-bold text-white tracking-wide text-sm md:text-base">{category.title}</h2>
                                <span className="ml-auto text-xs bg-zinc-800 text-zinc-400 font-mono px-2 py-0.5 rounded">
                                    {category.items.length} {category.items.length === 1 ? 'item' : 'itens'}
                                </span>
                            </div>

                            {/* Linhas de Códigos */}
                            <div className="divide-y divide-zinc-800/50">
                                {category.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="p-4 flex flex-col md:flex-row items-start md:items-center gap-3 hover:bg-zinc-800/20 transition">

                                        {/* Badge do Código */}
                                        <div className="flex items-center gap-2 shrink-0 w-full md:w-32">
                                            <span className={`font-mono font-black text-lg border px-2 py-0.5 rounded-lg w-20 text-center ${activeTab === 'easyjet'
                                                    ? 'text-orange-400 bg-orange-950/30 border-orange-800/40'
                                                    : 'text-purple-400 bg-purple-950/40 border-purple-800/50'
                                                }`}>
                                                <b>{item.code}</b>
                                            </span>
                                            {item.subCode && (
                                                <span className="font-sans font-bold text-xs bg-zinc-800 text-zinc-300 px-1.5 py-1 rounded tracking-wider border border-zinc-700">
                                                    <b> - {item.subCode} </b>
                                                </span>
                                            )}
                                        </div>

                                        {/* Descrição e Significado */}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 mb-0.5">
                                                <span className={`w-1.5 h-1.5 rounded-full border-2 ${category.color.split(' ')[0]}`} />
                                                {item.phrase}
                                            </div>
                                            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                        <br />
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}