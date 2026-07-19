/* ===========================================================
   INTERACTIVE STUDY AREA MAP
   Gilgit District Boundary — Leaflet + OpenStreetMap (free, no API key)
=========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const mapEl = document.getElementById("interactive-map");
    if (!mapEl) return;

    // Centered roughly on Gilgit District centroid
    const gilgitCenter = [35.963, 74.386];

    const studyMap = L.map("interactive-map", {
        center: gilgitCenter,
        zoom: 9,
        scrollWheelZoom: true,
    });

    // Terrain-style basemap (free, no key)
    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            '<a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; ' +
            '<a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
        maxZoom: 17,
    }).addTo(studyMap);

    const defaultStyle = {
        fillColor: "#00b050",
        fillOpacity: 0.15,
        color: "#ff3b30",
        weight: 3,
    };

    const hoverStyle = {
        fillColor: "#00b050",
        fillOpacity: 0.3,
        color: "#ff3b30",
        weight: 3,
    };

    // Load the Gilgit District boundary from GeoJSON
    fetch("data/gilgit_boundary.geojson")
        .then((res) => res.json())
        .then((geojsonData) => {
            const boundaryLayer = L.geoJSON(geojsonData, {
                style: defaultStyle,
                onEachFeature: (feature, layer) => {
                    const district = feature.properties.DISTRICT || "Gilgit";
                    const province = feature.properties.PROVINCE || "Gilgit-Baltistan";

                    const content = `
                        <div style="font-family:'Poppins',sans-serif;max-width:240px;">
                            <h3 style="margin:0 0 6px;color:#00b050;">${district} District</h3>
                            <p style="margin:0 0 4px;font-size:14px;color:#333;">${province}</p>
                            <p style="margin:0;font-size:13px;color:#555;">
                                Study period: 2017–2024<br>
                                Elevation range: 1,213 – 7,647 m<br>
                                Area: ~4,208 km²
                            </p>
                        </div>
                    `;

                    layer.bindPopup(content);

                    layer.on("mouseover", () => layer.setStyle(hoverStyle));
                    layer.on("mouseout", () => layer.setStyle(defaultStyle));
                },
            }).addTo(studyMap);

            // Fit map bounds to the boundary once it loads
            studyMap.fitBounds(boundaryLayer.getBounds());
        })
        .catch((err) => {
            console.error("Failed to load boundary GeoJSON:", err);
        });
});
