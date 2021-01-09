# gamp
This small lib provides a four operations calculator API with workaround for the common floating-point issue.

## How to use

You can either require it using requireJS, import it inside your Node.js project, or just load it using regular script tag.

The API is pretty simple:

- `gamp.add(left, right)`: returns the result of the addition of the right operand to the left operand
- `gamp.sub(left, right)`: returns the result of the subtraction of the right operand from the left operand
- `gamp.mul(left, right)`: returns the results of the multiplication of the left operand by the right operand
- `gamp.div(left, right)`: returns the results of the division of the left operand by the right operand
- `gamp.pow(left, right)`: returns the results of the power of the left operand by the right operand
- `gamp.normalize(value, factor)`: normalizes the value by a factor and rounds it
- `gamp.round(value, [digits=16])`: rounds a value to a particular number of digits (default 16)
- `gamp(value1, value2, ..., valueN)`: computes the shared precision of the provided decimal numbers. This precision is the decimal factor needed to normalize the values in order to prevent the floating-point round-off error.

