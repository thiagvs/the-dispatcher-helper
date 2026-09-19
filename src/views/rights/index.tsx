import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  Alert,
  Grid,
  Stack,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Wc as WcIcon,
  WaterDrop as WaterIcon,
  ElectricBolt as GpuIcon,
  FlightTakeoff as AirlineIcon,
  WarningAmber as AlertIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

type Company = {
  icao: string;
  iata: string;
  operator: string;
  wc: number;
  agua: number;
  gpu: number;
};

const companies: Company[] = [
  { icao: "ABR", iata: "AG", operator: "AIR CONTRACTORS", wc: 1, agua: 1, gpu: 60 },
  { icao: "ADR", iata: "JP", operator: "ADRIA AIRWAYS", wc: 0, agua: 0, gpu: 60 },
  { icao: "ANE", iata: "YW", operator: "AIR NOSTRUM", wc: 0, agua: 0, gpu: 60 },
  { icao: "ART", iata: "6Y", operator: "SMART LYNX", wc: 1, agua: 1, gpu: 60 },
  { icao: "AXY", iata: "6V", operator: "AXIS AIRWAYS", wc: 1, agua: 1, gpu: 60 },
  { icao: "BTI", iata: "BT", operator: "AIR BALTIC", wc: 1, agua: 0, gpu: 0 },
  { icao: "BEL", iata: "SN", operator: "SN BRUSSELS AIRLINES", wc: 0, agua: 0, gpu: 60 },
  { icao: "BLX", iata: "6B", operator: "TUIFLY NORDIC", wc: 0, agua: 0, gpu: 60 },
  { icao: "CND", iata: "CD", operator: "CORENDON", wc: 1, agua: 0, gpu: 60 },
  { icao: "CSA", iata: "OK", operator: "CZECH AIRLINES", wc: 1, agua: 1, gpu: 110 },
  { icao: "DLH", iata: "LH", operator: "LUFTHANSA", wc: 1, agua: 1, gpu: 0 },
  { icao: "EDW", iata: "WK", operator: "EDELWEISS", wc: 0, agua: 0, gpu: 60 },
  { icao: "ENT", iata: "E4", operator: "ENTER AIR", wc: 1, agua: 1, gpu: 0 },
  { icao: "EVJ", iata: "XH", operator: "EVERJETS", wc: 1, agua: 1, gpu: 60 },
  { icao: "EWG", iata: "EW", operator: "EUROWINGS", wc: 0, agua: 0, gpu: 45 },
  { icao: "EXS", iata: "LS", operator: "JET2 COM", wc: 0, agua: 0, gpu: 60 },
  { icao: "EZS", iata: "DS", operator: "EASYJET SWITZERLAND", wc: 0, agua: 0, gpu: 60 },
  { icao: "EZY", iata: "U2", operator: "EASYJET AIRLINE COMPANY, LDA", wc: 0, agua: 0, gpu: 60 },
  { icao: "FIN", iata: "AY", operator: "FINNAIR", wc: 1, agua: 1, gpu: 60 },
  { icao: "FPO", iata: "5O", operator: "EUROPE AIRPOST", wc: 1, agua: 1, gpu: 50 },
  { icao: "GER", iata: "ZQ", operator: "GERMAN AIRWAYS", wc: 0, agua: 0, gpu: 60 },
  { icao: "GJT", iata: "GW", operator: "GET JET", wc: 1, agua: 1, gpu: 60 },
  { icao: "GXL", iata: "XL", operator: "XL AIRWAYS GERMANY", wc: 1, agua: 1, gpu: 60 },
  { icao: "HFY", iata: "5K", operator: "HIFLY", wc: 1, agua: 1, gpu: 60 },
  { icao: "HLX", iata: "X3", operator: "TUI", wc: 0, agua: 0, gpu: 60 },
  { icao: "ICE", iata: "FI", operator: "ICELANDAIR", wc: 1, agua: 1, gpu: 60 },
  { icao: "JTG", iata: "JO", operator: "JET TIME", wc: 1, agua: 0, gpu: 60 },
  { icao: "JAF", iata: "TB", operator: "JETAIRFLY/TUI AIRLINE BELGIUM", wc: 0, agua: 0, gpu: 60 },
  { icao: "LGL", iata: "LG", operator: "LUXAIR", wc: 1, agua: 1, gpu: 60 },
  { icao: "NOZ", iata: "DY", operator: "NORWEGIAN AIR SHUTTLE, S.A.", wc: 0, agua: 0, gpu: 60 },
  { icao: "IBK", iata: "D8", operator: "NORWEGIAN INT.", wc: 0, agua: 0, gpu: 60 },
  { icao: "OBS", iata: "6O", operator: "ORBEST", wc: 1, agua: 1, gpu: 60 },
  { icao: "PVG", iata: "P6", operator: "PRIVILEDGE STYLE", wc: 1, agua: 1, gpu: 60 },
  { icao: "SAS", iata: "SK", operator: "SAS SCANDINAVIAN AIRLINES SYSTEM", wc: 1, agua: 1, gpu: 60 },
  { icao: "SQP", iata: "PQ", operator: "SKY UP", wc: 1, agua: 1, gpu: 60 },
  { icao: "SWR", iata: "LX", operator: "SWISS INTERNATIONAL AIRLINES", wc: 1, agua: 1, gpu: 60 },
  { icao: "TFL", iata: "OR", operator: "ARKEFLY (TUI AIRLINES NEDERLANDS B.V.)", wc: 0, agua: 0, gpu: 60 },
  { icao: "TOM", iata: "BY", operator: "THOMSONFLY LIMITED", wc: 0, agua: 0, gpu: 60 },
  { icao: "TRA", iata: "HV", operator: "TRANSAVIA", wc: 0, agua: 0, gpu: 40 },
  { icao: "TVF", iata: "TO", operator: "TRANSAVIA FRANCE", wc: 0, agua: 0, gpu: 0 },
  { icao: "TSC", iata: "TS", operator: "AIR TRANSAT", wc: 1, agua: 1, gpu: 75 },
  { icao: "VOE", iata: "V7", operator: "VOLOTEA", wc: 0, agua: 0, gpu: 60 },
  { icao: "WIZZ", iata: "W6", operator: "WIZZ AIR", wc: 0, agua: 0, gpu: 45 },
];

export const CompaniesRights: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterWc, setFilterWc] = useState(false);
  const [filterAgua, setFilterAgua] = useState(false);
  const [filterGpu, setFilterGpu] = useState(false);

  // Filtragem dinâmica
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.icao.toLowerCase().includes(search.toLowerCase()) ||
        c.iata.toLowerCase().includes(search.toLowerCase()) ||
        c.operator.toLowerCase().includes(search.toLowerCase());

      const matchesWc = !filterWc || c.wc > 0;
      const matchesAgua = !filterAgua || c.agua > 0;
      const matchesGpu = !filterGpu || c.gpu > 0;

      return matchesSearch && matchesWc && matchesAgua && matchesGpu;
    });
  }, [search, filterWc, filterAgua, filterGpu]);

  // Métricas rápidas
  const stats = useMemo(() => ({
    total: companies.length,
    wcCount: companies.filter((c) => c.wc > 0).length,
    aguaCount: companies.filter((c) => c.agua > 0).length,
    gpuCount: companies.filter((c) => c.gpu > 0).length,
  }), []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1.5, sm: 3 }, color: '#f8fafc', pb: 10 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AirlineIcon sx={{ color: '#38bdf8', fontSize: 30 }} /> Serviços Contratados por Companhia
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: 0.5 }}>
            ÚLTIMA ATUALIZAÇÃO: 17 FEB 2026
          </Typography>
        </Box>

        {/* Badges Estatísticos */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip label={`Total: ${stats.total}`} size="small" sx={{ bgcolor: '#334155', color: '#f8fafc', fontWeight: 'bold' }} />
          <Chip icon={<WcIcon style={{ color: '#facc15' }} />} label={`WC: ${stats.wcCount}`} size="small" sx={{ bgcolor: 'rgba(250, 204, 21, 0.15)', color: '#facc15', fontWeight: 'bold', border: '1px solid rgba(250, 204, 21, 0.3)' }} />
          <Chip icon={<WaterIcon style={{ color: '#38bdf8' }} />} label={`Água: ${stats.aguaCount}`} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 'bold', border: '1px solid rgba(56, 189, 248, 0.3)' }} />
          <Chip icon={<GpuIcon style={{ color: '#34d399' }} />} label={`GPU: ${stats.gpuCount}`} size="small" sx={{ bgcolor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 'bold', border: '1px solid rgba(52, 211, 153, 0.3)' }} />
        </Stack>
      </Box>

      {/* Alerta Operacional Relevante */}
      <Alert
        icon={<AlertIcon sx={{ color: '#38bdf8' }} />}
        severity="info"
        sx={{
          mb: 3,
          bgcolor: 'rgba(14, 165, 233, 0.1)',
          color: '#e0f2fe',
          border: '1px solid #0284c7',
          borderRadius: 2,
          fontWeight: 700,
          fontSize: '0.8125rem',
          letterSpacing: '0.5px'
        }}
      >
        NOTA OPERACIONAL: EFETUAR SEMPRE H2O ANTES DO WC
      </Alert>

      {/* Barra de Pesquisa e Filtros Rápido */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2.5, mb: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por ICAO, IATA ou Operador (ex: DLH, LH, Lufthansa)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <ClearIcon sx={{ color: '#64748b', fontSize: 18 }} />
                      </IconButton>
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
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
            >
              <Chip
                label="Apenas WC"
                onClick={() => setFilterWc(!filterWc)}
                color={filterWc ? 'warning' : 'default'}
                variant={filterWc ? 'filled' : 'outlined'}
                size="small"
                sx={{ cursor: 'pointer', fontWeight: 600, color: filterWc ? '#000' : '#94a3b8', borderColor: '#475569' }}
              />
              <Chip
                label="Apenas Água"
                onClick={() => setFilterAgua(!filterAgua)}
                color={filterAgua ? 'info' : 'default'}
                variant={filterAgua ? 'filled' : 'outlined'}
                size="small"
                sx={{ cursor: 'pointer', fontWeight: 600, color: filterAgua ? '#000' : '#94a3b8', borderColor: '#475569' }}
              />
              <Chip
                label="Com GPU"
                onClick={() => setFilterGpu(!filterGpu)}
                color={filterGpu ? 'success' : 'default'}
                variant={filterGpu ? 'filled' : 'outlined'}
                size="small"
                sx={{ cursor: 'pointer', fontWeight: 600, color: filterGpu ? '#000' : '#94a3b8', borderColor: '#475569' }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela de Dados Refatorada */}
      <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2.5, overflow: 'hidden' }}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: '#0f172a' }}>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.75rem', borderBottom: '1px solid #334155' }}>ICAO</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.75rem', borderBottom: '1px solid #334155' }}>IATA</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.75rem', borderBottom: '1px solid #334155' }}>OPERADOR</TableCell>
              <TableCell align="center" sx={{ color: '#facc15', fontWeight: 800, fontSize: '0.75rem', borderBottom: '1px solid #334155', bgcolor: 'rgba(250, 204, 21, 0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <WcIcon fontSize="small" /> WC
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.75rem', borderBottom: '1px solid #334155', bgcolor: 'rgba(56, 189, 248, 0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <WaterIcon fontSize="small" /> ÁGUA
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ color: '#34d399', fontWeight: 800, fontSize: '0.75rem', borderBottom: '1px solid #334155', bgcolor: 'rgba(52, 211, 153, 0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <GpuIcon fontSize="small" /> GPU
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((c, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell sx={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700, borderColor: '#334155' }}>
                    {c.icao}
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1', fontFamily: 'monospace', fontWeight: 700, borderColor: '#334155' }}>
                    {c.iata}
                  </TableCell>
                  <TableCell sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.8125rem', borderColor: '#334155' }}>
                    {c.operator}
                  </TableCell>

                  {/* WC Status */}
                  <TableCell align="center" sx={{ borderColor: '#334155', bgcolor: 'rgba(250, 204, 21, 0.02)' }}>
                    {c.wc > 0 ? (
                      <Chip label="INCLUÍDO" size="small" sx={{ bgcolor: 'rgba(250, 204, 21, 0.15)', color: '#facc15', fontWeight: 800, fontSize: '0.7rem' }} />
                    ) : (
                      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>—</Typography>
                    )}
                  </TableCell>

                  {/* Água Status */}
                  <TableCell align="center" sx={{ borderColor: '#334155', bgcolor: 'rgba(56, 189, 248, 0.02)' }}>
                    {c.agua > 0 ? (
                      <Chip label="INCLUÍDO" size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800, fontSize: '0.7rem' }} />
                    ) : (
                      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>—</Typography>
                    )}
                  </TableCell>

                  {/* GPU Status (Minutos ou Não Incluído) */}
                  <TableCell align="center" sx={{ borderColor: '#334155', bgcolor: 'rgba(52, 211, 153, 0.02)' }}>
                    {c.gpu > 0 ? (
                      <Chip
                        label={`${c.gpu} MIN`}
                        size="small"
                        sx={{ bgcolor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 800, fontSize: '0.7rem', fontFamily: 'monospace' }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#64748b', borderColor: '#334155' }}>
                  Nenhuma companhia encontrada com os termos/filtros aplicados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CompaniesRights;