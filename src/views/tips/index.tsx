import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import {
  Balance as CgIcon,
  FlightTakeoff as AirlineIcon,
  MenuBook as InfoIcon,
  WarningAmber as WarningIcon,
  Radio as RadioIcon,
  Flight as FlightIcon,
  Description as DocIcon
} from '@mui/icons-material';

export const Tips: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 1.5, sm: 3 }, color: '#f8fafc', pb: 10 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
          <InfoIcon sx={{ color: '#38bdf8', fontSize: 32 }} /> Dicas Operacionais & Referências
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          Guia rápido de centro de gravidade, códigos IATA/ICAO e particularidades de companhias
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 1. CG Comportamento */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 3,
              height: '100%'
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'center' }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'flex' }}>
                <CgIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                CG Comportamento das Aeronaves
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Box sx={{ p: 1.5, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                  B737
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  Dianteiro <Typography component="span" sx={{ color: '#fb923c', fontWeight: 600, fontSize: '0.8rem', ml: 0.5 }}>(Cuidado Aft)</Typography>
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                  A320
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  Neutro / Flexível
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 2, border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 800, color: '#f87171', fontFamily: 'monospace' }}>
                  A321
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <WarningIcon sx={{ color: '#f87171', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#f87171', fontWeight: 700 }}>
                    Sensível: Distribuir Holds
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* 2. Significados IATA / ICAO */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 3,
              height: '100%'
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'center' }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#facc15', display: 'flex' }}>
                <InfoIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                Padrões e Designações
              </Typography>
            </Stack>

            <Stack spacing={2}>
              {/* IATA */}
              <Box sx={{ p: 1.5, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155' }}>
                <Stack direction="row" sx={{ mb: 0.5, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#facc15' }}>
                    IATA (2 letras + Nº Voo)
                  </Typography>
                  <Chip label="Comercial" size="small" sx={{ bgcolor: 'rgba(250, 204, 21, 0.15)', color: '#facc15', fontWeight: 700, fontSize: '0.65rem' }} />
                </Stack>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  Exemplos: <Typography component="span" sx={{ fontFamily: 'monospace', color: '#e2e8f0' }}>HV1234, U21234, D81234</Typography>
                </Typography>
              </Box>

              {/* ICAO */}
              <Box sx={{ p: 1.5, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155' }}>
                <Stack direction="row" sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#facc15' }}>
                    ICAO (3 letras)
                  </Typography>
                  <Chip label="Operacional" size="small" sx={{ bgcolor: 'rgba(250, 204, 21, 0.15)', color: '#facc15', fontWeight: 700, fontSize: '0.65rem' }} />
                </Stack>

                <Grid container spacing={1}>
                  <Grid size={4}>
                    <Box sx={{ p: 1, bgcolor: '#1e293b', borderRadius: 1.5, textAlign: 'center' }}>
                      <RadioIcon sx={{ color: '#facc15', fontSize: 18, mb: 0.2 }} />
                      <Typography variant="caption" sx={{ display: 'block', color: '#cbd5e1', fontWeight: 600 }}>
                        ATC (Rádio)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Box sx={{ p: 1, bgcolor: '#1e293b', borderRadius: 1.5, textAlign: 'center' }}>
                      <DocIcon sx={{ color: '#facc15', fontSize: 18, mb: 0.2 }} />
                      <Typography variant="caption" sx={{ display: 'block', color: '#cbd5e1', fontWeight: 600 }}>
                        Plano de Voo
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Box sx={{ p: 1, bgcolor: '#1e293b', borderRadius: 1.5, textAlign: 'center' }}>
                      <FlightIcon sx={{ color: '#facc15', fontSize: 18, mb: 0.2 }} />
                      <Typography variant="caption" sx={{ display: 'block', color: '#cbd5e1', fontWeight: 600 }}>
                        Callsign
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* 3. Dicas Companhias */}
        <Grid size={12}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 3
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, alignItems: 'center' }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', display: 'flex' }}>
                <AirlineIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                Distinção de Companhias e Prefixos
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {/* Transavia */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f87171', mb: 1 }}>
                    Transavia
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label="HV" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 800, fontFamily: 'monospace' }} />
                      <Typography variant="caption" sx={{ color: '#cbd5e1' }}>Holanda <b>(TRA)</b></Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label="TO" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 800, fontFamily: 'monospace' }} />
                      <Typography variant="caption" sx={{ color: '#cbd5e1' }}>França <b>(TVF)</b></Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* EasyJet */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fb923c', mb: 1 }}>
                    easyJet
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label="U2" size="small" sx={{ bgcolor: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', fontWeight: 800, fontFamily: 'monospace' }} />
                      <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>IATA Sempre U2</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5, lineHeight: 1.3 }}>
                      <b>ICAO varia:</b> EZY / EJU / EZS conforme o certificado de operador.
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Norwegian */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f87171', mb: 1 }}>
                    Norwegian
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label="DY" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 800, fontFamily: 'monospace' }} />
                      <Typography variant="caption" sx={{ color: '#cbd5e1' }}>Noruega <b>(NAX)</b></Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label="D8" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 800, fontFamily: 'monospace' }} />
                      <Typography variant="caption" sx={{ color: '#cbd5e1' }}>Suécia <b>(NSZ)</b></Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Eurowings */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2, bgcolor: '#0f172a', borderRadius: 2, border: '1px solid #334155', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#c084fc', mb: 1 }}>
                    Eurowings
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label="EW" size="small" sx={{ bgcolor: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', fontWeight: 800, fontFamily: 'monospace' }} />
                      <Typography variant="caption" sx={{ color: '#cbd5e1' }}>Alemanha <b>(EWG)</b></Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Tips;