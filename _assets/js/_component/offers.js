// code for inserting live SE offers from API

var spreadsheetID = "14g1IiRy-0A3yFke6WRhvB_AOn_bNVESIDasUVcc93PM"; // ID of Google Spreadsheet
var apiKey = "AIzaSyBww8fHIRizAYPWsYyNGcRvLvzTLvvKmkw"; // API key for accessing G Sheet
var tagType = {
  refundable: {
    icon: "shield",
    alt: "Shield",
    text: "Refundable",
    color: "#008B71",
    cmsId: "refundable"
  },
  flights: {
    icon: "plane",
    alt: "Airplane",
    text: "Flights Included",
    color: "#000",
    cmsId: "flights"
  },
  customisable: {
    icon: "star",
    alt: "Star",
    text: "Customisable",
    color: "#583092",
    cmsId: "zz_CLalldeals"
  }
};

///////////////////////////////////////////////////////////////// offer tag html
function makeTags(tagIdArray) {
  // check if empty
  if (tagIdArray.length === 0) return "";
  // create html string for each tag
  var html = "";
  for (let i = 0; i < tagIdArray.length; i++) {
    html +=
      '<div class="tag" style="background-color: ' +
      tagType[tagIdArray[i]].color +
      ';"><img src="' +
      imgPath +
      "/icons/" +
      tagType[tagIdArray[i]].icon +
      '.svg" alt="' +
      tagType[tagIdArray[i]].alt +
      ' icon" />' +
      tagType[tagIdArray[i]].text +
      "</div>";
  }
  return html;
}

//////////////////////////////////////////////////////////////// offer card html
function offerCard(offerData) {
  return (
    '<div class="col"><div class="offer-card"><div class="image bg-ratio bg-ratio--3-2" style="background-image: url(\'' +
    offerData.image +
    '\')" ></div><div class="content"><div class="location">' +
    offerData.location +
    '</div><div class="title">' +
    offerData.title +
    '</div><div class="tags">' +
    makeTags(offerData.tags) +
    '</div><div class="bottom"><div class="left"><div class="price"><div>From <span>£' +
    offerData.price.now +
    "</span></div><div>" +
    offerData.price.description +
    '</div></div></div><div class="right"><div class="saving">Up to <span>-' +
    offerData.saving +
    '%</span></div></div></div></div><a class="link" href="' +
    offerData.link +
    '"></a></div></div>'
  );
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////// Main function
////////////////////////////////////////////////////////////////////////////////
$(".js-se-offers").each(function () {
  var el = $(this);
  var container = el.parent();
  var sheetName = el.data("sheet");
  var amount = el.data("amount") || 8;
  var sort = el.data("sort") || "price-low";
  var url =
    "https://sheets.googleapis.com/v4/spreadsheets/" +
    spreadsheetID +
    "/values/" +
    sheetName +
    "!A3:Z?&key=" +
    apiKey;

  // remove placeholder element holding offer data
  el.remove();

  ///////////////////////////////////////////////////////////////////// API Call
  $.ajax({
    method: "GET",
    url: url
  }).done(function (data) {
    // remove empty rows from data
    var cellValues = []; // store off data from sheet
    for (var i = 0; i < data.values.length; i++) {
      if (data.values[i][2] !== "") {
        cellValues.push(data.values[i]);
      }
    }
    // stop process if sheet is empty
    if (cellValues.length === 0) return;

    // remove placeholder loading offer cards
    container.empty();

    // add offer cards with content
    for (var i = 0; i < amount; i++) {
      // checks if there are less offers than amount
      if (cellValues[i] !== undefined) {
        // create array of used tags, loop through each type
        var tags = [];
        $.each(tagType, function (key, obj) {
          if (cellValues[i][11].indexOf(obj.cmsId) !== -1) tags.push(key);
        });
        // create offer object
        var offer = {
          image: cellValues[i][10],
          location: cellValues[i][2],
          title: cellValues[i][1],
          tags: tags,
          price: {
            now: cellValues[i][4],
            description: cellValues[i][5]
          },
          saving: cellValues[i][6],
          link: cellValues[i][9]
        };
        // create populated offer card
        container.append(offerCard(offer));
      } else {
        break; // stops if there are less offers than amount
      }
    }
  });
});
