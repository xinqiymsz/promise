function resolvePromise(promise2, x, resolve, reject){
    // 循环引用报错
    if(x === promise2){
      // reject报错
      return reject(new TypeError('Chaining cycle detected for promise'));
    }
    // 防止多次调用
    let called;
    // x不是null 且x是对象或者函数也就是先认为x是promise
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        let then = x.then;
        // 如果then是函数，就默认是promise了 把x的then执行如果成功就把执行的值传给下一个then里的
        if (typeof then === 'function') { 
          // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
          then.call(x, y => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // y可能依旧是promise 那就递归 此行也相当于resolve(y)
            resolvePromise(promise2, y, resolve, reject); 
          }, err => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err);// 失败了就失败了
          })
        } else { // 可能是数组😓
          resolve(x); // 直接成功即可
        }
      } catch (e) {
        // 也属于失败
        if (called) return;
        called = true;
        // 取then出错了那就不要在继续执行了
        reject(e); 
      }
    } else {
      resolve(x);
    }
  }

  function isPromise(x) {
    if (x != null && (typeof x === 'object' || typeof x === 'function')) return true;
    else return false;
  }
  
class Promise{
    constructor(executor){
      this.state = 'pending';
      this.value = undefined;
      this.reason = undefined;
      this.onResolvedCallbacks = [];
      this.onRejectedCallbacks = [];
      let resolve = value => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          this.onResolvedCallbacks.forEach(fn=>fn());
        }
      };
      let reject = reason => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.reason = reason;
          this.onRejectedCallbacks.forEach(fn=>fn());
        }
      };
      try{
        executor(resolve, reject);
      } catch (err) {
        reject(err);
      }
    }
    then(onFulfilled,onRejected) {
      // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
      // onRejected如果不是函数，就忽略onRejected，直接扔出错误
      onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
      let promise2 = new Promise((resolve, reject) => {
        if (this.state === 'fulfilled') {
          // 异步 为了拿到promise2
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        };
        if (this.state === 'rejected') {
          // 异步
          setTimeout(() => {
            // 如果报错
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        };
        if (this.state === 'pending') { // 状态一旦改变无法返回
          this.onResolvedCallbacks.push(() => {
            // 异步
            setTimeout(() => {
              try {
                let x = onFulfilled(this.value);
                resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
          this.onRejectedCallbacks.push(() => {
            // 异步
            setTimeout(() => {
              try {
                let x = onRejected(this.reason);
                resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0)
          });
        };
      });
      // 返回promise，完成链式
      return promise2;
    }
    
  }
  // promise.all
  Promise.all = function(promises){
    return new Promise((resolve,reject)=>{
        let arr = [];
        let i = 0;
        function processData(index,data){
          arr[index] = data;
          i++;
          if(i == promises.length){
            resolve(arr);
          };
        };
      for(let i = 0;i < promises.length; i++){
        if(isPromise(promises[i])) {
          promises[i].then(data=>{
            processData(i, data);
          },reject);
          } else {
            processData(i, promises[i]);
          }
      };
    });
  }

    module.exports = Promise;
