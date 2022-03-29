import { 取对象键值们, 后继数 } from '@lsby/ts_type_fun'

/*
需要输入一个数组, 数组内的每一项都是一个对象.
对每一个对象递归进行如下变换:
- 值为基础值的, 不变
- 值为数组的, 拆分为前缀+索引
- 值为对象的, 删除key, 将值直接解开

例如:

输入:
[
    { a: 1, b: [2, 3], c: { d: 4, e: [5, "6"] } }
]
得到:
[
    { a: 1, b_0: 2, b_1: 3, d: 4, e_0: 5, e_1: "6" }
]

不幸的是, 由于ts不给面子, 传入的数组不会被解析为元组, 如果你的数据中有数组, 则需要手动标注传入数据的类型:

```
var x = 对象转关系<{ a: number; b: [number, number]; c: { d: number; e: [number, string] } }>([
    { a: 1, b: [2, 3], c: { d: 4, e: [5, '6'] } },
])
```
*/

export default function 对象转关系<a>(数组对象: a[]) {
    return 数组对象.map((a) => _对象转关系(a))
}
function _对象转关系<a>(对象: a): 计算类型<a> {
    var 元素们 = Object.values(对象)
    var 基础元素 = 元素们.filter((a) => typeof a != 'object')
    if (元素们.length == 基础元素.length) {
        return 对象 as any
    }

    var r: any = {}

    for (var n in 对象) {
        var item = 对象[n]
        if (typeof item != 'object') {
            r[n] = item
            continue
        }
        if (Array.isArray(item)) {
            for (var i = 0; i < item.length; i++) {
                r[`${n}_${i}`] = item[i]
            }
            continue
        }
        for (var nn in item) {
            r[nn] = item[nn]
            continue
        }
    }

    return _对象转关系(r)
}

type 计算类型<对象> = _计算类型<取对象键值们<对象>>
type _计算类型<对象键值们> = 对象键值们 extends []
    ? {}
    : 对象键值们 extends [infer a, ...infer as]
    ? a extends [`${infer key}`, infer value]
        ? value extends any[]
            ? 计算类型<计算数组<value, key> & _计算类型<as>>
            : value extends Record<any, any>
            ? 计算类型<value & _计算类型<as>>
            : Record<key, value> & _计算类型<as>
        : never
    : never
type 计算数组<数组, 前缀, 索引 extends string = '0'> = 前缀 extends `${infer k}`
    ? 数组 extends []
        ? {}
        : 数组 extends [infer a, ...infer as]
        ? `${k}_${索引}` extends infer key
            ? key extends string
                ? Record<key, a> & 计算数组<as, 前缀, 后继数<索引>>
                : never
            : never
        : never
    : never
