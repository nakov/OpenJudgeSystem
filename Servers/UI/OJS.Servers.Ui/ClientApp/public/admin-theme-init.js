(function() {
    const darkBackgroundColor = "#212328";
    const lightBackgroundColor = "#ececec";
    try {
        const mode = localStorage.getItem("administrationMode");
        if (!mode || mode === "dark") {
            document.body.style.backgroundColor = darkBackgroundColor;
        } else {
            document.body.style.backgroundColor = lightBackgroundColor;
        }
    } catch (e) {
        console.error("Error applying theme for administration from localStorage:", e);
    }
})();
