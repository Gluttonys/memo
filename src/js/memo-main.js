class Memo {

  constructor() {
    // 获取 dom 元素
    this.memo = document.getElementById("memo")
    // 初始化 memo
    this.memo.innerHTML = `<div class="content no-select"><div class="input"><p>&nbsp;&nbsp;勿忘</p>
      <input type="text" placeholder=": )" autocomplete="off"/></div><div class="items scrollbar"></div>
      <img class="img" src="./src/img/webp.webp" alt="">
    <footer class="footer"><div class="btn-current" id="all">全部</div><div id="done">已完成</div><div id="undone">未完成</div></footer></div>`

    this.input = this.memo.querySelector(".input input")
    this.itemList = this.memo.querySelector(".items")

    this.btnAll = this.memo.querySelector("#all")
    this.btnDone = this.memo.querySelector("#done")
    this.btnUndone = this.memo.querySelector("#undone")

    this.img = this.memo.querySelector(".img")

    this.initConst()
    // 清理过期且完成的备忘
    Memo.purgeExpired()
    this.initStorage(this.BTN_ALL)
    this.initInputEvent()
    this.initBtnEvent()
  }

  static getNowDate() {
    let now = new Date()
    let year = now.getFullYear()
    let month = (now.getMonth() + 1).toString().padStart(2, "0")
    let day = now.getDate().toString().padStart(2, "0")
    let hour = now.getHours().toString().padStart(2, "0")

    return `${year}-${month}-${day} ${hour}H`
  }

  static getCurrentStyle(eleList, target, style) {
    /**
     * 为一组元素中的某一个添加指定样式， 其余去除
     */
    for (let ele of eleList) {
      ele.classList.remove(style)
      if (ele === target) {
        ele.classList.add(style)
      }
    }
  }

  initConst() {
    /**
     * 声明常量
     * @type {string}
     */

    // 备注条
    this.ITEM = `<div class="check"></div><div class="main"><p class="time">{{date}}</p><p class="article">{{content}}</p></div>`

    // 按钮状态
    this.BTN_ALL = "ALL"
    this.BTN_DONE = "DONE"
    this.BTN_UNDONE = "UNDONE"

    // 按钮列表
    this.BTN_LIST = [this.btnAll, this.btnDone, this.btnUndone]

    // 输入框当前值
    this.CURRENT_VALUE = ""

    // 按钮激活样式
    this.CURRENT_BTN_STYLE = "btn-current"
  }

  initStorage(type) {
    /**
     * type 指定筛选类型。 默认 all
     * type :  all
     *      :  done
     *      :  undone
     */
    this.itemList.innerHTML = ""

    for (let localStorageKey in localStorage) {
      // 控制是否生成备忘录对象标志
      let isEnter = false
      if (localStorageKey.startsWith("memo#")) {

        if (type === this.BTN_ALL || type === undefined) {
          isEnter = true
        } else if (type === this.BTN_DONE && localStorageKey.endsWith("fin")) {
          isEnter = true
        } else if (type === this.BTN_UNDONE && !localStorageKey.endsWith("fin")) {
          isEnter = true
        }

        if (isEnter) {
          let template = this.getItem(localStorageKey.slice(5, 19), localStorage[localStorageKey])

          this.itemList.insertAdjacentElement("afterbegin", template)
          this.initEvent(template, localStorageKey)

          if (localStorageKey.endsWith("fin")) {
            template.querySelector(".main").classList.add("finished")
            template.querySelector(".check").innerHTML = "<span>✓</span>"
          }
        }
      }
    }

    this.getImg()
  }

  initInputEvent() {
    let that = this
    // change 事件 绑定input值
    this.input.addEventListener("change", () => {
      this.CURRENT_VALUE = this.input.value

    }, false)

    // 提交事件
    this.input.addEventListener("keyup", (event) => {
      // 13 enter 键
      if (event.which === 13) {
        if (this.input.value.trim() === "") return false

        // 生成一个 item dom
        let template = this.getItem(Memo.getNowDate(), this.CURRENT_VALUE)
        // 添加到页面上
        this.itemList.insertAdjacentElement("afterbegin", template)

        // 收尾工作
        // 1 : 清空文本框
        this.input.value = ""
        // 2 ： 添加到localStorage
        // memo#2020-05-30 18H#0.60982805
        let storageKey = `memo#${Memo.getNowDate()}#${Math.random().toFixed(8)}`
        localStorage.setItem(storageKey, this.CURRENT_VALUE)

        this.initEvent(template, storageKey)
      }
      that.getImg()
    }, false)

  }

  initEvent(dom, key) {
    /**
     * 为每个item添加事件
     * @type {Element | any}
     */
    let main = dom.querySelector(".main")
    let article = dom.getElementsByClassName("article")[0]
    let checkBox = dom.querySelector(".check")
    let value = localStorage.getItem(key)
    let current_key = key

    // 修改内容的双击事件
    function changeText() {
      let old_content = article.innerText
      article.innerHTML = ""
      let input = document.createElement("textarea")
      input.classList.add("input_temporary")
      input.classList.add("scrollbar")
      input.value = old_content
      main.insertAdjacentElement("beforeend", input)
      input.focus()

      input.addEventListener("blur", () => {
        if (input.value.trim() === "") {
          article.innerText = old_content
        } else {
          article.innerText = input.value
        }
        localStorage.setItem(current_key, article.innerText)
        input.remove()
      }, false)

      input.addEventListener("keyup", (event) => {
        if (event.which === 13) input.blur()
      }, false)
    }

    // 如果是已完成的就不添加双击修改事件
    if (!current_key.endsWith("fin")) {
      article.addEventListener("dblclick", changeText)
    }

    // 給选择框添加单机事件
    checkBox.addEventListener("click", function () {

      localStorage.removeItem(current_key)

      if (current_key.endsWith("fin")) {
        current_key = current_key.slice(0, -3)
        this.innerHTML = ""
        main.classList.remove("finished")
        article.addEventListener("dblclick", changeText)
      } else {
        current_key += "fin"
        this.innerHTML = "<span>✓</span>"
        main.classList.add("finished")
        // 移除修改事件
        article.removeEventListener("dblclick", changeText)
      }

      localStorage.setItem(current_key, value)

    }, checkBox)

  }

  initBtnEvent() {
    let that = this
    this.btnAll.addEventListener("click", function () {
      that.initStorage(that.BTN_ALL)

      Memo.getCurrentStyle(that.BTN_LIST, that.btnAll, that.CURRENT_BTN_STYLE)
    })

    this.btnDone.addEventListener("click", function () {
      that.initStorage(that.BTN_DONE)
      Memo.getCurrentStyle(that.BTN_LIST, that.btnDone, that.CURRENT_BTN_STYLE)
    })

    this.btnUndone.addEventListener("click", function () {
      that.initStorage(that.BTN_UNDONE)
      Memo.getCurrentStyle(that.BTN_LIST, that.btnUndone, that.CURRENT_BTN_STYLE)
    })

  }

  getItem(time, content) {
    let item = document.createElement("div")
    item.classList.add("item")
    item.innerHTML = this.ITEM.replace("{{date}}", time).replace("{{content}}", content)
    return item
  }

  getImg() {
    if (this.itemList.innerHTML === "") {
      this.img.style.display = "block"
    } else {
      this.img.style.display = "none"
    }
  }

  // 清除过期完成备忘录
  static purgeExpired() {
    for (let localStorageKey in localStorage) {
     if (localStorageKey.startsWith("memo#") && localStorageKey.endsWith("fin")) {
       let today = Memo.getNowDate().slice(0, 10)
       if (today !== localStorageKey.slice(5, 15)) {
         localStorage.removeItem(localStorageKey)
       }
     }
    }
  }
}

new Memo()
