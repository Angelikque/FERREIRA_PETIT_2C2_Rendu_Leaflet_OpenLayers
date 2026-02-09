import ImageWMS from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';
import XYZ from 'ol/source/XYZ';
import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector';
import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style';
import { Polygon } from 'ol/geom';
import ScaleLine from 'ol/control/ScaleLine.js';

//// Défintion des fonds de carte

// Mode Sombre
const couche_dark = new TileLayer({
  source: new XYZ({
    url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    attributions: '© CARTO'
  }),
  visible: true, // Défini ce fond carte comme automatique affiché
  title: 'dark'
});

// Plan OpenStreetMap
const couche_osm = new TileLayer({
  source: new OSM(),
  visible: false,
  title: 'osm'
});

// Vue Satellite
const couche_satellite = new TileLayer({
  source: new XYZ({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles © Esri'
  }),
  visible: false,
  title: 'satellite'
});

//// Fonction permettant d'afficher et de désafficher les fonds de carte

function setBaseLayer(layerName) {
  couche_osm.setVisible(layerName === 'osm');
  couche_satellite.setVisible(layerName === 'satellite');
  couche_dark.setVisible(layerName === 'dark');
}

document.getElementById('bm-osm').addEventListener('change', () => {
  setBaseLayer('osm');
});

document.getElementById('bm-sat').addEventListener('change', () => {
  setBaseLayer('satellite');
});

document.getElementById('bm-dark').addEventListener('change', () => {
  setBaseLayer('dark');
});

// Défintion de la couche Pays - Polygone

const paysSource = new ImageWMS({
  url: 'http://localhost:8080/geoserver/land_matrix_agri/wms?service=WMS&version=1.1.0&request=GetMap&layers=land_matrix_agri%3Alimit_pays_2&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers',
  params: { 'LAYERS' : 'land_matrix_agri:limit_pays_2'},
  serverType: 'geoserver',
 });
 
 const paysLayer = new ImageLayer({
  source: paysSource,
 });
 
//// Défintion de la couche Deals - Points

const dealsSource = new ImageWMS({
  url: 'http://localhost:8080/geoserver/land_matrix_agri/wms?service=WMS&version=1.1.0&request=GetMap&layers=land_matrix_agri%3Adeals&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers',
  params: { 'LAYERS' : 'land_matrix_agri:deals'},
  serverType: 'geoserver',
 });
 
 const dealsLayer = new ImageLayer({
  source: dealsSource,
 });

//// Création des checkbox pour afficher ou non les différentes couches

const checkboxCountries = document.getElementById('checkbox-countries');

checkboxCountries.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    paysLayer.setVisible(true);
  } else {
    paysLayer.setVisible(false);
  }
});

const checkboxDeals = document.getElementById('checkbox-deals');

checkboxDeals.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    dealsLayer.setVisible(true);
  } else {
    dealsLayer.setVisible(false);
  }
});

//// Ajout des boutons pour Dégradation environnementale ou non

const impactAll = document.getElementById('impact-all');
const impactYes = document.getElementById('impact-yes');
const impactNo = document.getElementById('impact-no');

impactAll.addEventListener('change', () => {
  if (impactAll.checked) {
    dealsSource.updateParams({ CQL_FILTER: null });
  }
});

impactYes.addEventListener('change', () => {
  if (impactYes.checked) {
    dealsSource.updateParams({ CQL_FILTER: 'impact_environmental_degradation = true' });
  }
});

impactNo.addEventListener('change', () => {
  if (impactNo.checked) {
    dealsSource.updateParams({ CQL_FILTER: 'impact_environmental_degradation = false' });
  }
});

//// Création de la barre d'échelle
const scaleline = new ScaleLine({target:'scale'});

//// Création de la carte
const map = new Map({
  controls: [scaleline],
  target: 'map',
  layers: [
    couche_osm,
    couche_satellite,
    couche_dark,
    paysLayer,
    dealsLayer,
  ],  
  view: new View({
    center: [0, 0],
    zoom: 2,
    projection: 'EPSG:3857',
  }),
});

//// Création du click sur un point pour afficher les informations de ce point

// Interrogation de la couche deals et affichage des résultats
map.on('singleclick', (event) => {
  const coord = event.coordinate;
  const res = map.getView().getResolution();
  const proj = 'EPSG:3857';
  const parametres = { 'INFO_FORMAT': 'application/json' };
  const url = dealsSource.getFeatureInfoUrl(coord, res, proj, parametres);

  if (url) {
    fetch(url)
      .then((response) => response.text())
      .then((json) => {
        const obj = JSON.parse(json);
        if (obj.features[0]) {
          console.log("J’ai cliqué sur une feature !");
          const properties = obj.features[0].properties;
          console.log(properties);
          // Ce que l'on affiche dans la table d'informations
          document.getElementById('table-country').innerHTML = properties.country;
          document.getElementById('table-type-recolte').innerHTML = properties.crops;
          document.getElementById('table-date-creation').innerHTML = properties.created_at;
          document.getElementById('table-surface-exploit').innerHTML = properties.surface_ha;
          document.getElementById('table-impact-env').innerHTML = properties.negative_impacts_for_local_communities;
        } else {
          console.log("J’ai cliqué à côté…");
          // Si aucun clique, alors table vide affichant "..." dans chaque attribut / colonne
          document.getElementById('table-country').innerHTML = "";
          document.getElementById('table-type-recolte').innerHTML = "";
          document.getElementById('table-date-creation').innerHTML = "";
          document.getElementById('table-surface-exploit').innerHTML = "";
          document.getElementById('table-impact-env').innerHTML = "";
        }
      });
  }
});
