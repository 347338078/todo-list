var log = function() {
    console.log.apply(console, arguments)
}


var e = function(selector) {
    return document.querySelector(selector)
}

// 这个函数用来开关一个元素的某个 class
var toggleClass = function(element, className) {
    // 检查元素是否拥有某个 classs
    if (element.classList.contains(className)) {
        // 拥有则删除之
        element.classList.remove(className)
    } else {
        // 没有则加上
        element.classList.add(className)
    }
}

// 给 add button 绑定添加 todo 事件
var addButtons = function() {
    var addButton = e('#id-button-add')
    addButton.addEventListener('click', function(){
        // 获得 input.value
        var todoInput = e('#id-input-todo')
        var todo = todoInput.value
        // 添加到 container 中
        var input = e('#id-input-todo')
        input.value = ''
        insertTodo(todo, false, now())
        // 添加之后 保存 todos
        saveTodos()
    })
}

var insertTodo = function(todo, done, nows) {
    // 添加到 container 中
    var todoContainer = e('#id-div-container')
    var t = templateTodo(todo, done, nows)
    // 这个方法用来添加元素
    // 第一个参数 'beforeend' 意思是放在最后
    todoContainer.insertAdjacentHTML('beforeend', t);
}
// 当前时间的格式转换
var now = function() {
    var d = new Date()
    var nm = d.getFullYear()
    var yt = d.getMonth() + 1
    var day = d.getDate()
    var hr = d.getHours()
    var min = d.getMinutes()
    var s = d.getSeconds()
    if (String(yt).length == 1) {
        yt = '0' + yt
    }
    if (String(day).length == 1) {
        day = '0' + day
    }
    if (String(hr).length == 1) {
        hr = '0' + hr
    }
    if (String(min).length == 1) {
        min = '0' + min
    }
    if (String(s).length == 1) {
        s = '0' + s
    }
    return `${nm}/${yt}/${day} ${hr}:${min}:${s}`
}
// 添加 HTML 文件
var templateTodo = function(todo, done, nows) {
    var status = ''
    //默认为 待办 状态
    var finish = '待办'
    // 如果 done 为 true，则说明这条 todo 是已完成状态
    if(done) {
        //就加上 'done'
        status = 'done'
        //把描述改成'完成'
        finish = '完成'
    }
    var t = `
        <div class='todo-cell ${status}'>
            <button class='todo-done'>${finish}</button>
            <button class='todo-delete'>删除</button>
            <span class='todo-content' contenteditable='true'>${todo}</span>
            <span class='now-time'>${nows}</span>
        </div>
    `
    return t
}



// 完成 删除 按钮
var toggleButton = function () {
    var todoContainer = e('#id-div-container')
    todoContainer.addEventListener('click', function(event){
        // log('container click', event, event.target)
        var target = event.target
        // classList.contains 检查元素是否有一个 class
        if(target.classList.contains('todo-done')) {
            // log('done')
            // 给 todo div 开关一个状态 class
            var finish = document.querySelectorAll('.todo-done')
            var targets = event.target
            if (targets.innerHTML == '完成') {
                targets.innerHTML = '待办'
            }else {
                targets.innerHTML = '完成'
            }
            var todoDiv = target.parentElement
            toggleClass(todoDiv, 'done')
            // 改变 todo 完成状态之后，保存 todos
            saveTodos()
        } else if (target.classList.contains('todo-delete')) {
            // 弹出提示框
            var msg = "您真的确定要删除吗？\n\n请确认！";
            if (confirm(msg)==true){
                // 找到按钮的父节点并且删除
                var todoDiv = target.parentElement
                todoDiv.remove()
                // 删除之后 保存 todos
                saveTodos()
            }
        }
    })
}


// 定义一个函数，把 数组 写入 localStorage
var save = function(array) {
    var s = JSON.stringify(array)
    localStorage.todos = s
}

// 定义一个函数， 读取 localStorage 中的数据并解析返回
var load = function() {
    var s = localStorage.todos
    return JSON.parse(s)
}

//所有的 todo 用 save 保存
var saveTodos = function() {
    // 选出所有的 content
    var contents = document.querySelectorAll('.todo-content')
    // 选出所有的 time
    var now = document.querySelectorAll('.now-time')
    var todos = []
    for (var i = 0; i < contents.length; i++) {
        var c = contents[i]
        var done = c.parentElement.classList.contains('done')
        var nowTime = now[i]
        var todo = {
            done: done,
            content: c.innerHTML,
            time: nowTime.innerHTML,
        }
        // 添加到数组中
        todos.push(todo)
    }
    // 保存数组
    save(todos)
}

var loadTodos = function() {
    var todos = load()
    // log('load todos', todos)
    // 添加到页面中
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        insertTodo(todo.content, todo.done, todo.time)
    }
}

var main_ = function() {
    loadTodos()
    toggleButton()
    addButtons()
}

main_()
