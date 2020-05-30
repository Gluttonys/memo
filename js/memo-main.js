class Memo {

  constructor() {
    // 获取 dom 元素
    this.memo = document.getElementById("memo")
    // 初始化 memo
    this.memo.innerHTML = `<span class="logo">勿忘</span><div class="content content_hide no-select"><div class="input">
          <input type="text" placeholder="使用Enter嵌入" autocomplete="off"></div><div class="items scrollbar"></div></div>`

    this.content = this.memo.getElementsByClassName("content")[0]
    this.input = this.memo.querySelector(".input input")
    this.item_list = this.memo.querySelector(".items")
    this.current_value = ""

    this.initAnimation()
    this.initConst()
    this.initStorage()
    this.initInputEvent()
  }

  initAnimation() {
    /**
     * 初始化动画
     */
    this.memo.addEventListener("mouseenter", () => {
      this.content.style.display = "block"
    }, false)

    this.memo.addEventListener("mouseleave", () => {
      this.content.style.display = "none"
    }, false)

  }

  initConst() {
    /**
     * 声明常量
     * @type {string}
     */
    this.ITEM = `<div class="main"><p>{{date}}</p>
          <p class="article">{{content}}</p></div><div class="hide-part">
          <span class="fin-save" title="完成并保留">☀</span><span class="fin-del" title="完成并删除">❌</span></div>`
  }

  static getNowDate() {
    let now = new Date()
    let year = now.getFullYear()
    let month = (now.getMonth() + 1).toString().padStart(2, "0")
    let day = now.getDate().toString().padStart(2, "0")
    let hour = now.getHours().toString().padStart(2, "0")

    return `${year}-${month}-${day} ${hour}H`
  }

  initStorage() {
    for (let localStorageKey in localStorage) {
      if (localStorageKey.startsWith("memo#")) {
        let template = this.getItem(localStorageKey.slice(5, 19), localStorage[localStorageKey])
        this.item_list.insertAdjacentElement("afterbegin", template)

        if (localStorageKey.endsWith("fin")) template.classList.add("finished")

        this.initEvent(template, localStorageKey)
      }
    }
  }

  initInputEvent() {

    // change 事件 绑定input值
    this.input.addEventListener("change", () => {
      this.current_value = this.input.value
    }, false)

    // 提交事件
    this.input.addEventListener("keyup", (event) => {
      // 13 enter 键
      if (event.which === 13) {
        if (this.input.value.trim() === "") return false

        // 生成一个 item dom
        let template = this.getItem(Memo.getNowDate(), this.current_value)
        // 添加到页面上
        this.item_list.insertAdjacentElement("afterbegin", template)

        // 收尾工作
        // 1 : 清空文本框
        this.input.value = ""
        // 2 ： 添加到localStorage
        // memo#2020-05-30 18H#0.60982805
        let storageKey = `memo#${Memo.getNowDate()}#${Math.random().toFixed(8)}`
        localStorage.setItem(storageKey, this.current_value)

        this.initEvent(template, storageKey)
      }
    }, false)

  }

  initEvent(dom, key) {
    /**
     * 为每个item添加事件
     * @type {Element | any}
     */
    let finish_save_icon = dom.querySelector(".fin-save")
    let finish_del_icon = dom.querySelector(".fin-del")
    let main = dom.querySelector(".main")
    let article = dom.getElementsByClassName("article")[0]

    let value = localStorage.getItem(key)
    let current_key = key

    finish_save_icon.addEventListener("click", () => {
      localStorage.removeItem(current_key)

      if (current_key.endsWith("fin")) {
        current_key = current_key.slice(0, -3)
        dom.classList.remove("finished")
      } else {
        current_key += "fin"
        dom.classList.add("finished")
      }

      localStorage.setItem(current_key, value)
    }, false)

    finish_del_icon.addEventListener("click", () => {
      dom.remove()
      localStorage.removeItem(key)
    }, false)

    article.addEventListener("dblclick", () => {
      let old_content = article.innerText
      article.innerHTML = ""
      let input = document.createElement("input")
      input.classList.add("input_temporary")
      input.value = old_content
      main.insertAdjacentElement("beforeend", input)
      input.focus()

      input.addEventListener("blur", () => {
        if (input.value.trim() === "") {
          article.innerText = old_content
        } else {
          article.innerText = input.value
        }
        input.remove()
      }, false)

      input.addEventListener("keyup", (event) => {
        if (event.which === 13) input.blur()
      }, false)

    }, false)
  }

  getItem(time, content) {
    let item = document.createElement("div")
    item.classList.add("item")
    item.innerHTML = this.ITEM.replace("{{date}}", time).replace("{{content}}", content)
    return item
  }

}

new Memo()

