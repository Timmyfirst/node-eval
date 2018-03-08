const fs = require('fs')
const path = require('path')
const util = require('util')

module.exports = readJson

function readJson(name) {
    return new Promise((resolve, reject) => {

        const filePath = path.join(__dirname, 'helpers', name)
        const options = { encoding: 'utf-8' }
        fs.readFile(filePath, options, function (err, contents) {
            if (err) reject(err)
            else {
                const trimmedContents = JSON.parse(contents);
                    resolve(trimmedContents)
            }

        })
    })
}

//
// function readHint(name, callback) {
//     if (typeof callback !== 'function') {
//         throw new Error('Callback must be a function')
//     }
//     const filePath = path.join(__dirname, 'files', name)
//     const options = { encoding: 'utf-8' }
//     fs.readFile(filePath, options, function (err, contents) {
//         if (err) {
//             callback(err)
//         } else {
//             const trimmedContents = contents.trim()
//             callback(null, trimmedContents)
//         }
//     })
// }