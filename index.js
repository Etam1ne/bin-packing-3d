import { Axis, RotationType } from './constants.cjs';

const axis = new Axis();
const rotationType = new RotationType();

const DEFAULT_NUMBER_OF_DECIMALS = 3;
const START_POSITION = [0, 0, 0];

const rect_intersect = (item1, item2, x, y) => {
    d1 = item1.get_dimension()
    d2 = item2.get_dimension()

    cx1 = item1.position[x] + d1[x]/2
    cy1 = item1.position[y] + d1[y]/2
    cx2 = item2.position[x] + d2[x]/2
    cy2 = item2.position[y] + d2[y]/2

    ix = Math.max(cx1, cx2) - Math.min(cx1, cx2)
    iy = Math.max(cy1, cy2) - Math.min(cy1, cy2)

    return ix < (d1[x]+d2[x])/2 && iy < (d1[y]+d2[y])/2
}

const intersect = (item1, item2) => {
    return (
        rect_intersect(item1, item2, axis.WIDTH, axis.HEIGHT) &&
        rect_intersect(item1, item2, axis.HEIGHT, axis.DEPTH) &&
        rect_intersect(item1, item2, axis.WIDTH, axis.DEPTH)
    )
}

const get_limit_number_of_decimals = (number_of_decimals) => {
    return parseFloat(1).toFixed(number_of_decimals)
}

const set_to_decimal = (value, number_of_decimals) => {
    number_of_decimals = get_limit_number_of_decimals(number_of_decimals)

    return parseFloat(value).toFixed(number_of_decimals)
}

class Item {
    name;
    width;
    height;
    depth;
    weight;
    rotation_type;
    position;
    number_of_decimals;
    constructor(name, width, height, depth, weight) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.weight = weight;
        this.rotation_type = 0;
        this.position = START_POSITION;
        this.number_of_decimals = DEFAULT_NUMBER_OF_DECIMALS;
    }

    format_numbers(number_of_decimals) {
        this.width = set_to_decimal(this.width, number_of_decimals)
        this.height = set_to_decimal(this.height, number_of_decimals)
        this.depth = set_to_decimal(this.depth, number_of_decimals)
        this.weight = set_to_decimal(this.weight, number_of_decimals)
        this.number_of_decimals = this.number_of_decimals
    }

    string() {
        return "%s(%sx%sx%s, weight: %s) pos(%s) rt(%s) vol(%s)" % (
            this.name, this.width, this.height, this.depth, this.weight,
            this.position, this.rotation_type, this.get_volume()
        )
    }

    get_volume() {
        return set_to_decimal(
            this.width * this.height * this.depth, this.number_of_decimals
        )
    }

    get_dimension() {
        if (this.rotation_type == rotationType.RT_WHD) {
            return [this.width, this.height, this.depth]
        }
        else if (this.rotation_type == rotationType.RT_HWD) {
            return [this.height, this.width, this.depth]
        }
        else if (this.rotation_type == rotationType.RT_HDW) {
            return [this.height, this.depth, this.width]
        }
        else if (this.rotation_type == rotationType.RT_DHW) {
            return [this.depth, this.height, this.width]
        }
        else if (this.rotation_type == rotationType.RT_DWH) {
            return [this.depth, this.width, this.height]
        }
        else if (this.rotation_type == rotationType.RT_WDH) {
            return [this.width, this.depth, this.height]
        }
        else {
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
        this.number_of_decimals = DEFAULT_NUMBER_OF_DECIMALS
    }

    format_numbers(number_of_decimals) {
        this.width = set_to_decimal(this.width, number_of_decimals)
        this.height = set_to_decimal(this.height, number_of_decimals)
        this.depth = set_to_decimal(this.depth, number_of_decimals)
        this.max_weight = set_to_decimal(this.max_weight, number_of_decimals)
        this.number_of_decimals = number_of_decimals
    }

    string() {
        return "%s(%sx%sx%s, max_weight:%s) vol(%s)" % (
            this.name, this.width, this.height, this.depth, this.max_weight,
            this.get_volume()
        )
    }

    get_volume() {
        return set_to_decimal(
            this.width * this.height * this.depth, this.number_of_decimals
        )
    }

    get_total_weight() {
        total_weight = 0

        for (let i = 0; i < this.items.length; i++) {
            total_weight += items[i].weight
        }

        return set_to_decimal(total_weight, this.number_of_decimals)
    }

    put_item(item, pivot) {
        let fit = false
        let valid_item_position = item.position
        item.position = pivot

        for (let i = 0; i < rotationType.ALL.length; i++) {
            item.rotation_type = rotationType.All[i]
            dimension = item.get_dimension()

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

        if (!bin.items) {
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
                let w, h, d = items_in_bin[j].get_dimension()
                if (i == axis.WIDTH) {
                    pivot = [
                        ib.position[0] + w,
                        ib.position[1],
                        ib.position[2]
                    ]
                }
                else if (i == axis.HEIGHT) {
                    pivot = [
                        ib.position[0],
                        ib.position[1] + h,
                        ib.position[2]
                    ]
                }
                else if (i == axis.DEPTH) {
                    pivot = [
                        ib.position[0],
                        ib.position[1],
                        ib.position[2] + d
                    ]
                }
                if (bin.put_item(item, pivot)) {
                    fitted = true
                    break
                }
            }
            if (fitted) break
        }
        if (!fitted) bin.unfitted_items.push(item)
    }

    pack(
        bigger_first=false, distribute_items=false,
        number_of_decimals=DEFAULT_NUMBER_OF_DECIMALS
    ) {
        for (let i = 0; i < this.bins.length; i++) {
            this.bins[i].format_numbers(number_of_decimals)
        }
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].format_numbers(number_of_decimals)
        }

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
            for (let j = 0; j < this.bins[i].length; j++) {
                this.pack_to_bin(this.bins[i], this.bins[i][j])
            }
            if (distribute_items) {
                for (let k = 0; k < this.bins[i].length; k++) {
                    this.items.splice(k, 1)
                }
            }
        }
    }
}