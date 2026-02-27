/**
 * SDIS 66 — Cartographie Véhicules et ASU
 * Configuration : centres, coordonnées GPS
 */

var Config = (function () {

  /* ── Paramètres de la carte ── */
  var MAP = {
    center: { lat: 42.58, lng: 2.55 },
    zoom: 10,
    minZoom: 9,
    maxZoom: 17
  };

  /* ── Noms des onglets ── */
  var SHEETS = {
    CENTRES:  'Centres',
    VLM:      'VLM',
    VL_SSUAP: 'VL SSUAP'
  };

  /* ── Couleurs véhicules ── */
  var COLORS = {
    ASU:      '#e74c3c',   // rouge
    VLM:      '#2980b9',   // bleu
    VL_SSUAP: '#27ae60',   // vert
    BOTH:     '#9b59b6',   // violet (VLM + VL SSUAP)
    NONE:     '#7f8c8d'    // gris
  };

  /* ════════════════════════════════════════════════════════
     CENTRES D'INCENDIE ET DE SECOURS — SDIS 66
     Coordonnées GPS, sans groupements
     ════════════════════════════════════════════════════════ */
  var CENTRES = [
    { id: 'agly',                 nom: 'Agly',                       lat: 42.7957, lng: 2.6878 },
    { id: 'argeles',              nom: 'Argelès',                    lat: 42.5460, lng: 3.0233 },
    { id: 'baixas',               nom: 'Baixas',                     lat: 42.7546, lng: 2.8103 },
    { id: 'banyuls',              nom: 'Banyuls',                    lat: 42.4830, lng: 3.1290 },
    { id: 'boulou',               nom: 'Boulou',                     lat: 42.5230, lng: 2.8334 },
    { id: 'canet',                nom: 'Canet',                      lat: 42.7066, lng: 3.0130 },
    { id: 'capcir',               nom: 'Capcir',                     lat: 42.5718, lng: 2.0695 },
    { id: 'caudies',              nom: 'Caudiès',                    lat: 42.8099, lng: 2.3742 },
    { id: 'cerbere',              nom: 'Cerbère',                    lat: 42.4424, lng: 3.1685 },
    { id: 'cerdagne',             nom: 'Cerdagne',                   lat: 42.4323, lng: 1.9485 },
    { id: 'ceret',                nom: 'Céret',                      lat: 42.4860, lng: 2.7480 },
    { id: 'cote-vermeille',       nom: 'Côte Vermeille',             lat: 42.5170, lng: 3.1040 },
    { id: 'elne',                 nom: 'Elne',                       lat: 42.5991, lng: 2.9718 },
    { id: 'font-romeu',           nom: 'Font Romeu',                 lat: 42.5044, lng: 2.0370 },
    { id: 'ille-sur-tet',         nom: 'Ille Sur Tet',               lat: 42.6710, lng: 2.6210 },
    { id: 'le-barcares',          nom: 'Le Barcarès',                lat: 42.7910, lng: 3.0340 },
    { id: 'les-aspres',           nom: 'Les Aspres',                 lat: 42.6336, lng: 2.7553 },
    { id: 'maury',                nom: 'Maury',                      lat: 42.8329, lng: 2.5878 },
    { id: 'millas',               nom: 'Millas',                     lat: 42.6944, lng: 2.6950 },
    { id: 'mont-louis',           nom: 'Mont Louis',                 lat: 42.5106, lng: 2.1213 },
    { id: 'olette',               nom: 'Olette',                     lat: 42.5430, lng: 2.2750 },
    { id: 'palau',                nom: 'Palau',                      lat: 42.5711, lng: 2.9609 },
    { id: 'pnord',                nom: 'Perpignan Nord',             lat: 42.7200, lng: 2.8950 },
    { id: 'pouest',               nom: 'Perpignan Ouest',            lat: 42.6980, lng: 2.8400 },
    { id: 'porte',                nom: 'Porte',                      lat: 42.5472, lng: 1.8312 },
    { id: 'prades',               nom: 'Prades',                     lat: 42.6177, lng: 2.4216 },
    { id: 'prats',                nom: 'Prats',                      lat: 42.4053, lng: 2.4855 },
    { id: 'psud',                 nom: 'Perpignan Sud',              lat: 42.6770, lng: 2.8950 },
    { id: 'riberal',              nom: 'Ribéral',                    lat: 42.6980, lng: 2.7650 },
    { id: 'rivesaltes',           nom: 'Rivesaltes',                 lat: 42.7702, lng: 2.8770 },
    { id: 'saillagouse',          nom: 'Saillagouse',                lat: 42.4590, lng: 2.0370 },
    { id: 'saint-cyprien',        nom: 'Saint Cyprien',              lat: 42.6193, lng: 3.0067 },
    { id: 'salanque',             nom: 'Salanque',                   lat: 42.7714, lng: 2.9936 },
    { id: 'salses',               nom: 'Salses',                     lat: 42.8367, lng: 2.9208 },
    { id: 'sournia',              nom: 'Sournia',                    lat: 42.7316, lng: 2.4317 },
    { id: 'st-laurent-cerdans',   nom: 'St Laurent De Cerdans',      lat: 42.3853, lng: 2.6101 },
    { id: 'st-paul-fenouillet',   nom: 'Saint Paul De Fenouillet',   lat: 42.8109, lng: 2.5030 },
    { id: 'vallespir',            nom: 'Vallespir',                  lat: 42.4581, lng: 2.6313 },
    { id: 'vernet',               nom: 'Vernet',                     lat: 42.5458, lng: 2.3870 },
    { id: 'vinca',                nom: 'Vinca',                      lat: 42.6438, lng: 2.5277 },
    { id: 'vingrau',              nom: 'Vingrau',                    lat: 42.8591, lng: 2.7382 }
  ];

  function getNomsCentres() {
    return CENTRES.map(function (c) { return c.nom; }).sort();
  }

  return {
    MAP: MAP,
    SHEETS: SHEETS,
    COLORS: COLORS,
    CENTRES: CENTRES,
    getNomsCentres: getNomsCentres
  };

})();
