const mapToggleBtn = document.getElementById("mapToggleBtn");
const mapSettings = document.getElementById("mapSettings");

mapToggleBtn.addEventListener("click", () => {
	mapSettings.classList.toggle("expanded");
});

const zoomSlider = document.getElementById('zoomSlider');
zoomSlider.value = map.getZoom();

zoomSlider.addEventListener('input', () => {
	map.setZoom(parseInt(zoomSlider.value));
});

map.on('zoomend', () => {
	zoomSlider.value = map.getZoom();
});