import Map from "./Map";

export default class Block {
    private row = 0 // 初始的行
    private col = 4 // 初始的列 ,需要处理为动态的
    private allType = ['S', 'T', 'O', "L", 'J', 'I', 'Z']
    private block = [] // 当前显示的block
    private blockType = require('../blockType.json') // 导入json文件，需要在tsconfig中添加"resolveJsonModule": true
    private canCheck = true // 保证连续按键不会出错
    private target = [] // 记录当前block的其他样式
    private index = 0
    constructor() {
        let typeIndex = (Math.random() * this.allType.length) | 0
        let typeTarget = this.allType[typeIndex]
        this.target = this.blockType[typeTarget]
        this.index = (Math.random() * this.target.length) | 0
        this.block = this.target[this.index]
    }
    // 判读对应位置的方块和地图是否都有不为0的情况
    check(row: number, col: number, map: Map) : boolean {
        if (!this.canCheck) return false
        this.canCheck = false
        let mapCode = map.getMapCode()
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if ((this.block[i][j] !== 0) &&mapCode[i + row][j + col] !== 0) {
                    this.canCheck = true
                    return false
                }
            }
        }
        this.canCheck = true
        return true
    }
    // 判断当前方块是否能下落
    checkDown(map: Map, timer: number) {
        // 预先判断当前方块和地图的位置会不会发生重合
        if (this.check(this.row + 1, this.col, map)) {
            this.row++
            return 0 // 用来判断是否需要重新生成一个block，0不用
        } else {
            // 此时就是不能再往下运动了，需要渲染到地图上
            this.renderMap(map)
            // 判断消行
            let score = map.removeRow()
            // 判断是否结束
            let isOver = this.checkOver(map, timer)
            if (isOver) return 2
            return score || 1
        }
    }
    // 将block渲染到地图上
    renderMap(map: Map) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.block[i][j] !== 0) {
                    map.setMapCode(i + this.row, j + this.col)
                }
            }
        }
    }
    // block的旋转
    blockRotate(map: Map) {
        // 存储旧的下标，以防不能旋转以恢复
        let oldIndex = this.index
        this.index++
        if (this.index >= this.target.length) this.index = 0
        // 换为同一种类的下一个方向
        this.block = this.target[this.index]
        if (!this.check(this.row, this.col, map)) {
            this.block = this.target[oldIndex]
        }
    }
    // 检测是否能往左移动
    checkLeft(map: Map) {
        if (!this.canCheck) return
        if (this.check(this.row, this.col - 1, map)) {
            this.col--
        }
    }
    // 检测是否能往右移动
    checkRight(map: Map) {
        if (!this.canCheck) return
        if (this.check(this.row, this.col + 1, map)) {
            this.col++
        }
    }
    // 检测是否能立马到底底部
    checkToEnd(map: Map) {
        while(this.check(this.row + 1, this.col, map)) {
            this.row++
        }
    }
    // 检测是否结束
    checkOver(map: Map, timer: number) {
        let mapCode = map.getMapCode()
        if (mapCode[0].indexOf(2) !== -1) {
            return true
        }
        return false
    }

}
