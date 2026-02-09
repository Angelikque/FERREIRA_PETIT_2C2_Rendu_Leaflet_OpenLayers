// CONFIGURATION DE LA CARTE 
// Chargement des fonds de carte issues de différents serveurs
const plan = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    attribution: '© OpenStreetMap', 
    maxZoom: 19 
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    attribution: '© Esri', 
    maxZoom: 19 
});

const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
    attribution: '© OpenStreetMap © CARTO', 
    subdomains: 'abcd', 
    maxZoom: 20 
});

// Définition de l'emprise de la carte (centrer sur la vue mondiale)
const map = L.map('map', { 
    center: [20, 0], 
    zoom: 2, 
    layers: [plan] 
});

// Création du contrôles de couches (possibilité de changer de fond de carte)
const baseMaps = { 
    "Plan OpenStreetMap": plan, 
    "Vue Satellite": satellite, 
    "Mode sombre": dark 
};

// Ajout de d'une échelle à la carte
L.control.scale({ 
    position: 'bottomleft', 
    metric: true, 
    imperial: false 
}).addTo(map);

// Gestion de la superposition des couches (Z-Index) pour que les pays restent sous les points
map.createPane('polygonsPane');
map.getPane('polygonsPane').style.zIndex = 200;


// GESTION DES COUCHES DE DONNÉES 
const polygonsLayer = L.layerGroup().addTo(map);
const pointsLayer = L.layerGroup().addTo(map);
const overlayMaps = { "Pays": polygonsLayer, "Deals": pointsLayer };

L.control.layers(baseMaps, overlayMaps).addTo(map);

// Chargement du GeoJSON des pays (polygone)
fetch('data/land_matrix_pays.geojson')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            pane: 'polygonsPane',
            // Style des polygones pays
            style: {
                color: "rgb(234, 234, 234)", 
                weight: 1, 
                fillColor: "#6c836e", 
                fillOpacity: 0.7 
            },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`<b>Pays :</b> ${feature.properties.name || "Inconnu"}`);
            }
        }).addTo(polygonsLayer);
    });

// Variable globale pour stocker les données et les filtrer 
let allDeals = [];

// Chargement du GeoJSON des deals (points)
fetch('data/land_matrix_agri.geojson')
    .then(res => res.json())
    .then(data => {
        allDeals = data.features;
        showDeals("all"); // Affichage par défaut au lancement
    });

// FONCTION D'AFFICHAGE ET FILTRAGE 
function showDeals(filter) {
    pointsLayer.clearLayers(); 

    // Filtrage selon le champs 'impact_environmental_degradation' pour se centrer qur l'aspect environnemental
    const filtered = filter === "impact" 
        ? allDeals.filter(f => f.properties.impact_environmental_degradation === true)
        : allDeals;

    L.geoJSON(filtered, {
        pointToLayer: (feature, latlng) => {
            // Définition de la couleur d'affichage selon le champs 'impact_environmental_degradation'
            const color = feature.properties.impact_environmental_degradation ? "rgb(6, 98, 25)" : "rgb(109, 12, 90)";
            
            return L.circleMarker(latlng, {
                radius: 6,
                fillColor: color,
                color: "white",
                weight: 1,
                fillOpacity: 0.9
            });
        },
        onEachFeature: (feature, layer) => {
            const props = feature.properties;
            
            // Création du contenu du popup
            let popupContent = `
                <strong>Pays :</strong> ${props.country || "Non renseigné"}<br>
                <strong>Type de récolte :</strong> ${props.crops || "Non renseigné"}<br>
                <strong>Surface :</strong> ${props.surface_ha || "N/A"} ha<br>
            `;

            // Ajout des autres impacts au popup pour les deals ayant des impacts environnementaux
            if (props.impact_environmental_degradation) {
                let otherImpacts = (props.negative_impacts_for_local_communities || "")
                    .split('|')
					// Filtre pour ne pas afficher 'environmental degradation' dans les autres types d'impacts
                    .filter(imp => imp.trim().toLowerCase() !== "environmental degradation")
                    .join(', ');
                
                popupContent += `<strong>Autres impacts :</strong> ${otherImpacts || "Aucun"}`;
            }
            
            layer.bindPopup(popupContent);
        }
    }).addTo(pointsLayer);
}

// INTERACTION & LÉGENDE 
// Lien pour le filtre des deals selon l'impact environnemental dans le menu déroulant
document.getElementById('dealFilter').addEventListener('change', e => {
    showDeals(e.target.value);
});

// Création de la légende 
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<i class="legend-impact"></i> Deals avec impact environnemental<br>';
    div.innerHTML += '<i class="legend-no-impact"></i> Deals sans impact environnemental';
    return div;
};

legend.addTo(map);