let ejs = require('ejs'),
    people = ['geddy', 'neil', 'alex'],
    html = ejs.renderFile('./index.ejs', {people: people}, (err, str) => {
      console.log(str);
    });
