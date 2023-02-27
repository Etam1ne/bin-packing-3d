3D bin packing
====

JavaScript solution for 3D bin packing problem.

## Install

```
npm i bin-packing-3d
```

## Basics

All interactions happen with 3 main object types:

**Bin** - space (rectangular cuboid) which is being filled with Items. 

```
let myBin = new Bin(name, width, height, depth, max_weight);
```

**Item** - box (also a rectangular cuboid) which is being placed in Bin.

```
let myItem = new Item(name, width, height, depth, max_weight);
```

**Packer** - object through which packing is performed. Packer has three main methods:

```
let packer = Packer();       // Packer definition

packer.add_bin(myBin);       // Adding bin to packer
packer.add_item(myItem);     // Adding item to bin

packer.pack();               // Packing items to bins
```
`pack(bigger_first, distribute_items)` props:
- `bigger_first` *(boolean)* - By default all the bins and items are sorted from the smallest to the biggest.
- `distribute_items` *(boolean)*
    - *true* => From a list of bins and items, put the items in the bins that at least one item be in one bin that can be fitted. That is, distribute all the items in all the bins so that they can be contained.  
    - *false* (default) => From a list of bins and items, try to put all the items in each bin and in the end it show per bin all the items that was fitted and the items that was not.

**After packing:**
```
packer.bins                  // Get all bins of packer
my_bin.items                 // Get all fitted items in each bin
my_bin.unfitted_items        // Get all unfitted items in each bin
```

## Example

```
const { Bin, Item, Packer} = require('bin-packing-3d');

let packer = new Packer();

packer.add_bin(new Bin('small-envelope', 11.5, 6.125, 0.25, 10));
packer.add_bin(new Bin('large-envelope', 15.0, 12.0, 0.75, 15));
packer.add_bin(new Bin('small-box', 8.625, 5.375, 1.625, 70.0));
packer.add_bin(new Bin('medium-box', 11.0, 8.5, 5.5, 70.0));
packer.add_bin(new Bin('medium-2-box', 13.625, 11.875, 3.375, 70.0));
packer.add_bin(new Bin('large-box', 12.0, 12.0, 5.5, 70.0));
packer.add_bin(new Bin('large-2-box', 23.6875, 11.75, 3.0, 70.0));

packer.add_item(new Item('50g [powder 1]', 3.9370, 1.9685, 1.9685, 1));
packer.add_item(new Item('50g [powder 2]', 3.9370, 1.9685, 1.9685, 2));
packer.add_item(new Item('50g [powder 3]', 3.9370, 1.9685, 1.9685, 3));
packer.add_item(new Item('250g [powder 4]', 7.8740, 3.9370, 1.9685, 4));
packer.add_item(new Item('250g [powder 5]', 7.8740, 3.9370, 1.9685, 5));
packer.add_item(new Item('250g [powder 6]', 7.8740, 3.9370, 1.9685, 6));
packer.add_item(new Item('250g [powder 7]', 7.8740, 3.9370, 1.9685, 7));
packer.add_item(new Item('250g [powder 8]', 7.8740, 3.9370, 1.9685, 8));
packer.add_item(new Item('250g [powder 9]', 7.8740, 3.9370, 1.9685, 9));

packer.pack();

for (let i = 0; i < packer.bins.length; i++) {
    console.log(":::::::::::", packer.bins[i]);

    console.log("***************************************************");
    console.log("***************************************************");
}
```

## Credits

* https://github.com/bom-d-van/binpacking
* https://github.com/gedex/bp3d
* https://github.com/enzoruiz/3dbinpacking
* [Optimizing three-dimensional bin packing through simulation](https://github.com/enzoruiz/3dbinpacking/blob/master/erick_dube_507-034.pdf)

## License

[MIT](./LICENCE)
