const mapTools = document.getElementById('mapTools');
const mapToolsBtn = document.getElementById('mapToolsBtn');
const addMarkerBtn = document.getElementById('addMarkerBtn');
const deleteMarkerBtn = document.getElementById('deleteMarkerBtn');

// ---- STATE FLAGS ----
let addMarkerMode = false;
let deleteMode = false;
let markerFormOpen = false;

// ---- PANEL TOGGLE ----
mapToolsBtn.addEventListener('click', () => {
	mapTools.classList.toggle('expanded');
});

// ---- ADD MARKER MODE ----
addMarkerBtn.addEventListener('click', () => {
	addMarkerMode = !addMarkerMode;
	addMarkerBtn.classList.toggle('active', addMarkerMode);

	// Turn off delete mode if active
	if (addMarkerMode && deleteMode) {
		deleteMode = false;
		deleteMarkerBtn.classList.remove('active');
	}
});

// ---- DELETE MARKER MODE ----
deleteMarkerBtn.addEventListener('click', () => {
	deleteMode = !deleteMode;
	deleteMarkerBtn.classList.toggle('active', deleteMode);

	if (deleteMode) {
		deleteMarkerBtn.title = "Click markers to delete";
	} else {
		deleteMarkerBtn.title = "Delete Marker";
	}

	// Turn off add marker mode if active
	if (deleteMode && addMarkerMode) {
		addMarkerMode = false;
		addMarkerBtn.classList.remove('active');
	}
});

// ---- MAP CLICK HANDLER (ADD MARKER) ----
map.on('click', function (e) {
	if (!addMarkerMode || markerFormOpen) return;

	markerFormOpen = true;

	const { lat, lng } = e.latlng;

	const formHtml = `
		<div class="marker-form">
			<h4>Add Marker</h4>

			<label>Ctrl#</label>
			<input id="mf-ctrl" type="text">

			<label>Pole#</label>
			<input id="mf-pole" type="text">

			<label>Street Name</label>
			<input id="mf-street" type="text">

			<label>Comments</label>
			<input id="mf-comments" type="text">

			<div class="actions">
				<button class="cancel-btn" id="mf-cancel">Cancel</button>
				<button class="ok-btn" id="mf-ok">OK</button>
			</div>
		</div>
	`;

	const tempPopup = L.popup({ closeOnClick: false })
		.setLatLng([lat, lng])
		.setContent(formHtml)
		.openOn(map);

	// Wait for DOM to render
	setTimeout(() => {

		// OK BUTTON
		document.getElementById('mf-ok').onclick = () => {
			const ctrl = document.getElementById('mf-ctrl').value.trim();
			const pole = document.getElementById('mf-pole').value.trim();
			const street = document.getElementById('mf-street').value.trim();
			const comments = document.getElementById('mf-comments').value.trim();

			// Minimal validation
			if (!ctrl && !pole) {
				alert("Please enter Ctrl# or Pole#");
				return;
			}

			const popupContent = `
				<strong>Ctrl#:</strong> ${ctrl || '—'}<br>
				<strong>Pole#:</strong> ${pole || '—'}<br>
				<strong>Street:</strong> ${street || '—'}<br>
				<strong>Comments:</strong> ${comments || '—'}<br>
				<em>${lat.toFixed(5)}, ${lng.toFixed(5)}</em>
			`;

			map.closePopup();
			markerFormOpen = false;

			const marker = addCustomMarker(lat, lng, popupContent);
			marker.myData = { ctrl, pole, street, comments, lat, lng };
			marker.openPopup();

			// Auto-exit add mode (UX win)
			//addMarkerMode = false;
			//addMarkerBtn.classList.remove('active');
		};

		// CANCEL BUTTON
		document.getElementById('mf-cancel').onclick = () => {
			map.closePopup();
			markerFormOpen = false;
		};

	}, 0);
});

// ---- MAKE MARKER DELETABLE ----
function makeMarkerDeletable(marker) {
	marker.on('click', () => {
		if (deleteMode) {
			map.removeLayer(marker);
			markers = markers.filter(m => m !== marker);
		}
	});
}

// ---- ADD CUSTOM MARKER ----
function addCustomMarker(lat, lng, popupContent) {
	const marker = L.marker([lat, lng], { draggable: true })
		.addTo(map)
		.bindPopup(popupContent || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);

	markers.push(marker);
	makeMarkerDeletable(marker);

	return marker;
}