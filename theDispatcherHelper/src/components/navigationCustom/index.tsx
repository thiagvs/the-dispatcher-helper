import * as React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ViewListIcon from "@mui/icons-material/ViewList";
import WorkIcon from "@mui/icons-material/Work";
import PhoneIcon from "@mui/icons-material/Phone";
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

const NavigatorCustom: React.FC = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    const routes = ["/", "/tips", "/contacts", "/rights"];

    return (
        <>
            <div className="w-full z-50 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
                <BottomNavigation
                    sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', background: '#2e2d2a' }}
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        console.log("Navegando para:", routes[newValue]);
                        console.log("Evento:", event);
                        setValue(newValue);
                        navigate(routes[newValue]);
                    }}
                >
                    <BottomNavigationAction label="Carregamento" style={{'color': '#9ca3af'}} icon={<WorkIcon />} />
                    <BottomNavigationAction label="Dicas" style={{'color': '#9ca3af'}} icon={<ViewListIcon />} />
                    <BottomNavigationAction label="Contatos e informações" style={{'color': '#9ca3af'}} icon={<PhoneIcon />} />
                    <BottomNavigationAction label="Direito das companhias" style={{'color': '#9ca3af'}} icon={<FolderCopyIcon />} />
                </BottomNavigation>
            </div >
        </>

    );
};

export default NavigatorCustom;