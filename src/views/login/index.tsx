
import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    CssBaseline,
    Alert,
    AppBar,
    Toolbar
} from '@mui/material';
import Footer from '../../components/customFooter';

// Configurações de Acesso
const VALID_USER = "biybs";
const VALID_PASS = "Qml5YnM0U29sYXIjd2luZA==";
const EXPIRATION_TIME_MS = 60 * 60 * 1000; // 1 hora de validade

interface AuthWrapperProps {
    children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const authData = localStorage.getItem("dh-auth-data");

        if (authData) {
            const { user, expiresAt } = JSON.parse(authData);

            if (user === VALID_USER && Date.now() < expiresAt) {
                setIsAuthenticated(true);
                return;
            }

            localStorage.removeItem("dh-auth-data");
        }

        setIsAuthenticated(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === VALID_USER && password === atob(VALID_PASS)) {
            const expiresAt = Date.now() + EXPIRATION_TIME_MS;
            localStorage.setItem("dh-auth-data", JSON.stringify({ user: VALID_USER, expiresAt }));
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Usuário ou senha incorretos.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("dh-auth-data");
        setIsAuthenticated(false);
        setUsername("");
        setPassword("");
    };

    if (isAuthenticated === null) return null;

    // Interface após o login com tema escuro no fundo e na navbar
    if (isAuthenticated) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#212020', color: '#f8fafc' }}>
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#1e293b', borderBottom: '1px solid #334155' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#38bdf8' }}>
                            The Dispatcher Helper
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLogout}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Encerrar Sessão
                        </Button>
                    </Toolbar>
                </AppBar>

                {/* O seu aplicativo (Loads) é renderizado aqui */}
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>

                <Footer />
            </Box>
        );
    }

   

    // Tela de Login (Fundo Dark + Card Branco)
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0f172a', // Fundo escuro ao redor do card
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        borderRadius: 3,
                        bgcolor: '#ffffff', // Card mantido totalmente branco
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            mb: 0.5,
                            fontWeight: '800',
                            textAlign: 'center',
                            letterSpacing: '-0.5px',
                            color: '#0284c7'
                        }}
                    >
                        The Dispatcher Helper
                    </Typography>

                    {/* Texto com alto contraste e legibilidade ajustada */}
                    <Typography
                        component="h2"
                        variant="body2"
                        sx={{ mb: 3, color: '#475569', fontWeight: 600 }}
                    >
                        Controle de Acesso
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Usuário"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disableElevation
                            sx={{
                                mt: 3,
                                mb: 1,
                                py: 1.5,
                                fontWeight: 'bold',
                                borderRadius: 2,
                                bgcolor: '#0284c7',
                                '&:hover': {
                                    bgcolor: '#0369a1'
                                }
                            }}
                        >
                            Acessar Sistema
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}