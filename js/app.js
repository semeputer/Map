let map = L.map('map', { zoomControl: false })
  .setView([14.6188, 121.0829], 16);

let markers = [];
let userMarker;
let csvData = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);