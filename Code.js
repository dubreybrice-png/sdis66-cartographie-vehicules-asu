/**
 * SDIS 66 — Cartographie Véhicules et ASU
 * Point d'entrée principal — Menu, doGet, fonctions serveur
 */

var SS_PROP_KEY = 'cartographie_ss_id';

/**
 * Récupère le spreadsheet lié (bound) ou stocké en properties (standalone)
 */
function getSS_() {
  // 1. Essayer bound spreadsheet
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch(e) {}
  
  // 2. Essayer depuis PropertiesService
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty(SS_PROP_KEY);
  if (ssId) {
    try { return SpreadsheetApp.openById(ssId); } catch(e) {}
  }
  
  return null;
}

/* ═══════════════════════════════════════════════════════
   WEBAPP
   ═══════════════════════════════════════════════════════ */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('SDIS 66 — Cartographie Véhicules et ASU')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ═══════════════════════════════════════════════════════
   MENU GOOGLE SHEETS
   ═══════════════════════════════════════════════════════ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🗺️ Cartographie Véhicules')
    .addItem('📋 Initialiser le classeur', 'initialiserClasseur')
    .addItem('🗺️ Ouvrir la carte', 'ouvrirCarte')
    .addToUi();
}

function initialiserClasseur() {
  var ssId = SpreadsheetSetup.initialiser();
  // Sauvegarder l'ID du spreadsheet créé
  PropertiesService.getScriptProperties().setProperty(SS_PROP_KEY, ssId);
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Classeur initialisé ✅', 'Cartographie Véhicules', 5);
  } catch(e) {}
  return ssId;
}

function ouvrirCarte() {
  var html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1400)
    .setHeight(900);
  SpreadsheetApp.getUi().showModalDialog(html, '🗺️ Cartographie Véhicules et ASU');
}

/* ═══════════════════════════════════════════════════════
   FONCTIONS SERVEUR exposées au client HTML
   ═══════════════════════════════════════════════════════ */

function getMapConfig() {
  return Config.MAP;
}

/**
 * Retourne les données des centres depuis le spreadsheet
 * [{nom, lat, lng, asu, vlm, vlSsuap, projection2027, projection2032}]
 */
function getCarteData() {
  var ss = getSS_();
  if (!ss) return [];
  var sheet = ss.getSheetByName(Config.SHEETS.CENTRES);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var result = [];

  // Map des centres Config pour les coordonnées GPS
  var gpsMap = {};
  Config.CENTRES.forEach(function (c) {
    gpsMap[c.nom] = { lat: c.lat, lng: c.lng };
  });

  for (var i = 1; i < data.length; i++) {
    var nom = String(data[i][0]).trim();
    if (!nom) continue;
    var gps = gpsMap[nom];
    if (!gps) continue;

    result.push({
      nom: nom,
      lat: gps.lat,
      lng: gps.lng,
      asu: data[i][1] === true,
      vlm: String(data[i][2] || '').trim(),
      vlSsuap: String(data[i][3] || '').trim(),
      projection2027: String(data[i][4] || '').trim(),
      projection2032: String(data[i][5] || '').trim()
    });
  }

  return result;
}

/**
 * Retourne les données du tableau pour l'export PDF
 */
function getTableauData(mode) {
  var data = getCarteData();
  return data.map(function (c) {
    var vehicule = '';
    if (mode === '2027') {
      vehicule = c.projection2027;
    } else if (mode === '2032') {
      vehicule = c.projection2032;
    } else {
      var parts = [];
      if (c.vlm) parts.push(c.vlm);
      if (c.vlSsuap) parts.push(c.vlSsuap);
      vehicule = parts.join(' + ');
    }
    return {
      nom: c.nom,
      asu: c.asu,
      vlm: c.vlm,
      vlSsuap: c.vlSsuap,
      projection2027: c.projection2027,
      projection2032: c.projection2032,
      vehicule: vehicule
    };
  });
}
