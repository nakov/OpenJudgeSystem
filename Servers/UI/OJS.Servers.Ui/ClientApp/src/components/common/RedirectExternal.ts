import { useEffect } from 'react';

const RedirectExternal = (path: string) => {
    useEffect(() => {
        window.location.href = path;
    });

    return null;
};

export default RedirectExternal;
