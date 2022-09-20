function dynamicImport(url) {
  // 会返回一个promise
  return new Promise((resolve, reject) => {
    // 创建一个script标签
    const script = document.createElement("script");

    // 临时的全局名称
    const tempGlobalName = `__tempModuleLoading__${(Math.random() * 10000000) | 0}`;
    // 定义临时的全局名称
    const tempGlobalFn = `__tempReqFn__${(Math.random() * 10000000) | 0}`
    // 给window上添加属性
    window[tempGlobalFn] = null;

    // 将类型修改为module
    script.type = "module";
    // 总共执行三步：1. 使用import语法导入模块 2. 将导入的内容挂在到全局上 3. 执行成功后调用回调方法
    script.textContent = `import * as m from "${url}"; window.${tempGlobalName} = m; window.${tempGlobalFn}();`

    // 成功的回调
    window[tempGlobalFn] = function () {
      resolve(window[tempGlobalName]);
      delete window[tempGlobalName];
      delete window[tempGlobalFn];
      script.remove();
    }

    function errorFn() {
      reject(new Error("Failed to load module script with URL " + url))
      delete window[tempGlobalName];
      script.remove();
    }

    try {
      document.documentElement.appendChild(script);
    } catch (e) {
      errorFn();
    }
  })
}