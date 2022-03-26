
const fsPromises =  require('fs').promises;
const path = require('path');

const fileOps = async () => {
    try{
        const data = await fsPromises.readFile(path.join(__dirname, 'starter.txt'), 'utf8');
        console.log(data);

        // unlink is used to delete a file 
        await fsPromises.unlink(path.join(__dirname, 'starter.txt'));

        await fsPromises.writeFile(path.join(__dirname, 'promisesWrite.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'promisesWrite.txt'), '\n\n Nice to meet you !');
        await fsPromises.rename(path.join(__dirname, 'promisesWrite.txt'),path.join(__dirname, 'promiseComplete.txt'))

        const newData = await fsPromises.readFile(path.join(__dirname, 'promiseComplete.txt'), 'utf8');

        console.log(newData)

    } catch (err){
        console.error(err)
    }
}

fileOps();

// fs.readFile('./starter.txt', 'utf8', (err, data) => {
    // fs.readFile(path.join(__dirname, 'starter.txt'), 'utf8', (err, data) => {
    // if (err) throw  err;
    // console.log(data)
    // console.log(data.toString());
// })

 // Create and writing in to a file
// fs.writeFile(path.join(__dirname, 'reply.txt'),'Nice to meet you',(err) => {
//     if (err) throw  err;
//     console.log('Write complete');

//     fs.appendFile(path.join(__dirname, 'reply.txt'),'\n\nYes it is.',(err) => {
//         if (err) throw  err;
//         console.log('Append complete');

//         fs.rename(path.join(__dirname, 'reply.txt'),path.join(__dirname, 'newReply.txt'), (err) => {
//             if (err) throw  err;
//             console.log('Rename complete');
//         })
//     })
// })

//Create an append
 

// exit on uncaught errors
process.on('uncaughtException', err => {
    console.error(`There was an uncaughr error: ${err}`);
    process.exit(1);
})
// fs.readFile('./lorem.txt',(err, data) => {
//     if (err) throw err;
//     console.log(data.toString()) 
// in stead of to string
// })