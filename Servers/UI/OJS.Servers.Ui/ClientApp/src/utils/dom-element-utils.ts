const getTotalHeight = (element: HTMLElement) => {
    const computedStyle = getComputedStyle(element);

    const marginTop = parseFloat(computedStyle.marginTop);
    const marginBottom = parseFloat(computedStyle.marginBottom);

    return element.offsetHeight + marginTop + marginBottom;
};

export default getTotalHeight;
