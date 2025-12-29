import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const installPWA = () => {
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
    };

    return { supportsPWA, installPWA };
};

export default usePWAInstall;
