![CI](https://github.com/KyranRana/basket-promotional-rules-applier-node-typescript/workflows/CI/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Basket Promotional Rule Applier

This is a command line program written using Node.js and TypeScript which applies specific promotional rules to a dummy basket consisting of items provided via user input. 

The items the user can select from can be found below:

```
ID | Name | Price
0001 | Water Bottle | £24.95
0002 | Hoodie | £65.00
0003 | Sticker Set | £3.99
```

The promotional rules:
- If you spend over £75 then you get a 10% discount
- If you buy two or more water bottles then the price drops to £22.99 each

The steps to run this program:
1. `cd` into the project directory
1. `yarn install`
1. `npm build`
1. `node ./build/main/app.js`

Example usage:

```
Enter item ids: 0001,0001,0002,0003
£103.47
```
