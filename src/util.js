
function filterByColumn(array, index, value)
{
    var returnArray = [];
    for(var i = 0; i < array.length; i++)
    {
        var row = array[i];
        if(row[index] == value)
        {
            returnArray.push(row);
        }
    }
    return returnArray;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function uniqueValues(array, column) {
    var returnArray = [];
    array.forEach(function(element) {
        returnArray.push(element[column]);
    });
    return Array.from(new Set(returnArray)).sort();
}

function sliceByFilter(array, filters, yearLow) {
    var result = [];

    array.forEach(function(element){
        if(rowFilter(element, filters) && yearLow<=parseInt(element["year"])) {
            result.push(element);
        }
    })
    
    return result;
}



function rowFilter(obj, filters) {
    for(var i=0; i < filters.length; i++) {
        var filter = filters[i];
        var column = Object.keys(filter)[0];
        if(obj[column] != filter[column]){
            return false;
        }
    }
    return true;
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




module.exports.onlyUnique = onlyUnique;
module.exports.filterByColumn = filterByColumn;
module.exports.uniqueValues = uniqueValues;
module.exports.sliceByFilter = sliceByFilter;
module.exports.getCountryId = getCountryId;