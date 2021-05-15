function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b]
}

function rgbToHex(rgb) {
    return '#' + rgb.map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

export function getHexGradient(hexStart, hexEnd, weight) {
    const w1 = weight;
    const w2 = 1 - w1;
    const rgbStart = hexToRgb(hexStart)
    const rgbEnd = hexToRgb(hexEnd)
    const rgb = [Math.round(rgbStart[0] * w1 + rgbEnd[0] * w2),
        Math.round(rgbStart[1] * w1 + rgbEnd[1] * w2),
        Math.round(rgbStart[2] * w1 + rgbEnd[2] * w2)];
    return rgbToHex(rgb)
}