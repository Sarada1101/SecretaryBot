function fetchConnpassEvent() {
    var info = UrlFetchApp.fetch("https://connpass.com/api/v1/event/");
    var json = JSON.parse(info.getContentText());
    var count = json["results_returned"];

    for (var i = 0; i < count; i++) {
        var address = json["events"][i]["address"];
        if (address == null) {
            continue;
        }

        if (!address.match(/オンライン/) && !address.match(/福岡/)) {
            continue;
        }

        var title = json["events"][i]["title"];
        var place = json["events"][i]["place"];
        var url = json["events"][i]["event_url"];
        var start = json["events"][i]["started_at"];
        var event_info = { title: title, address: address, place: place, url: url, start: start };

        // var spreadsheet = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
        // var sheet = spreadsheet.getSheetByName('connpass');
        // var max_row = sheet.getDataRange().getLastRow();

        // for (var j = 1; j <= max_row; j++) {
        // var title_entered_sheet = sheet.getRange(j,1).getValue();

        // if (title === title_entered_sheet) {
        // break;
        // } else if (j === max_row) {
        createEventJson(event_info /*, max_row, sheet*/);
        // }
        // }
    }
}

function createEventJson(event_info, max_row, sheet) {
    // sheet.getRange(max_row + 1,1).setValue(event_info["title"]);

    var json = {
        text:
            "*" +
            event_info["title"] +
            "* \n場所：" +
            event_info["address"] +
            event_info["place"] +
            "\n開始日時：" +
            event_info["start"].substring(0, 16).replace("T", " ") +
            "\n" +
            event_info["url"],
    };
    var options = {
        method: "post",
        payload: JSON.stringify(json),
        muteHttpExceptions: true,
    };
    var url = PropertiesService.getScriptProperties().getProperty("CONNPASS_URL");
    UrlFetchApp.fetch(url, options);
}
