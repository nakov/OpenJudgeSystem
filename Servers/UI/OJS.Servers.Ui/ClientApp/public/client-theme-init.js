(function() {
    try {
        const persistRoot = localStorage.getItem("persist:root");
        if (!persistRoot) {
            document.body.classList.add("body-dark-theme");
            return;
        }

        const persist = JSON.parse(persistRoot);

        if (!persist.theme) {
            document.body.classList.add("body-dark-theme");
            return;
        }

        const theme = JSON.parse(persist.theme);

        if (theme.mode === "dark") {
            document.body.classList.add("body-dark-theme");
            document.body.classList.remove("body-light-theme");
        } else {
            document.body.classList.add("body-light-theme");
            document.body.classList.remove("body-dark-theme");
        }
    } catch (e) {
        console.error("Error applying theme for client from localStorage:", e);
    }
})();
