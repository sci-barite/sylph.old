/**
 * This is the big one! 
 * Used in conjunction with my first my Sylph Chrome Extension, writes an entry on Google Sheets directly from LinkedIn, on Bookmark creation.
 * Now writing data coming from Upwork, and Djinni, too...
 */
 function doGet(e) {
  var get = e.parameter;
  if (get.url.includes("linkedin")) var DB = SpreadsheetApp.openById(/** "SHEET_ID" */).getSheetByName("DB");
  else var DB = SpreadsheetApp.openById(/** "SHEET_ID" */).getSheetByName("FreelanceDB");
  const Today = Utilities.formatDate(new Date(), "GMT+3", "dd/MM/yyyy");
  const Names = DB.getRange('A:A').getValues();

  var JSONString = JSON.stringify([get.name]);  
  var JSONOutput = ContentService.createTextOutput(JSONString+' parameter invalid.\n\nHave a nice day!');
  JSONOutput.setMimeType(ContentService.MimeType.JSON);

  if (get.name == null) return JSONOutput;

  const Search = (element) => element == get.name;
  if (Names.findIndex(Search) != -1) var name = 'DUPLICATE! '+get.name; else var name = get.name;

  DB.appendRow([
    name, '', '0.New', 'Sylph', Today, get.pos, get.skills, get.loc, '', get.more, '', '', get.eng, get.rate
  ]);
  var Name = DB.getRange('A'+DB.getLastRow());
  var Row = DB.getRange(DB.getLastRow()+':'+DB.getLastRow());
  var Link = SpreadsheetApp.newRichTextValue()
    .setText(name)
    .setLinkUrl(get.url)
    .build();
  Name.setRichTextValue(Link);
  Name.offset(0,1).insertCheckboxes();
  Row.offset(-1,0).copyTo(Row, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  Name.offset(0,3).setFontWeight("bold");
  Row.setVerticalAlignment('middle');

  JSONString = JSON.stringify(Row.getValues());  
  JSONOutput = ContentService.createTextOutput(JSONString+"🧚‍♀️ Sylph's spell was casted successfully!");
  JSONOutput.setMimeType(ContentService.MimeType.JSON);

  return JSONOutput;
}