function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  return R * 2 * Math.atan2(
    Math.sqrt(Math.sin(dLat/2)**2),
    Math.sqrt(1 - Math.sin(dLat/2)**2)
  );
}

function findNearby() {
		  const input = document.getElementById("userCoord").value.trim();
		  const parts = input.split(",");
		  if (parts.length !== 2) return;

		  const userLat = parseFloat(parts[0]);
		  const userLng = parseFloat(parts[1]);
		  if (isNaN(userLat) || isNaN(userLng)) return;

		  const selected = Array.from(document.querySelectorAll('.utilFilter:checked')).map(cb => cb.value);

		  markers.forEach(m => map.removeLayer(m));
		  markers = [];
		  if (userMarker) map.removeLayer(userMarker);

		  userMarker = L.marker([userLat, userLng], { draggable: true }).addTo(map).bindPopup("You are here").openPopup();
		  userMarker.on("dragend", () => {
			const { lat, lng } = userMarker.getLatLng();
			document.getElementById("userCoord").value = `${lat.toFixed(5)},${lng.toFixed(5)}`;
			findNearby();
		  });

		  map.setView([userLat, userLng], 18);

		  csvData.forEach(point => {
			if (isNaN(point.lat) || isNaN(point.lng) || isNaN(point.utilization)) return;
			const dist = haversine(userLat, userLng, point.lat, point.lng);
			const category = getUtilCategory(point.utilization);
			if (dist <= 0.5 && selected.includes(category)) {
			  const color = getColor(point.utilization);
			  const popupHtml = `
				<strong>${point.Node || 'Unknown'}</strong><br>
				City: ${point.City || '—'}<br>
				Equipped: ${point.Equipped || '—'}<br>
				Working: ${point.Working || '—'}<br>
				Available: ${point.Available || '—'}<br>
				Utilization: ${point.utilization.toFixed(0)}%<br>
				${dist.toFixed(3)} km<br>
				<a href="https://www.google.com/maps/dir/${userLat},${userLng}/${point.lat},${point.lng}" target="_blank">Get Directions</a>
			  `;
			  const marker = L.circleMarker([point.lat, point.lng], {
				radius: 6,
				color: color,
				fillColor: color,
				fillOpacity: 0.85
			  }).addTo(map).bindPopup(popupHtml);
			  markers.push(marker);
			}
		  });
		}