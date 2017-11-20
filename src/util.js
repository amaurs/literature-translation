
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
    array.forEach(function(element){
        returnArray.push(element[column]);
    });
    return Array.from(new Set(returnArray));
}

module.exports.onlyUnique = onlyUnique;
module.exports.filterByColumn = filterByColumn;
module.exports.uniqueValues = uniqueValues;