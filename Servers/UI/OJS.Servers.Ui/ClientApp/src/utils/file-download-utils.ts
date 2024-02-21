const downloadFile = (blob:Blob, filename: string) => {
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename;

    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
};
export default downloadFile;
