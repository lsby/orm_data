import 'mocha'
import { 对象转关系, 关系转对象, 重命名列, 删除列, 合并列 } from '../src/index'
import * as tools from '@lsby/js_tools'

describe('测试组', function () {
    it('对象转关系', async function () {
        var x1 = 对象转关系([
            {
                a: 1,
                b: [2, 3],
                c: { d: 4, e: [5, 6] },
                f: [
                    { f1: 'a', f2: 'b' },
                    { f1: 'c', f2: 'd' },
                ],
            },
        ])
        tools.断言文本相等(x1, [
            { a: 1, b: 2, d: 4, e: 5, f1: 'a', f2: 'b' },
            { a: 1, b: 2, d: 4, e: 5, f1: 'c', f2: 'd' },
            { a: 1, b: 2, d: 4, e: 6, f1: 'a', f2: 'b' },
            { a: 1, b: 2, d: 4, e: 6, f1: 'c', f2: 'd' },
            { a: 1, b: 3, d: 4, e: 5, f1: 'a', f2: 'b' },
            { a: 1, b: 3, d: 4, e: 5, f1: 'c', f2: 'd' },
            { a: 1, b: 3, d: 4, e: 6, f1: 'a', f2: 'b' },
            { a: 1, b: 3, d: 4, e: 6, f1: 'c', f2: 'd' },
        ])

        var x2 = 对象转关系([{ a: 1, b: { c: 2, d: 3 } }])
        tools.断言文本相等(x2, [{ a: 1, c: 2, d: 3 }])
    })
    it('关系转对象', async function () {
        var x = 关系转对象(
            [
                { id: 1, 姓名: 'a', 标签: 'a1' },
                { id: 1, 姓名: 'a', 标签: 'a2' },
                { id: 1, 姓名: 'b', 标签: 'a3' },
                { id: 2, 姓名: 'b', 标签: 'b1' },
            ],
            'id',
            ['标签'],
        )
        tools.断言文本相等(x, [
            { id: 1, 姓名: 'a', 标签: ['a1', 'a2', 'a3'] },
            { id: 2, 姓名: 'b', 标签: ['b1'] },
        ])

        var x = 关系转对象(
            [
                { id: 1, 姓名: 'a', 标签: 'a1' },
                { id: 1, 姓名: 'a', 标签: null },
                { id: 1, 姓名: 'b', 标签: 'a3' },
                { id: 2, 姓名: 'b', 标签: 'b1' },
            ],
            'id',
            ['标签'],
        )
        tools.断言文本相等(x, [
            { id: 1, 姓名: 'a', 标签: ['a1', null, 'a3'] },
            { id: 2, 姓名: 'b', 标签: ['b1'] },
        ])
    })
    it('重命名列', async function () {
        var x = 重命名列(
            [
                { id: 1, 姓名: 'a', 标签: 'a1' },
                { id: 1, 姓名: 'a', 标签: 'a2' },
                { id: 1, 姓名: 'b', 标签: 'a3' },
                { id: 2, 姓名: 'b', 标签: 'b1' },
            ],
            '姓名',
            '名字',
        )
        tools.断言文本相等(x, [
            { id: 1, 标签: 'a1', 名字: 'a' },
            { id: 1, 标签: 'a2', 名字: 'a' },
            { id: 1, 标签: 'a3', 名字: 'b' },
            { id: 2, 标签: 'b1', 名字: 'b' },
        ])
    })
    it('删除列', async function () {
        var x = 删除列(
            [
                { id: 1, 姓名: 'a', 标签: 'a1' },
                { id: 1, 姓名: 'a', 标签: 'a2' },
                { id: 1, 姓名: 'b', 标签: 'a3' },
                { id: 2, 姓名: 'b', 标签: 'b1' },
            ],
            '标签',
        )
        tools.断言文本相等(x, [
            { id: 1, 姓名: 'a' },
            { id: 1, 姓名: 'a' },
            { id: 1, 姓名: 'b' },
            { id: 2, 姓名: 'b' },
        ])
    })
    it('合并列', async function () {
        var x = 合并列(
            [
                { id: 1, 姓名: 'a', 标签: 'a1' },
                { id: 1, 姓名: 'a', 标签: 'a2' },
                { id: 1, 姓名: 'b', 标签: 'a3' },
                { id: 2, 姓名: 'b', 标签: 'b1' },
            ],
            '合并',
            '姓名',
            '标签',
            (a, b) => a + '_' + b,
        )
        tools.断言文本相等(x, [
            { id: 1, 姓名: 'a', 标签: 'a1', 合并: 'a_a1' },
            { id: 1, 姓名: 'a', 标签: 'a2', 合并: 'a_a2' },
            { id: 1, 姓名: 'b', 标签: 'a3', 合并: 'b_a3' },
            { id: 2, 姓名: 'b', 标签: 'b1', 合并: 'b_b1' },
        ])
    })
})
