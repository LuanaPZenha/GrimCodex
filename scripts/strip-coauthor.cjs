const fs = require('fs');
const input = fs.readFileSync(0, 'utf8');
const output = input
  .split(/\r?\n/)
  .filter((line) => !line.startsWith('Co-authored-by: Cursor'))
  .join('\n')
  .replace(/\n{3,}$/, '\n');
process.stdout.write(output);
