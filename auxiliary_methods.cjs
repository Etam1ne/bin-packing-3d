import { Axis } from "./constants.cjs"

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
        rect_intersect(item1, item2, Axis.WIDTH, Axis.HEIGHT) &&
        rect_intersect(item1, item2, Axis.HEIGHT, Axis.DEPTH) &&
        rect_intersect(item1, item2, Axis.WIDTH, Axis.DEPTH)
    )
}

const get_limit_number_of_decimals = (number_of_decimals) => {
    return parseFloat(1).toFixed(number_of_decimals)
}

const set_to_decimal = (value, number_of_decimals) => {
    number_of_decimals = get_limit_number_of_decimals(number_of_decimals)

    return parseFloat(value).toFixed(number_of_decimals)
}

module.exports = {
    rect_intersect,
    intersect,
    get_limit_number_of_decimals,
    set_to_decimal
}