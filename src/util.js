
function uniqueValues(array, column) {
    let returnArray = ["Todos"];
    array.forEach(function(element) {
        returnArray.push(element[column]);
    });
    return Array.from(new Set(returnArray)).sort();
}

function mapValues(array, column) {
    let returnObject = {"Todos":0};

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
function sliceByFilter(array, filters, yearFilter) {
  let result = [];
  array.forEach(function(element){
    let add = true;
    if(parseInt(element["year"], 10) < parseInt(yearFilter.max, 10) && 
       parseInt(element["year"], 10) > parseInt(yearFilter.min, 10)){
      filters.forEach(function(filter){
        if(filter.value !== "Todos") {
          if(element[filter.key] !== filter.value){
            add &= false;
          }
        }
      });
      if(add){
        result.push(element);
      }
    }
  });
  return result;
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


function getCountryId(name) {
    var nameMap = {
                    "Afghanistan":"AFG",
                    "Angola":"AGO",
                    "Albania":"ALB",
                    "United Arab Emirates":"ARE",
                    "Argentina":"ARG",
                    "Armenia":"ARM",
                    "Antarctica":"ATA",
                    "French Southern and Antarctic Lands":"ATF",
                    "Australia":"AUS",
                    "Austria":"AUT",
                    "Azerbaijan":"AZE",
                    "Burundi":"BDI",
                    "Bélgica":"BEL",
                    "Benin":"BEN",
                    "Burkina Faso":"BFA",
                    "Bangladesh":"BGD",
                    "Bulgaria":"BGR",
                    "The Bahamas":"BHS",
                    "Bosnia and Herzegovina":"BIH",
                    "Belarus":"BLR",
                    "Belize":"BLZ",
                    "Bermuda":"BMU",
                    "Bolivia":"BOL",
                    "Brasil":"BRA",
                    "Brunei":"BRN",
                    "Bhutan":"BTN",
                    "Botswana":"BWA",
                    "Central African Republic":"CAF",
                    "Canadá":"CAN",
                    "Switzerland":"CHE",
                    "Chile":"CHL",
                    "China":"CHN",
                    "Ivory Coast":"CIV",
                    "Cameroon":"CMR",
                    "Democratic Republic of the Congo":"COD",
                    "Republic of the Congo":"COG",
                    "Colombia":"COL",
                    "Costa Rica":"CRI",
                    "Cuba":"CUB",
                    "Cyprus":"CYP",
                    "República Checa":"CZE",
                    "Alemania":"DEU",
                    "Djibouti":"DJI",
                    "Dinamarca":"DNK",
                    "Dominican Republic":"DOM",
                    "Algeria":"DZA",
                    "Ecuador":"ECU",
                    "Egypt":"EGY",
                    "Eritrea":"ERI",
                    "España":"ESP",
                    "Estonia":"EST",
                    "Ethiopia":"ETH",
                    "Finlandia":"FIN",
                    "Fiji":"FJI",
                    "Falkland Islands":"FLK",
                    "Francia":"FRA",
                    "Gabon":"GAB",
                    "Inglaterra":"GBR",
                    "Reino Unido":"GBR",
                    "Irlanda":"GBR",
                    "Georgia":"GEO",
                    "Ghana":"GHA",
                    "Guinea":"GIN",
                    "Gambia":"GMB",
                    "Guinea Bissau":"GNB",
                    "Equatorial Guinea":"GNQ",
                    "Grecia":"GRC",
                    "Greenland":"GRL",
                    "Guatemala":"GTM",
                    "French Guiana":"GUF",
                    "Guyana":"GUY",
                    "Honduras":"HND",
                    "Croacia":"HRV",
                    "Haiti":"HTI",
                    "Hungría":"HUN",
                    "Indonesia":"IDN",
                    "India":"IND",
                    "Ireland":"IRL",
                    "Iran":"IRN",
                    "Iraq":"IRQ",
                    "Iceland":"ISL",
                    "Israel":"ISR",
                    "Italia":"ITA",
                    "Jamaica":"JAM",
                    "Jordan":"JOR",
                    "Japón":"JPN",
                    "Kazakhstan":"KAZ",
                    "Kenya":"KEN",
                    "Kyrgyzstan":"KGZ",
                    "Cambodia":"KHM",
                    "South Korea":"KOR",
                    "Kosovo":"CS-KM",
                    "Kuwait":"KWT",
                    "Laos":"LAO",
                    "Lebanon":"LBN",
                    "Liberia":"LBR",
                    "Libya":"LBY",
                    "Sri Lanka":"LKA",
                    "Lesotho":"LSO",
                    "Lithuania":"LTU",
                    "Luxembourg":"LUX",
                    "Latvia":"LVA",
                    "Morocco":"MAR",
                    "Moldova":"MDA",
                    "Madagascar":"MDG",
                    "México":"MEX",
                    "Macedonia":"MKD",
                    "Mali":"MLI",
                    "Malta":"MLT",
                    "Myanmar":"MMR",
                    "Montenegro":"MNE",
                    "Mongolia":"MNG",
                    "Mozambique":"MOZ",
                    "Mauritania":"MRT",
                    "Malawi":"MWI",
                    "Malaysia":"MYS",
                    "Namibia":"NAM",
                    "New Caledonia":"NCL",
                    "Niger":"NER",
                    "Nigeria":"NGA",
                    "Nicaragua":"NIC",
                    "Holanda":"NLD",
                    "Países Bajos":"NLD",
                    "Noruega":"NOR",
                    "Nepal":"NPL",
                    "New Zealand":"NZL",
                    "Oman":"OMN",
                    "Pakistan":"PAK",
                    "Panama":"PAN",
                    "Peru":"PER",
                    "Philippines":"PHL",
                    "Papua New Guinea":"PNG",
                    "Polonia":"POL",
                    "Puerto Rico":"PRI",
                    "North Korea":"PRK",
                    "Portugal":"PRT",
                    "Paraguay":"PRY",
                    "Qatar":"QAT",
                    "Rumania":"ROU",
                    "Rumanía":"ROU",
                    "Rusia":"RUS",
                    "Rwanda":"RWA",
                    "Western Sahara":"ESH",
                    "Saudi Arabia":"SAU",
                    "Sudan":"SDN",
                    "South Sudan":"SSD",
                    "Senegal":"SEN",
                    "Solomon Islands":"SLB",
                    "Sierra Leone":"SLE",
                    "El Salvador":"SLV",
                    "Somaliland":"-99",
                    "Somalia":"SOM",
                    "Republic of Serbia":"SRB",
                    "Suriname":"SUR",
                    "Slovakia":"SVK",
                    "Slovenia":"SVN",
                    "Suecia":"SWE",
                    "Suiza":"SWZ",
                    "Syria":"SYR",
                    "Chad":"TCD",
                    "Togo":"TGO",
                    "Thailand":"THA",
                    "Tajikistan":"TJK",
                    "Turkmenistan":"TKM",
                    "East Timor":"TLS",
                    "Trinidad and Tobago":"TTO",
                    "Tunisia":"TUN",
                    "Turquía":"TUR",
                    "Taiwan":"TWN",
                    "United Republic of Tanzania":"TZA",
                    "Uganda":"UGA",
                    "Ukraine":"UKR",
                    "Uruguay":"URY",
                    "EUA":"USA",
                    "Estados Unidos":"USA",
                    "Uzbekistan":"UZB",
                    "Venezuela":"VEN",
                    "Vietnam":"VNM",
                    "Vanuatu":"VUT",
                    "West Bank":"PSE",
                    "Yemen":"YEM",
                    "South Africa":"ZAF",
                    "Zambia":"ZMB",
                    "Zimbabwe":"ZWE"};
    return nameMap[name];
}



export { mapValuesYear, mapValues, uniqueValues, sliceByFilter, getCountryId, download };
