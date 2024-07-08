import { useEffect } from 'react';

const useDisableMouseWheelOnNumberInputs = () => {
    useEffect(() => {
        const handleWheel = (event: any) => {
            if (event.target.type === 'number') {
                event.preventDefault();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);
};

export default useDisableMouseWheelOnNumberInputs;
