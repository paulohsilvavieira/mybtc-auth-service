/* eslint-disable @typescript-eslint/no-var-requires */
const { appendFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const args = process.argv.slice(2).sort();
const moduleName = args.replace('--module=', '');
const nameFile = args.replace('--name=', '');

const content = "export * from './" + nameFile + "';" + '\n';
const path = `./src/${moduleName}/infra/database/entities`;

if (!existsSync(path)) {
  mkdirSync(path)
  writeFileSync(path + '/index.ts', content, 'utf-8')
} else {
  appendFileSync(path + '/index.ts', content, 'utf-8')
}

console.log('\n')
console.log('\x1b[32mFile \x1b[34m ' + path + '/index.ts' + '\x1b[32mhas been updated successfully!');