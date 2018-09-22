function fetchRowsFromRS(connection, resultSet, numRows, resultData, resolve, reject) {
  resultSet.getRows( // get numRows rows
    numRows,
    function (err, rows) {
      if (err) {
        doClose(connection, resultSet); // always close the ResultSet
        reject({ error: true, message: err })
      } else if (rows.length === 0) {   // no rows, or no more rows
        doClose(connection, resultSet); // always close the ResultSet
        resolve(resultData)
      } else if (rows.length > 0) {
        resultData.push(rows)
        fetchRowsFromRS(connection, resultSet, numRows, resultData, resolve, reject);
      }
  })
}

function fetchAsync (connection, resultSet, numRows, resultData) {
  return new Promise((resolve, reject) => {
    fetchRowsFromRS(connection, resultSet, numRows, resultData, resolve, reject)
  })
}

function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) { console.error(err.message); }
    });
}

function doClose(connection, resultSet) {
  resultSet.close(
    function(err) {
      if (err) { console.error(err.message); }
      doRelease(connection);
    });
}

/**
 * 
 * @param {array} metadata - Arreglo con los nombres de cada columna
 * @param {array} items - Arreglo multidimensional con los valores de cada columna
 * @returns {array} - Arreglo con objetos cuyas llaves y valores corresponden a la estructura de la tabla en la Base de datos. 
 * EJ [ { id: 1, nombre: 'nombre' }, { id: 2, nombre: 'nombre2' }... ]
 */
function convert (metadata, items) {
  let newArr = []

  items.forEach(arr => {
    if (arr.length > 0) {
      arr.forEach(item => {
        let obj = {}
        for (let i = 0; i < item.length; i++) {
          obj[metadata[i].name] = item[i]
        }
        newArr.push(obj)
      })
    }
  })

  return newArr
}

module.exports = {
  fetchAsync,
  convert
}