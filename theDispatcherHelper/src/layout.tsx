import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavigatorCustom from "./components/navigationCustom";
import Loads from "./views/load";
import Contacts from "./views/contacts";
import Tips from "./views/tips";
import CompaniesRights from "./views/rights";
import { CustomHeader } from "./components/customHeader";
import CustomFooter from "./components/customFooter"; // Certifique-se de importar o Footer aqui

const MainLayout = () => {
    return (
        <BrowserRouter>
            {/* O h-screen fixa a altura na tela, o flex-col organiza topo/meio/fundo */}
            <div className="flex flex-col h-screen bg-[#12181f] overflow-hidden">
                <CustomHeader />

                {/* 1. overflow-y-auto: Cria o scroll apenas nesta área central.
                  2. flex-1: Faz esta área ocupar todo o espaço entre o Header e o Menu.
                  3. pb-10: Um respiro extra para o Footer não colar na borda.
                */}
                <main className="flex-1 flex flex-col justify-between p-4 pb-24">
                    <div>
                        <Routes>
                            <Route path="/" element={<Loads />} />
                            <Route path="/tips" element={<Tips />} />
                            <Route path="/contacts" element={<Contacts />} />
                            <Route path="/rights" element={<CompaniesRights />} />
                        </Routes>
                    </div>

                    {/* O Footer agora é o último item do scroll interno */}
                    <CustomFooter />
                </main>

                {/* O Menu fica fixo no final do flex-col, fora do scroll */}
                <NavigatorCustom />
            </div>
        </BrowserRouter>
    );
};

export default MainLayout;