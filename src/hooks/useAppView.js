
    import { useState, useEffect } from 'react';

    export const useAppView = (loadingAuth, storageMode) => {
        const [selectedDate, setSelectedDate] = useState(() => {
            const today = new Date();
            return today.toISOString().split("T")[0];
        });

        const [selectedMonth, setSelectedMonth] = useState(() => {
            const today = new Date();
            return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
        });

        useEffect(() => {
            if (!loadingAuth && !storageMode) {
                setSelectedDate(new Date().toISOString().split("T")[0]);
                setSelectedMonth(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`);
            }
        }, [storageMode, loadingAuth]);

        return {
            selectedDate,
            setSelectedDate,
            selectedMonth,
            setSelectedMonth,
        };
    };
  