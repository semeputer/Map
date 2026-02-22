document.getElementById("exportBtn").addEventListener("click", () => {
    // Filter only markers with stored data
    const exportable = markers.filter(m => m.myData);

    if (exportable.length === 0) {
        alert("No custom markers with data to export.");
        return;
    }

    let filename = prompt("Enter filename for export:", "custom_markers");
    if (!filename) return;

    if (!filename.toLowerCase().endsWith(".csv")) {
        filename += ".csv";
    }

    // CSV header
    let csvContent =
        "Ctrl#,Pole#,Street Name,Comments,Latitude,Longitude\n";

    exportable.forEach(marker => {
        const d = marker.myData;

        const row = [
            d.ctrl || "",
            d.pole || "",
            d.street || "",
            d.comments || "",
            d.lat,
            d.lng
        ]
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");

        csvContent += row + "\n";
    });

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});