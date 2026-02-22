function parseCSVFromBase64(encoded) {
	const decoded = atob(encoded);
	const lines = decoded.trim().split('\n');
	const headers = lines[0].split(',');

	return lines.slice(1).map(line => {
		const values = line.split(',');
		const obj = {};

		headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());

		return {
			...obj,
			lat: parseFloat(obj.Latitude),
			lng: parseFloat(obj.Longitude),
			utilization: parseFloat(obj.Utilization)
		};
	});
}

csvData = parseCSVFromBase64(encodedData);
findNearby();