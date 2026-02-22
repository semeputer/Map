function toggleUtil() {
		  document.getElementById("utilOptions").classList.toggle("hidden");
		  document.getElementById("utilArrow").classList.toggle("fa-chevron-down");
		  document.getElementById("utilArrow").classList.toggle("fa-chevron-up");
		}

		document.querySelectorAll('.utilFilter').forEach(cb => {
		  cb.addEventListener('change', findNearby);
		});

		document.getElementById("searchBtn").addEventListener("click", findNearby);

		function getUtilCategory(util) {
		  if (util <= 50) return 'low';
		  if (util <= 74) return 'mid';
		  return 'high';
		}

		function getColor(util) {
		  if (util <= 50) return 'green';
		  if (util <= 74) return 'yellow';
		  return 'red';
		}