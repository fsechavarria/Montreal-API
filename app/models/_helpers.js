import moment from 'moment'

function formatDate (date) {
  let formats = [
    'DD-MM-YYYY',
    'DD/MM/YYYY',
    'MM-DD-YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
    'YYYY/MM/DD',
    'YYYY/DD/MM',
    'YYYY-DD-MM',
    moment.ISO_8601
  ]
  if (moment(date, formats, true).isValid()) {
    return moment(date, formats).format('DD/MM/YYYY')
  } else {
    return false
  }
}

module.exports = {
  formatDate
}
