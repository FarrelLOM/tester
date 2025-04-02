let map, userPositionMarker;
let labelsVisible = true; // Untuk fitur "Detail"

// Daftar gaya peta yang sesuai dengan Microsoft Azure Maps
const mapStyles = {
    road: "road",
    satellite: "satellite",
    night: "night",
    grayscale: "grayscale_light"
};

function initMap() {
    map = new atlas.Map("map", {
        center: [106.8272, -6.1751], // Lokasi awal (Jakarta)
        zoom: 12,
        style: mapStyles.road, // Default: Jalan
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: '4i0e6UnHavG8777vBsyY3LujOC9XVRArXmxpKyk6JJrzYoP47nJtJQQJ99BCACYeBjFwNasMAAAgAZMP3rmN' // Ganti dengan API Key Anda
        }
    });

    map.events.add('ready', function () {
        // Tambahkan kontrol zoom dan kompas
        map.controls.add([new atlas.control.ZoomControl(), new atlas.control.CompassControl()], {
            position: "top-right"
        });
    });

    // Tambahkan event listener ke tombol-tombol
    document.getElementById("btn-road").addEventListener("click", () => changeMapStyle(mapStyles.road));
    document.getElementById("btn-satellite").addEventListener("click", () => changeMapStyle(mapStyles.satellite));
    document.getElementById("btn-night").addEventListener("click", () => changeMapStyle(mapStyles.night));
    document.getElementById("btn-grayscale").addEventListener("click", () => changeMapStyle(mapStyles.grayscale));
    document.getElementById("btn-detail").addEventListener("click", toggleLabels);
    document.getElementById("btn-findme").addEventListener("click", findMe);
}

function changeMapStyle(style) {
    map.setStyle(style);
}

// Toggle label detail seperti nama jalan, gedung, dll
function toggleLabels() {
    labelsVisible = !labelsVisible;
    let newStyle = labelsVisible ? map.getStyle() + "_labels" : map.getStyle().replace("_labels", "");
    map.setStyle(newStyle);
}

function findMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let userLocation = [position.coords.longitude, position.coords.latitude];

            if (userPositionMarker) {
                userPositionMarker.setOptions({ position: userLocation });
            } else {
                userPositionMarker = new atlas.HtmlMarker({
                    position: userLocation,
                    color: 'red',
                    text: '📍'
                });
                map.markers.add(userPositionMarker);
            }

            map.setCamera({
                center: userLocation,
                zoom: 15
            });

        }, function (error) {
            alert("Gagal mendapatkan lokasi: " + error.message);
        });
    } else {
        alert("Geolocation tidak didukung oleh browser Anda.");
    }
}

window.onload = initMap;