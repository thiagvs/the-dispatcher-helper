import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Radio as RadioIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  VpnKey as KeyIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  LocalAirport as AirportIcon
} from '@mui/icons-material';

// Interface de Contato
interface ContactItem {
  label: string;
  value: string;
  subValue?: string;
  type?: 'phone' | 'vhf' | 'email' | 'cred';
}

interface ContactCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: ContactItem[];
}

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  // Dados higienizados, organizados e sem duplicatas
  const categories: ContactCategory[] = [
    {
      title: 'Frequências & Telefones Externos',
      icon: <RadioIcon sx={{ color: '#38bdf8' }} />,
      color: '#38bdf8',
      items: [
        { label: 'Portway VHF', value: '131.875', type: 'vhf' },
        { label: 'FAO Safety', value: '131.450', type: 'vhf' },
        { label: 'Portway Geral', value: '289 559 405', type: 'phone' },
        { label: 'Aeroporto Geral', value: '289 800 800', type: 'phone' }
      ]
    },
    {
      title: 'Operações & Supervisão',
      icon: <BusinessIcon sx={{ color: '#34d399' }} />,
      color: '#34d399',
      items: [
        { label: 'Supervisão', value: '61496 / 62405', type: 'phone' },
        { label: 'Coordenação', value: '62401', type: 'phone' },
        { label: 'Suporte Ops', value: '62428', type: 'phone' },
        { label: 'C. Incidências', value: '62002', type: 'phone' },
        { label: 'SOA', value: '62613', type: 'phone' },
        { label: 'Carga', value: '62625', type: 'phone' },
        { label: 'PSP', value: '62688', type: 'phone' },
        { label: 'Recursos Humanos (RH)', value: '62410', type: 'phone' }
      ]
    },
    {
      title: 'Atendimento & Infraestrutura',
      icon: <AirportIcon sx={{ color: '#facc15' }} />,
      color: '#facc15',
      items: [
        { label: 'Balcão', value: '62406 / 62885', type: 'phone' },
        { label: 'Check-in (CKIN)', value: '636 + N°', type: 'phone' },
        { label: 'Lost & Found', value: '62407', type: 'phone' },
        { label: 'MyWay', value: '63373 / 61742', type: 'phone' },
        { label: 'Sala de Descanso', value: '61498', type: 'phone' },
        { label: 'Tapete PART', value: '61424', type: 'phone' },
        { label: 'Mangas', value: '630 + N° Manga', type: 'phone' },
        { label: 'Porta 322', value: '61303', type: 'phone' },
        { label: 'Portas Remoto', value: '638 + N° Porta', type: 'phone' }
      ]
    },
    {
      title: 'E-mails Operacionais',
      icon: <EmailIcon sx={{ color: '#f472b6' }} />,
      color: '#f472b6',
      items: [
        { label: 'Supervisão Pax', value: 'supervisaopaxfao@portway.pt', type: 'email' },
        { label: 'Suporte Ops', value: 'Opssupport.fao@portway.pt', type: 'email' }
      ]
    },
    {
      title: 'Sistemas & Credenciais',
      icon: <KeyIcon sx={{ color: '#fb923c' }} />,
      color: '#fb923c',
      items: [
        { label: 'GoPads', value: 'Ptw.fao.f4s', subValue: 'Pass: 654321', type: 'cred' },
        { label: 'GoPadsGate', value: 'Ptw', subValue: 'Pass: 123456', type: 'cred' },
        { label: 'MyWayAPP', value: 'Ptw.fao', subValue: 'Pass: portway01', type: 'cred' }
      ]
    }
  ];

  // Filtro de busca simples
  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase()) ||
      (item.subValue && item.subValue.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <Box sx={{ w: '100%', color: '#f8fafc', p: 1 }}>
      {/* Campo de Busca Rápida */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar contacto, extensão, e-mail ou sistema..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#64748b' }} />
                </InputAdornment>
              )
            }
          }}
          sx={{
            bgcolor: '#0f172a',
            borderRadius: 2,
            '& .MuiInputBase-input': { color: '#f8fafc', fontSize: '0.875rem' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' }
          }}
        />
      </Box>

      {/* Lista de Categorias em Grid */}
      <Grid container spacing={2.5}>
        {filteredCategories.map((category, idx) => (
          <Grid size={{ xs: 12, md: 6 }} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 2.5,
                height: '100%'
              }}
            >
              {/* Título da Categoria */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                {category.icon}
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: category.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {category.title}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: '#334155', mb: 1.5 }} />

              {/* Itens */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {category.items.map((item, itemIdx) => (
                  <Box
                    key={itemIdx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: '#0f172a',
                      border: '1px solid #1e293b',
                      '&:hover': { borderColor: '#334155' }
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>
                      {item.label}:
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: item.type === 'vhf' ? '#38bdf8' : '#f8fafc',
                          fontFamily: item.type === 'vhf' || item.type === 'cred' ? 'monospace' : 'inherit',
                          fontWeight: 'bold',
                          fontSize: '0.8125rem'
                        }}
                      >
                        {item.value}
                      </Typography>

                      {item.subValue && (
                        <Chip
                          label={item.subValue}
                          size="small"
                          sx={{
                            bgcolor: '#334155',
                            color: '#facc15',
                            fontSize: '0.7rem',
                            height: 20,
                            fontFamily: 'monospace'
                          }}
                        />
                      )}

                      <Tooltip title={copiedValue === item.value ? 'Copiado!' : 'Copiar'}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(item.value)}
                          sx={{ color: copiedValue === item.value ? '#34d399' : '#64748b', p: 0.5 }}
                        >
                          {copiedValue === item.value ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};