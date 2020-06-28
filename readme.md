网页备忘录第三代
---
> 相较于第二代
>   - 新增加了三个功能按钮， 查看全部， 查看完成， 查看未完成， 以为工具栏
>   - 已经完成的备忘保质期仅为当天， 当天过后自动消除
>   - 优化了界面，现在界面体验良好
>   - 双击文字可修改内容
>   - 删除了生产环境下的压缩文件
>       - [CSS在线压缩网站](https://www.zhangxinxu.com/sp/css-compress-mini.html)   
>       - [JS在线压缩网站](http://javascriptcompressor.com/)

- 使用
    - css
    ~~~html
      <link rel="stylesheet" href="your/path/memo-style.css">
    ~~~
    - js
    ~~~html
      <script src="./js/memo-main.js"></script>
      
      // 接下来的代码依赖上面的文件， 请务必放在其下面
      <script>
        new Memo({
            height: 500,
            themeColor: "#ad1457",
            background: "#ffffff",
            github: false,
            imgPlaceholder: "./src/img/webp.webp"
          })
      </script>
    ~~~
    - html
    ~~~html
      <div id="memo"></div>
    ~~~

- 自定义样式
    
    引入需要的文件之后，可以根据情况做一些简单的自定义
    ```javascript
      new Memo({
          height: 500,
          themeColor: "#ad1457",
          background: "#ffffff",
          github: false,
          imgPlaceholder: "./src/img/webp.webp"
      })
    ```
    
    以下就是各个参数的解释
    
    |参数|默认值|类型|解释|
    |-|-|-|-|
    |height|500|Number|备忘录的整体高度|
    |themeColor|#ec407a|String|备忘录的整体颜色风格|
    |background|#ffffff|String|背景颜色， 默认是白色的|
    |github|true|Boolean|是否在工具栏内链接到github|
    |imgPlaceholder|""|String|当没有备忘录的时候的占位图片|
