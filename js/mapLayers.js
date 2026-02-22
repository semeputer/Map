const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
const noMapLayer = L.layerGroup();

document.getElementById("streetBtn").onclick = () => {
  map.eachLayer(l => map.removeLayer(l));
  streetLayer.addTo(map);
};

document.getElementById("noneBtn").onclick = () => {
  map.eachLayer(l => map.removeLayer(l));
  noMapLayer.addTo(map);
};

L.control.locate({ position: 'bottomright' }).addTo(map);