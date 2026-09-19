import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    IconButton,
    Typography,
    Paper,
} from '@mui/material';
import {
    Close as CloseIcon,
    ContentCopy as CopyIcon,
    CellTower as LdmIcon
} from '@mui/icons-material';

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

export default function LdmModal({ open, cargoData, onClose }: { open: boolean, cargoData: CargoData, onClose: () => void }) {
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

    const getInputSx = (labelColor?: string) => ({
        bgcolor: '#0f172a',
        borderRadius: 1,
        '& .MuiInputBase-input': { color: '#f8fafc' },
        '& .MuiInputLabel-root': {
            color: labelColor || '#94a3b8',
            fontWeight: labelColor ? 'bold' : 'normal',
            '&.Mui-focused': { color: labelColor || '#38bdf8' },
            '&.MuiInputLabel-shrink': {
                bgcolor: '#0f172a', // Mantém o fundo escuro atrás do texto do Label
                px: 0.75,
                borderRadius: '4px',
                transform: 'translate(12px, -9px) scale(0.75)' // Ajuste fino do posicionamento
            }
        },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' }
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: '#1e293b',
                        color: '#f8fafc',
                        borderRadius: 3,
                        border: '1px solid #334155',
                        boxShadow: 24,
                        backgroundImage: 'none'
                    }
                }
            }}
        >
            {/* Cabeçalho do Modal */}
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2.5,
                    bgcolor: '#0f172a',
                    borderBottom: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LdmIcon sx={{ color: '#38bdf8' }} /> Transmissão LDM
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: '#94a3b8',
                        '&:hover': { color: '#f8fafc', bgcolor: 'rgba(255, 255, 255, 0.05)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Conteúdo do Modal / Formulário */}
            <DialogContent sx={{ p: 3 }}>
                <Grid container columnSpacing={2} rowSpacing={3} sx={{ mt: 0.5, mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Cia"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { maxLength: 3 } }}
                            sx={getInputSx()}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Voo"
                            name="flightNumber"
                            value={formData.flightNumber}
                            onChange={handleInputChange}
                            sx={getInputSx()}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Dia"
                            name="day"
                            value={formData.day}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { maxLength: 2 } }}
                            sx={getInputSx()}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Matrícula"
                            name="registration"
                            value={formData.registration}
                            onChange={handleInputChange}
                            sx={getInputSx()}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Capacidade"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            sx={getInputSx()}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Tripulação"
                            name="crew"
                            value={formData.crew}
                            onChange={handleInputChange}
                            sx={getInputSx()}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Destino"
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { maxLength: 3 } }}
                            sx={getInputSx()}
                        />
                    </Grid>

                    {/* Passageiros com Cores Destaque */}
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Males (M)"
                            name="males"
                            value={formData.males}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { min: 0 } }}
                            sx={getInputSx('#38bdf8')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Females (F)"
                            name="females"
                            value={formData.females}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { min: 0 } }}
                            sx={getInputSx('#f472b6')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Child (CHD)"
                            name="children"
                            value={formData.children}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { min: 0 } }}
                            sx={getInputSx('#facc15')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Infant (INF)"
                            name="infants"
                            value={formData.infants}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { min: 0 } }}
                            sx={getInputSx('#34d399')}
                        />
                    </Grid>

                    {/* Bagagem em Trânsito (BT) */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Bagagem em Trânsito (BT) - Apenas se houver"
                            placeholder="Ex: 10/150"
                            name="bt"
                            value={formData.bt}
                            onChange={handleInputChange}
                            sx={{
                                ...getInputSx('#fb923c'),
                                width: { xs: '100%', sm: '50%' }
                            }}
                        />
                    </Grid>
                </Grid>

                {/* Painel de Pré-visualização do LDM */}
                <Paper
                    elevation={0}
                    sx={{
                        position: 'relative',
                        p: 2.5,
                        bgcolor: '#020617',
                        borderRadius: 2,
                        border: '1px solid #334155'
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 'bold',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            display: 'block',
                            mb: 1.5
                        }}
                    >
                        Pré-visualização
                    </Typography>

                    <Typography
                        component="pre"
                        sx={{
                            color: '#34d399',
                            fontFamily: 'monospace, Consolas, Courier New',
                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            lineHeight: 1.6,
                            m: 0
                        }}
                    >
                        {ldmString}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CopyIcon />}
                        onClick={copyToClipboard}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: '#1e293b',
                            color: '#cbd5e1',
                            borderColor: '#475569',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            '&:hover': {
                                bgcolor: '#334155',
                                borderColor: '#94a3b8',
                                color: '#fff'
                            }
                        }}
                    >
                        Copiar
                    </Button>
                </Paper>
            </DialogContent>

            {/* Rodapé / Ações */}
            <DialogActions sx={{ px: 3, py: 2, bgcolor: '#0f172a', borderTop: '1px solid #334155' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        bgcolor: '#334155',
                        color: '#f8fafc',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#475569' }
                    }}
                >
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
}