(function() {
    try {
        const mode = localStorage.getItem("administrationMode");
        if (!mode) {
            document.body.classList.add("body-dark-theme");
            return;
        }

        if (mode === "dark") {
            document.body.classList.add("body-dark-theme");
            document.body.classList.remove("body-light-theme");
        } else {
            document.body.classList.add("body-light-theme");
            document.body.classList.remove("body-dark-theme");
        }
    } catch (e) {
        console.error("Error applying theme for administration from localStorage:", e);
    }
})();
