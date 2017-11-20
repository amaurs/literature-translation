
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

function sliceByFilter(array, filters) {
    var result = [];

    array.forEach(function(element){
        if(rowFilter(element, filters)) {
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


module.exports.onlyUnique = onlyUnique;
module.exports.filterByColumn = filterByColumn;
module.exports.uniqueValues = uniqueValues;
module.exports.sliceByFilter = sliceByFilter;