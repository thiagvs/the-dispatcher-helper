import { useState } from 'react';
import { Menu, X, Plane, Lightbulb, Phone, Info, Copyright } from 'lucide-react';

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'load', name: 'Load Control', icon: <Plane size={20} /> },
    { id: 'dicas', name: 'Dicas', icon: <Lightbulb size={20} /> },
    { id: 'contatos', name: 'Contatos', icon: <Phone size={20} /> },
    { id: 'info', name: 'Informações', icon: <Info size={20} /> },
    { id: 'rights', name: 'Companies Rights', icon: <Copyright size={20} /> },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Overlay (Fundo escurecido) - Só aparece quando o menu está aberto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - O menu em si */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-[#1a1c23] text-white z-50 
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Cabeçalho do Menu */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <span className="text-lg font-bold tracking-widest text-blue-400">MENU</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Itens do Menu */}
        <nav className="mt-4">
          <ul className="list-none p-0 m-0">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    console.log(`Navegando para: ${item.name}`);
                    setIsOpen(false); // Fecha o menu ao clicar
                  }}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-600/20 hover:text-blue-400 transition-all border-l-4 border-transparent hover:border-blue-500"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  <span className="font-medium text-sm uppercase tracking-wider">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Rodapé do Menu */}
        <div className="absolute bottom-0 w-full p-6 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
            Ground Operations Helper © 2026
          </p>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;