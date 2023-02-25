class RotationType {
    RT_WHD = 0;
    RT_HWD = 1;
    RT_HDW = 2;
    RT_DHW = 3;
    RT_DWH = 4;
    RT_WDH = 5;

    ALL = [this.RT_WHD, this.RT_HWD, this.RT_HDW, this.RT_DHW, this.RT_DWH, this.RT_WDH];
}

class Axis {
    WIDTH = 0;
    HEIGHT = 1;
    DEPTH = 2;

    ALL = [this.WIDTH, this.HEIGHT, this.DEPTH];
}

module.exports = { RotationType, Axis }