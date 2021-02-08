// 移除数组中的相同项
function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index !== -1) {
            return arr.splice(index, 1);
        }
    }
}
// 对象属性继承(浅拷贝)
function extend(target, ...items) {
    for (let i = 0, l = items.length; i < l; i++) {
        Object.keys(items[i]).forEach(k => {
            target[k] = items[i][k]
        })
    }
}

let uid = 0;

class Dep {

    static target = null;

    constructor() {
        this.id = uid++;
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        remove(this.subs, sub)
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    notify() {
        const subs = this.subs.slice();
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

let targetStack = [];

function pushTarget(target) {
    if (Dep.target) {
        targetStack.push(Dep.target)
    }
    Dep.target = target
}

function popTarget(target) {
    Dep.target = targetStack.pop()
}

const state = Object.create(null)

const data = {
    count: 0
}

extend(state, data)

// 初始化 state 为响应式

Object.keys(state).forEach(k => {
    Object.defineProperty(state, k, {
        configurable: true,
        enumerable: true,
        get() {
            
        },
        set(newVal) {
            // 通知更新
            state[k] = newVal
        }
    })
})

