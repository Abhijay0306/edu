const { execSync } = require('child_process');
const fs = require('fs');

try {
  const result = execSync('npx prisma validate 2>&1');
  console.log('Success:', result.toString());
} catch (error) {
  fs.writeFileSync('error_dump.log', error.stdout.toString() + error.stderr.toString());
  console.log('Error dumped to error_dump.log');
}
