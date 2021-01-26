// const http = require('http')
// const fs = require('fs')
//
// const port = process.env.PORT || 3000
//
// http.createServer((req, res) => {
//   var fileReqPath = __dirname + "/_site" + (req.url === '/' ? '/index.html' : req.url.split("?")[0]);
//   fs.access(fileReqPath, (err) => {
//     if (!err) {
//       console.log(fileReqPath + ' exists');
//       if (fs.statSync(fileReqPath).isDirectory()) fileReqPath += '/index.html';
//       return;
//     }
//     console.log('myfile does not exist');
//   });
//   const filePath = fileReqPath;
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       res.writeHead(404)
//       res.end(JSON.stringify(err))
//       return
//     }
//     res.writeHead(200)
//     res.end(data)
//   })
// }).listen(port)
