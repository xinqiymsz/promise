
const Promise = require('./promise');
var a = new Promise((resolve) => {
    resolve(1);
});
var b = new Promise((resolve, reject) => {
    reject(3);
});
// a.then((res) => {
//   return new Promise((resolve) => { // return个promise
//     setTimeout(() => {resolve(233)}, 2000);
//   });
// }).then((res) => {
//    console.log(res, 'lalala');
// });
Promise.all([a,b]).then((res) => {
  console.log(res, '////res');
}, (err) => {
  console.log(err, '/////err');
});