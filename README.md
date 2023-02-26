3D bin packing
====

JavaScript solution for 3D bin packing problem.

## Install

```
npm i 3d-bin-pack
```

## Basics

All interactions happen with 3 main object types:

**Bin** - space (rectangular cuboid) which is being filled with Items. 

```
Bin(name, width, height, depth, max_weight)
```

**Item** - box (also a rectangular cuboid) whis is being placed in Bin.