const emailsWithDupes = `email@example.com
email@example.com`;
const emailSet = emailsWithDupes
  .split('\n')
  .reduce(function(setOfEmails, curr) {
    setOfEmails.add(curr); 
    return setOfEmails;
  }, new Set());
const withoutDuplicates = Array.from(emailSet).join('\n')

const fs = require('fs');
fs.writeFile('smstc-mailing-list-example.csv', withoutDuplicates, (err) => {
  if (err) console.log('bad'); 
  console.log('done');
})