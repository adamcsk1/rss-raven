const { writeFileSync } = require('fs');

console.log('Create android .gitignore');

const distPath = `../android/app/src/main/assets/`;

writeFileSync(`${distPath}.gitignore`, '*\n!.gitignore', 'utf-8');
