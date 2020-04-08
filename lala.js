
const Promise = require('./promise');
// var a = new Promise((resolve) => {
//     resolve(1);
// });
// var b = new Promise((resolve, reject) => {
//     reject(3);
// });
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
var a = new Promise1(resolve => resolve(4));
var b = new Promise1(resolve => resolve(5));
var d = new Promise1(resolve => resolve(6));

// 比如登录失效的情况下就可能有如下场景 首先失败的接口会在then里面再次请求登录接口 请求成功后会重新调用刚刚的请求

var c = a.then((a)=> {
    return b.then((b)=> {
        return d.then((d)=> {
            return a + b + d;
        });
    });
});
