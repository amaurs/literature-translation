/**
function uniqueValues(array, column) {
    let returnArray = ["Todos"];
    array.forEach(function(element) {
        returnArray.push(element[column]);
    });
    return Array.from(new Set(returnArray)).sort();
}
**/

function mapValues(array, column) {
    let returnObject = {"Todos":0};
    //debugger;
    array.forEach(function(element) {
        let item = element[column]
        returnObject["Todos"]++;
        if(!(item in returnObject)){
            returnObject[item] = 1;
        }
        else{
            returnObject[item]++;
        }
    });
    return returnObject;
}

function mapValuesYear(array, column) {
    let returnObject = {};
    array.forEach(function(element) {
        let item = element[column]
        if(!(item in returnObject)){
            returnObject[item] = 1;
        }
        else{
            returnObject[item]++;
        }
    });
    return returnObject;
}



/**
There are two types of filters, the normal ones, and the year. We first
see if the current book is in between the given years, and then we check
if the other filters are met.
**/
function sliceBySelection(array, filters, yearFilter) {
  let result = [];
  array.forEach(function(element){
    let add = true;
    if(parseInt(element["year"], 10) <= parseInt(yearFilter.max, 10) && 
       parseInt(element["year"], 10) >= parseInt(yearFilter.min, 10)){
      filters.forEach(function(filter){
        if(filter.value !== "Todos" && element[filter.key] !== filter.value){
            add &= false;
        }
      });
      if(add){
        result.push(element);
      }
    }
  });
  return result;
}

function sliceBySelectionFunctional(array, filters, yearFilter) {
    return array.filter(element => parseInt(element["year"], 10) < parseInt(yearFilter.max, 10) && 
               parseInt(element["year"], 10) > parseInt(yearFilter.min, 10) && 
               filters.filter(filter => filter.value === "Todos" || element[filter.key] === filter.value)
                      .map(filter => true)
                      .reduce((total, other) => total && other));
}

function download(data, filename, mime) {
  let blob = new Blob([data], {type: mime || 'application/octet-stream'});
  let blobURL = window.URL.createObjectURL(blob);
  let tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename); 
  
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}

function extractContent(html) {
    return (new DOMParser)
            .parseFromString(html, "text/html")
            .documentElement
            .textContent;

}

export { extractContent, mapValuesYear, mapValues, sliceBySelection, sliceBySelectionFunctional, download };
