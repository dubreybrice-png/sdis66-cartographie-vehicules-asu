/**
 * SDIS 66 — Cartographie Véhicules et ASU
 * SpreadsheetSetup : création et configuration du classeur
 */

var SpreadsheetSetup = (function () {

  /**
   * Initialise le spreadsheet lié au script avec les onglets et validations
   */
  function initialiser() {
    var ss;
    try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch(e) {}
    
    if (!ss) {
      // Mode standalone : créer un nouveau spreadsheet
      ss = SpreadsheetApp.create('SDIS 66 — Cartographie Véhicules et ASU');
      Logger.log('Spreadsheet créé: ' + ss.getUrl());
    }

    _creerOngletVLM(ss);
    _creerOngletVLSSUAP(ss);
    _creerOngletCentres(ss);

    SpreadsheetApp.flush();
    return ss.getId();
  }

  /**
   * Crée l'onglet VLM avec la liste des véhicules
   */
  function _creerOngletVLM(ss) {
    var sheet = ss.getSheetByName(Config.SHEETS.VLM);
    if (!sheet) {
      sheet = ss.insertSheet(Config.SHEETS.VLM);
    } else {
      sheet.clear();
    }

    sheet.getRange('A1').setValue('Liste VLM').setFontWeight('bold');
    var vlmList = [];
    for (var i = 1; i <= 20; i++) {
      vlmList.push(['VLM ' + i]);
    }
    sheet.getRange(2, 1, vlmList.length, 1).setValues(vlmList);
    sheet.setColumnWidth(1, 150);
    sheet.getRange('A1').setBackground('#2980b9').setFontColor('#fff');
    return sheet;
  }

  /**
   * Crée l'onglet VL SSUAP avec la liste des véhicules
   */
  function _creerOngletVLSSUAP(ss) {
    var sheet = ss.getSheetByName(Config.SHEETS.VL_SSUAP);
    if (!sheet) {
      sheet = ss.insertSheet(Config.SHEETS.VL_SSUAP);
    } else {
      sheet.clear();
    }

    sheet.getRange('A1').setValue('Liste VL SSUAP').setFontWeight('bold');
    var vlList = [];
    for (var i = 1; i <= 20; i++) {
      vlList.push(['VL SSUAP ' + i]);
    }
    sheet.getRange(2, 1, vlList.length, 1).setValues(vlList);
    sheet.setColumnWidth(1, 180);
    sheet.getRange('A1').setBackground('#27ae60').setFontColor('#fff');
    return sheet;
  }

  /**
   * Crée l'onglet Centres avec structure complète
   */
  function _creerOngletCentres(ss) {
    var sheet = ss.getSheetByName(Config.SHEETS.CENTRES);
    if (!sheet) {
      sheet = ss.insertSheet(Config.SHEETS.CENTRES);
    } else {
      sheet.clear();
    }

    // En-têtes
    var headers = ['Centre', 'ASU', 'VLM (actuel)', 'VL SSUAP (actuel)', 'Projection 2027', 'Projection 2032'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#2c3e50').setFontColor('#fff');

    // Remplir les noms de centres
    var centres = Config.getNomsCentres();
    var data = centres.map(function (nom) { return [nom, false, '', '', '', '']; });
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

    // Colonne B: cases à cocher ASU
    sheet.getRange(2, 2, centres.length, 1).insertCheckboxes();

    // Validation VLM (colonne C) — menu déroulant depuis onglet VLM
    var vlmRule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName(Config.SHEETS.VLM).getRange('A2:A21'), true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange(2, 3, centres.length, 1).setDataValidation(vlmRule);

    // Validation VL SSUAP (colonne D) — menu déroulant depuis onglet VL SSUAP
    var vlsRule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName(Config.SHEETS.VL_SSUAP).getRange('A2:A21'), true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange(2, 4, centres.length, 1).setDataValidation(vlsRule);

    // Validation Projection 2027 (colonne E) — cumul VLM + VL SSUAP
    var allVehicles = [];
    for (var i = 1; i <= 20; i++) allVehicles.push('VLM ' + i);
    for (var i = 1; i <= 20; i++) allVehicles.push('VL SSUAP ' + i);
    var projRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(allVehicles, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange(2, 5, centres.length, 1).setDataValidation(projRule);

    // Validation Projection 2032 (colonne F) — même liste
    sheet.getRange(2, 6, centres.length, 1).setDataValidation(projRule);

    // Mise en forme
    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 150);
    sheet.setColumnWidth(4, 180);
    sheet.setColumnWidth(5, 180);
    sheet.setColumnWidth(6, 180);

    // Couleurs d'en-tête par colonne
    sheet.getRange(1, 2).setBackground('#e74c3c');  // ASU rouge
    sheet.getRange(1, 3).setBackground('#2980b9');  // VLM bleu
    sheet.getRange(1, 4).setBackground('#27ae60');  // VL SSUAP vert
    sheet.getRange(1, 5).setBackground('#8e44ad');  // Projection 2027 violet
    sheet.getRange(1, 6).setBackground('#d35400');  // Projection 2032 orange

    // Bandes alternées
    for (var i = 0; i < centres.length; i++) {
      if (i % 2 === 0) {
        sheet.getRange(i + 2, 1, 1, headers.length).setBackground('#f8f9fa');
      }
    }

    sheet.setFrozenRows(1);

    // Bouton « Ouvrir la carte » en H1
    var url = WEBAPP_URL || '';
    try {
      var svcUrl = ScriptApp.getService().getUrl();
      if (svcUrl) url = svcUrl;
    } catch(e) {}
    if (url) {
      var btnRange = sheet.getRange('H1:J1').merge();
      btnRange.setFormula('=HYPERLINK("' + url + '","🗺️ OUVRIR LA CARTE")');
      btnRange.setBackground('#c0392b').setFontColor('#ffffff').setFontWeight('bold')
        .setFontSize(14).setHorizontalAlignment('center').setVerticalAlignment('middle');
      sheet.setRowHeight(1, 42);
      sheet.setColumnWidth(8, 100);
      sheet.setColumnWidth(9, 100);
      sheet.setColumnWidth(10, 100);
    }

    // Supprimer la feuille par défaut "Feuille 1" si elle existe
    try {
      var defSheet = ss.getSheetByName('Feuille 1') || ss.getSheetByName('Sheet1');
      if (defSheet && ss.getSheets().length > 1) ss.deleteSheet(defSheet);
    } catch (e) {}

    return sheet;
  }

  return {
    initialiser: initialiser
  };

})();
