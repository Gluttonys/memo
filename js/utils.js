function setCookie(key, value, date) {
    /**
     * key【string】 : 用于生成cookie的键
     * value 【string】: 用于生成cookie的值
     * date 【Number】: cookie保留时间
     * return : Boolean
     */
    const range = date || 7;
    const day = new Date();
    day.setDate(day.getDate() + range);
    document.cookie = key + "=" + value + ";expires=" + day;
}

// 修改cookie
function alterCookie(key, value, date) {
    setCookie(key, value, date);
}

// 删除cookie
function deleCookie(key) {
    setCookie(key, "1", -1);
}

// 查看cookie对象
function getCookieObg() {
    let cookies = document.cookie.split("; ");
    let obj = {};
    for (let i = 0; i < cookies.length; i++) {
        let keyValue = cookies[i].split("=");
        obj[keyValue[0]] = keyValue[1];
    }
    return obj;
}

// 查看具体的某个cookie值
function getCookie(key) {
    return getCookieObg()[key];
}

// 去除字符串两端空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
