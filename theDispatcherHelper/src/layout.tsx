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
            <div className="flex flex-col min-h-screen bg-[#12181f]">
                <CustomHeader />
                
                {/* O segredo está nestas classes: flex-1 faz o conteúdo crescer e empurrar o resto */}
                <main className="flex-1 flex flex-col justify-between p-4 pb-20">
                    <div>
                        <Routes>
                            <Route path="/" element={<Loads />} />
                            <Route path="/tips" element={<Tips />} />
                            <Route path="/contacts" element={<Contacts />} />
                            <Route path="/rights" element={<CompaniesRights />} />
                        </Routes>
                    </div>
                    <CustomFooter />
                </main>

                {/* Espaçamento para não cobrir o footer */}
                <div className="h-16"></div>

                <NavigatorCustom />
            </div>
        </BrowserRouter>
    );
};

export default MainLayout;