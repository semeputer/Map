const fileBtn = document.getElementById("fileBtn");
const filePanel = document.getElementById("filePanel");

fileBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent click from closing immediately
    filePanel.classList.toggle("show");  // toggle modern class
});

// Optional: click outside closes the panel
document.addEventListener("click", () => filePanel.classList.remove("show"));

// Stop panel click from closing itself
filePanel.addEventListener("click", (e) => e.stopPropagation());

const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");

importBtn.addEventListener("click", () => {
    fileInput.click();  // opens the file dialog
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    // Clear old markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const reader = new FileReader();

    if (fileName.endsWith(".csv")) {
        reader.onload = function(event) {
            const csvText = event.target.result;
            processCSV(csvText);
        };
        reader.readAsText(file);
    } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]; // first sheet
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            processExcelJSON(jsonData);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert("Unsupported file type! Please select CSV or Excel.");
    }

    // Close the file panel
    filePanel.classList.remove("show");
});

function processCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase()); // convert all to lowercase

    lines.slice(1).forEach(line => {
        const values = line.split(",");
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i]);

        // Use lowercase keys for latitude/lon
        const lat = parseFloat(obj['latitude']);   // works with LATITUDE, Latitude, latitude
        const lng = parseFloat(obj['longitude']);  // same here

        if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.circleMarker([lat, lng], {
                radius: 6,
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.85
            }).addTo(map);
            markers.push(marker);
        }
    });

    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
    }
}

function processExcelJSON(data) {
    data.forEach(point => {
        // Find latitude/lon keys (case-insensitive)
        const keys = Object.keys(point).map(k => k.toLowerCase());
        const latKey = keys.find(k => k.includes("lat"));
        const lngKey = keys.find(k => k.includes("lon") || k.includes("lng"));

        if (!latKey || !lngKey) return;

        const lat = parseFloat(point[Object.keys(point)[keys.indexOf(latKey)]]);
        const lng = parseFloat(point[Object.keys(point)[keys.indexOf(lngKey)]]);

        if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.circleMarker([lat, lng], {
                radius: 6,
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.85
            }).addTo(map);
            markers.push(marker);
        }
    });

    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
    }
}