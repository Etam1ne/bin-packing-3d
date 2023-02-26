const rotationType = {
    RT_WHD: 0,
    RT_HWD: 1,
    RT_HDW: 2,
    RT_DHW: 3,
    RT_DWH: 4,
    RT_WDH: 5,
}
rotationType.ALL = [
    rotationType.RT_WHD, 
    rotationType.RT_HWD, 
    rotationType.RT_HDW, 
    rotationType.RT_DHW, 
    rotationType.RT_DWH, 
    rotationType.RT_WDH
]

const axis = {
    WIDTH: 0,
    HEIGHT: 1,
    DEPTH: 2,

}
axis.ALL = [axis.WIDTH, axis.HEIGHT, axis.DEPTH]

const START_POSITION = [0, 0, 0];

function rect_intersect(item1, item2, x, y) {
    let d1 = item1.get_dimension()
    let d2 = item2.get_dimension()

    let cx1 = item1.position[x] + d1[x]/2
    let cy1 = item1.position[y] + d1[y]/2
    let cx2 = item2.position[x] + d2[x]/2
    let cy2 = item2.position[y] + d2[y]/2

    let ix = Math.max(cx1, cx2) - Math.min(cx1, cx2)
    let iy = Math.max(cy1, cy2) - Math.min(cy1, cy2)

    return ix < (d1[x]+d2[x])/2 && iy < (d1[y]+d2[y])/2
}

function intersect(item1, item2) {
    return (
        rect_intersect(item1, item2, axis.WIDTH, axis.HEIGHT) &&
        rect_intersect(item1, item2, axis.HEIGHT, axis.DEPTH) &&
        rect_intersect(item1, item2, axis.WIDTH, axis.DEPTH)
    )
}

class Item {
    name;
    width;
    height;
    depth;
    weight;
    rotation_type;
    position;
    constructor(name, width, height, depth, weight) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.weight = weight;
        this.rotation_type = 0;
        this.position = START_POSITION;
    }

    get_volume() {
        return this.width * this.height * this.depth
    }

    get_dimension() {
        switch (this.rotation_type) {
            case rotationType.RT_WHD:
                return [this.width, this.height, this.depth]
            
            case rotationType.RT_HWD:
                return [this.height, this.width, this.depth]
            
            case rotationType.RT_HDW:
                return [this.height, this.depth, this.width]

            case rotationType.RT_DHW:
                return [this.depth, this.height, this.width]
            
            case rotationType.RT_DWH:
                return [this.depth, this.width, this.height]
            
            case rotationType.RT_WDH:
                return [this.width, this.depth, this.height]
            
            default:
                return []
        }
    }
}

class Bin {
    name;
    width;
    height;
    depth;
    max_weight;
    constructor(name, width, height, depth, max_weight) {
        this.name = name
        this.width = width
        this.height = height
        this.depth = depth
        this.max_weight = max_weight
        this.items = []
        this.unfitted_items = []
    }

    get_volume() {
        return this.width * this.height * this.depth
    }

    get_total_weight() {
        let total_weight = 0

        for (let i = 0; i < this.items.length; i++) {
            total_weight += this.items[i].weight
        }

        return total_weight
    }

    put_item(item, pivot) {
        let fit = false
        let valid_item_position = item.position
        item.position = pivot

        for (let i = 0; i < rotationType.ALL.length; i++) {
            item.rotation_type = rotationType.ALL[i]
            let dimension = item.get_dimension()

            if (
                this.width < pivot[0] + dimension[0] ||
                this.height < pivot[1] + dimension[1] ||
                this.depth < pivot[2] + dimension[2]
            ) {
                continue
            }

            fit = true

            for (let j = 0; j < this.items.length; j++) {
                if (intersect(this.items[j], item)) {
                    fit = false
                    break
                }
            }

            if (fit) {
                if (this.get_total_weight() + item.weight > this.max_weight) {
                    fit = false
                    return fit
                }
                this.items.push(item)
            }
            else {
                item.position = valid_item_position
            }

            return fit
        }

        if (fit !== true) {
            item.position = valid_item_position
        }

        return fit
    }
}

class Packer {
    bins
    items
    unfit_items
    total_items
    constructor() {
        this.bins = []
        this.items = []
        this.unfit_items = []
        this.total_items = 0
    }

    add_bin(bin) {
        return this.bins.push(bin)
    }

    add_item(item) {
        this.total_items = this.items.length + 1

        return this.items.push(item)
    }

    pack_to_bin(bin, item) {
        let fitted = false

        if (bin.items.length === 0) {
            let response = bin.put_item(item, START_POSITION)

            if (!response) {
                bin.unfitted_items.push(item)
            }

            return
        }

        for (let i = 0; i < 3; i++) {
            let items_in_bin = bin.items

            for (let j = 0; j < items_in_bin.length; j++) {
                let pivot = [0, 0, 0]
                let [ w, h, d ] = items_in_bin[j].get_dimension()
                let addToPivot;
                if (i == axis.WIDTH) {
                    addToPivot = w + items_in_bin[j].position[0]
                    pivot = [
                        addToPivot,
                        items_in_bin[j].position[1],
                        items_in_bin[j].position[2]
                    ]
                }
                else if (i == axis.HEIGHT) {
                    addToPivot = items_in_bin[j].position[1] + h
                    pivot = [
                        items_in_bin[j].position[0],
                        addToPivot,
                        items_in_bin[j].position[2]
                    ]
                }
                else if (i == axis.DEPTH) {
                    addToPivot = items_in_bin[j].position[2] + d
                    pivot = [
                        items_in_bin[j].position[0],
                        items_in_bin[j].position[1],
                        addToPivot
                    ]
                }

                if (bin.put_item(item, pivot)) {
                    fitted = true
                    break
                }
            }
            if (fitted) break
        }
        if (fitted === false) {
            bin.unfitted_items.push(item)
        }
    }

    pack(
        bigger_first=false, distribute_items=false
    ) {
        this.bins.sort((a, b) => {
            if (!bigger_first) {
                return a.get_volume() - b.get_volume();
            }
            else {
                return b.get_volume() - a.get_volume();
            }
        })
        this.items.sort((a, b) => {
            if (!bigger_first) {
                return a.get_volume() - b.get_volume();
            }
            else {
                return b.get_volume() - a.get_volume();
            }
        })

        for (let i = 0; i < this.bins.length; i++) {
            for (let j = 0; j < this.items.length; j++) {
                this.pack_to_bin(this.bins[i], this.items[j])
            }
            if (distribute_items) {
                for (let k = 0; k < this.bins[i].items.length; k++) {
                    this.items.slice(k, 1)
                }
            }
        }
    }
}

module.exports = {
    Bin,
    Item,
    Packer
}