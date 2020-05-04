// DOM树渲染完成后就立马执行， 不必等待css, 图片资源
document.addEventListener("DOMContentLoaded", function () {

    // 获取整个备忘录外边框
    let frame = document.querySelector(".memo");

    // 初始化输入框代码框
    frame.innerHTML = `<form action="#" method="get" class="input-box">
                            <input type="text" minlength="2" maxlength="20" placeholder="勿忘">
                            <button type="submit">👆</button>
                        </form>
                        <div class="line"></div>
                        <div class="items scrollbar"></div>`;

    const itemTemplate = `<div class="item-title">
                              <div class="title-left">{{datetime}}</div>
                              <div class="title-right"><span class='fin' title='完成'>✅</span>
                              <span class='del' title='删除'>❎</span></div>
                          </div>
                          <div class="item-body {{finish}}">{{value}}</div>`;

    // 获取输入框
    let form = frame.getElementsByTagName("form")[0];
    let values = frame.getElementsByClassName("value");

    function retItem(value, time, isFinish) {
        /**
         * 通过内容和给定的时间创造一个item节点
         * value : item的值， 也就是备忘录内容
         * time : 备忘录的时间
         * isFinish : 是否完成， 显示的样式不同
         */
        let template = itemTemplate;
        if (value) {
            template = template.replace(/{{datetime}}/, time).replace(/{{value}}/g, value);
            template = isFinish ? template.replace("{{finish}}", "finish") : template.replace("{{finish}}", "");

            // 创建外壳
            let wrapper = document.createElement("div");
            wrapper.innerHTML = template;
            wrapper.classList.add("item");
            wrapper.title = value;

            return wrapper
        } else {
            return null
        }
    }

    function getTime() {
        /**
         * 返回一个可视时间
         * @type {Date} : 2020-05-04 10
         */
        // 创建可读的当前时间
        let now = new Date();
        let year = now.getFullYear();
        let month = (now.getMonth() + 1).toString().padStart(2, "0");
        let day = now.getDate().toString().padStart(2, "0");
        let hour = now.getHours().toString().padStart(2, "0");

        return `${year}-${month}-${day} ${hour}H`
    }

    function putItem(inputValue, time, isCookie, key) {
        /**
         * 绑定事件 + 把 item 放到页面上
         * @type {Node}
         * inputValue : item的具体内容
         * time : item的时间
         * isCookie : 是否是从cookie那里拿的item
         * Key : cookie 的 key -->  "memo-2020-4-23 17H2262"
         */

        const itemsBox = frame.getElementsByClassName("items")[0];

        let item = retItem(inputValue, time, false);
        if (key.indexOf("finish") > 0) {
            item = retItem(inputValue, time, true);
        }

        // 将创建的元素添加到页面
        itemsBox.appendChild(item);

        // 设置cookie
        let cookieKey = "memo-" + time + Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100);
        if (!isCookie) {
            // not cookie
            setCookie(cookieKey, inputValue, 7);
        } else {
            // cookie
            cookieKey = key;
        }

        // 给item的删除按钮绑定事件 ❎
        let del = item.getElementsByClassName("del")[0];
        del.addEventListener("click", function () {
            item.remove();
            // 删除对应cookie
            deleCookie(cookieKey);
        }, false);

        // 给item的对号按钮绑定事件 ✅
        let finish = item.getElementsByClassName("fin")[0];
        finish.addEventListener("click", function () {
            let wrapperClassList = item.getElementsByClassName("item-body")[0].classList;
            if (wrapperClassList.length > 1) {
                wrapperClassList.remove("finish");
                cookieKey = cookieKey.replace("finish", "");
                deleCookie(cookieKey + "finish");
                setCookie(cookieKey, inputValue, 3);
            } else {
                wrapperClassList.add("finish");
                deleCookie(cookieKey);
                setCookie(cookieKey + "finish", inputValue, 3)
            }
        });

        // 给item的内容部分添加双击事件
        const itemBody = item.getElementsByClassName("item-body")[0];
        // 如果完成了 就不能改动了
        if (itemBody.className.indexOf("finish") < 0) {
            itemBody.addEventListener("dblclick", function () {
                const oldValue = itemBody.innerText;
                itemBody.innerText = "";

                const input = document.createElement("input");
                input.value = oldValue;
                input.className = "input";
                itemBody.appendChild(input);
                input.focus();

                input.addEventListener("blur", function () {
                    let newValue = input.value.trim();
                    if (newValue === "") {
                        itemBody.innerText = oldValue;
                    } else {
                        itemBody.innerText = newValue;
                        alterCookie(key, newValue, 7);
                    }
                    input.remove();
                });
                input.addEventListener("keydown", function (event) {
                    if (event.keyCode === 13) input.blur();
                })
            })
        }
    }

    function cleanCookie() {
        const cookieObj = getCookieObg();
        const prefix = "memo-";
        let result = {};
        for (let prop in cookieObj) {
            if (cookieObj.hasOwnProperty(prop)) {
                if (prop.slice(0, 5) === prefix)
                    result[prop] = cookieObj[prop];
            }
        }
        return result;
    }

    (function () {
        // 查 cookie , 把cookie中的值拿出来， 如果有的话(清洗cookie数据)
        let cleaned = cleanCookie();
        for (let key in cleaned) {
            // key : memo-2020-4-23 17H931
            if (cleaned.hasOwnProperty(key)) {
                putItem(cleaned[key], key.slice(5, 19), true, key)
            }
        }
    }());

    function initMemo() {
        /**
         * 新增一个备忘录词条
         */
        let input = form.getElementsByTagName("input")[0];
        // 去除首位空格
        let inputValue = input.value.trim();

        // 如果没有输入值， 则直接退出
        if (!inputValue) return;

        putItem(inputValue, getTime(), false, "");
        // 清空文本框
        input.value = "";
    }

    // form提交事件
    form.addEventListener("submit", function () {
        initMemo();
    }, false);


}, false);
