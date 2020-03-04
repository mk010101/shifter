/**
 * Takes a CSS 2D transform matrix and returns an array of values:
 * matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )
 * @param str 2d transform matrix string
 * @returns {Array}
 */
export function splitTransformMatrix(str) {

    let res = str.match(/[-0-9.]+/gi);
    if (res) {
        res = res.map(v => parseFloat(v));
    } else res = [1, 0, 0, 1, 0, 0];
    return res;
}