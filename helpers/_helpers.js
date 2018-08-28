import { close } from '../database/database'

async function shutdown(app, e) {
  let err = e

  try {
    console.log('Closing web server module...');
  } catch (e) {
    console.log('Encountered error', e);
    err = err || e;
  }
  close()
  console.log('Exiting process');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

module.exports = {
  shutdown
}
