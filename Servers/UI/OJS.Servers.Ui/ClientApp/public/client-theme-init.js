(function() {
    const darkBackgroundColor = "#212328";
    const lightBackgroundColor = "#f8f8f8";
    try {
        const persistRoot = localStorage.getItem("persist:root");
        if (!persistRoot) {
            document.body.style.backgroundColor = darkBackgroundColor;
            return;
        }

        const persist = JSON.parse(persistRoot);

        if (!persist.theme) {
            document.body.style.backgroundColor = darkBackgroundColor;
            return;
        }

        const theme = JSON.parse(persist.theme);

        if (theme.mode === "dark") {
            document.body.style.backgroundColor = darkBackgroundColor;
        } else {
            document.body.style.backgroundColor = lightBackgroundColor;
        }
    } catch (e) {
        console.error("Error applying theme for client from localStorage:", e);
    }
})();
