// 刷新页面不会丢失数据，因此需要用到本地存储localStorage
// 核心思路：不管按下回车，还是点击复选框，都是把本地存储的数据加载到页面中，这样保证刷新关闭页面不会丢失数据
// 存储的数据格式：var todolist = [{title:'xxx',done:false}]
// 本地存储里面只能存储字符串的数据格式 把我们的数组对象转换成字符串格式 JSON.stringify()
// 存 localStorage.setItem('title',JSON.stringify(todolist))
// 把我们的字符串格式转换成数组对象显示 JSON.parse()
// 取 JSON.parse(localStorage.getItem('title'));


// 一、按下回车把新数据添加到本地存储 keyCode 13
// 1. 获取本地存储数据（getData()）
// 2. 追加数据
// 3. 存到本地存储 （saveData()）

// 二、本地存储数据渲染到页面中
// 1. 声明函数（load()）
// 2. 获取本地存储数据（getData()）
// 3. 遍历数据（$.each()）,有几条数据，就生成几个li 添加到ol

// 三、删除操作
// 1. 点击删除本地存储对应数据
// 2. 核心原理：先获取本地存储数据，删除对应的数据，保存给本地存储，重新渲染列表li
// 3. 给每个 a 记录自定义索引号
// 4. 根据索引号删除相关数据---数组的splice(i,1) 方法
// 5. 存储修改后的数据，然后存储给本地存储
// 6. 重新渲染加载数据列表
// 7. 因为 a 是动态创建的，我们使用on方法绑定事件

// 四、正在进行和已完成选项操作
// 1. 当我们点击了小的复选框，修改本地存储数据，再重新渲染数据列表
// 2. 点击之后，获取本地存储数据
// 3. 修改对应属性done 为当前复选框的checked 状态

// 五、统计正在进行个数和已经完成个数
// 1. 在load函数里面操作
// 2. 声明2个变量：todoCount代办个数 doneCount已完成个数
// 3. 当进行遍历本地存储数据的时候，如果数据done为false，则todeCount++，否则doneCount++
// 4. 最后修改相应的元素text()

$(function () {
  load()
  $('#title').on('keydown', function (e) {
    if (e.keyCode === 13) {
      if ($(this).val() === '') { alert('请输入待办事项') }
      else {
        // 读取数据
        var local = getData()
        // 把 local 数组进行更新数据 
        local.push({ title: $(this).val(), done: false })
        // 存到本地存储
        saveData(local)
        load()
      }
    }
  });


  // 读取本地存储数据
  function getData() {
    var data = localStorage.getItem('todolist')
    if (data !== null) {
      // 本地存储里面的数据是字符串 转换成对象
      return JSON.parse(data);
    }
    else {
      return []
    }
  };

  // 保存到本地存储
  function saveData(data) {
    localStorage.setItem('todolist', JSON.stringify(data))
  };

  // 渲染加载页面
  function load() {
    var todoCount = 0
    var doneCount = 0
    $('ol,ul').empty()
    var data = getData()
    $.each(data, function (i, n) {
      var li = "<li><input type='checkbox' name='' id=''><p>" + n.title + "</p><a href='#' id=" + i + ">×</a></li>"
      if (n.done) {
        doneCount++
        $('ul').prepend("<li><input type='checkbox' checked><p>" + n.title + "</p><a href='#' id=" + i + ">×</a></li>")
      }
      else {
        todoCount++
        $('ol').prepend(li)
      }
    })
    $('#todocount').text(todoCount)
    $('#donecount').text(doneCount)
  };

  // 删除操作
  $('ol,ul').on('click', 'a', function () {
    //获取本地存储
    var data = getData()
    //修改数据
    var index = $(this).attr('id')
    console.log(index);
    data.splice(index, 1)
    //保存到本地存储
    saveData(data)
    //重新渲染页面
    load()
  })

  //正在进行和已完成切换
  $("ol,ul").on('click', 'input', function () {
    //先获取本地存储的数据
    var data = getData()
    //修改数据
    var index = $(this).siblings('a').attr('id')
    data[index].done = $(this).prop('checked')
    //保存到本地存储
    saveData(data)
    //重新渲染
    load()
  })
})