import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // Inicializa o estado buscando no localStorage primeiro
    const [state, setState] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Erro ao ler o localStorage:", error);
            return initialValue;
        }
    });

    // Atualiza o localStorage sempre que o estado mudar
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
        }
    }, [key, state]);

    return [state, setState] as const;
}