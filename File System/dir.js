const fs = require('fs');


// creation of a new directory

if (!fs.existsSync('./new')){
    fs.mkdir('./new', (err) => {
        if (err) throw err;
        console.log('Directory created')
    });
}

// Delete a directory

if (fs.existsSync('./new')){
    fs.rmdir('./new', (err) => {
        if (err) throw err;
        console.log('Directory removed')
    });
}



 