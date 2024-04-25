export const mapPage = () => {
    // Function to toggle map visibility
    function toggleMapVisibility() {
        const mapContainer = document.getElementById('map');
        const currentLocationBtn = document.getElementById('currentLocationBtn');
    
        // Toggle map visibility
        mapContainer.style.display = mapContainer.style.display === 'none' ? 'block' : 'none';
    
        // Change button text based on map visibility
        if (mapContainer.style.display === 'block') {
            currentLocationBtn.textContent = 'Kort';
            initializeMap(); // Assuming initializeMap function is defined elsewhere
        } else {
            currentLocationBtn.textContent = 'Aalborg';
        }
    }

    // Event listener to show the map when the map icon in the footer is clicked
    document.querySelector('.map-icon').addEventListener('click', toggleMapVisibility);

    // Hide the map initially
    toggleMapVisibility();

    // Your existing map initialization code
    const map = L.map('map').setView([51.505, -0.09], 13);
    let selectedMarker = null;

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to add marker for the current location
    function addCurrentLocationMarker() {
        navigator.geolocation.getCurrentPosition(function(position) {
            const currentLatLng = [position.coords.latitude, position.coords.longitude];
            L.marker(currentLatLng).addTo(map)
                .bindPopup('Current Location')
                .openPopup();

            // Save current location to local storage
            localStorage.setItem('currentLocation', JSON.stringify(currentLatLng));
        });
    }

    // Function to load saved positions from local storage and display them as pins on the map
    function loadSavedPositions() {
        const savedPositions = JSON.parse(localStorage.getItem('savedPositions'));
        if (savedPositions) {
            savedPositions.forEach(position => {
                L.marker(position).addTo(map)
                    .bindPopup('Saved Position')
                    .openPopup()
                    .on('mouseover', function() {
                        // Add a delete button when hovering over the pin
                        const deleteBtn = document.createElement('button');
                        deleteBtn.innerText = 'Delete';
                        deleteBtn.addEventListener('click', function() {
                            // Remove the pin from the map and from local storage
                            map.removeLayer(this);
                            const updatedPositions = savedPositions.filter(savedPos => savedPos !== position);
                            localStorage.setItem('savedPositions', JSON.stringify(updatedPositions));
                        });
                        this.bindPopup(deleteBtn).openPopup();
                    });
            });
        }
    }

    // Function to add marker for the selected location and update dropdown menu
    
    function addSelectedLocationMarker() {
        map.on('click', function(e) {
            const selectedLatLng = e.latlng;
            const newMarker = L.marker(selectedLatLng, { icon: redIcon }).addTo(map) // Change marker color to red
                .bindPopup('Selected Location')
                .openPopup();
    
            // Reverse geocoding to fetch address information
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${selectedLatLng.lat}&lon=${selectedLatLng.lng}`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name;
                    
                    // Update the dropdown menu with the selected location address
                    const locationDropdown = document.getElementById('locationDropdown');
                    const newOption = document.createElement('option');
                    newOption.textContent = address;
                    locationDropdown.appendChild(newOption);
                })
                .catch(error => {
                    console.error('Error fetching address:', error);
                });
    
            // Add event listener to the marker for deletion
            newMarker.on('click', function() {
                const confirmDialog = document.getElementById('deleteMarkerDialog');
                confirmDialog.showModal();
    
                const confirmButton = document.getElementById('confirmDelete');
                confirmButton.onclick = function() {
                    map.removeLayer(newMarker);
                    confirmDialog.close();
                };
    
                const cancelButton = document.getElementById('cancelDelete');
                cancelButton.onclick = function() {
                    confirmDialog.close();
                    newMarker.removeEventListener('click', onClick);
                };
    
                function onClick(event) {
                    event.stopPropagation();
                    confirmDialog.showModal();
                }
            });
        });
    }
    
    // Call the functions to add markers when the page loads
    addCurrentLocationMarker();
    loadSavedPositions();
    addSelectedLocationMarker();

    
    // Event listener to remove the selected location marker when the dropdown option is selected
    document.getElementById('locationDropdown').addEventListener('change', function() {
        removeSelectedLocationMarker();
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const dropdown = document.querySelector('.dropdown');
        const dropdownContent = document.querySelector('.dropdown-content');
    
        dropdown.addEventListener('click', function() {
            dropdown.classList.toggle('open');
        });
    });
    
    // Define a red icon for the selected location marker
    const redIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    });

};
