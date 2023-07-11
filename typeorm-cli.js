/* eslint-disable @typescript-eslint/no-var-requires */
const { appendFileSync } = require('fs');
const args = process.argv.slice(2)[0];
const nameFile = args.replace('--name=', '');
const exportFileName = "export * from './" + nameFile + "';";

appendFileSync(
  './src/database/entities/index.ts',
  exportFileName + '\n',
  'utf-8',
);
console.log('\n')
console.log('\x1b[32mFile \x1b[34m./src/infra/database/entities/index.ts \x1b[32mhas been updated successfully!');