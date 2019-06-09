const Alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const Atlas = Uint8Array.from(Buffer.from('MFAAAAwDKNbUsky0bVFtTdq2aZJqDdq2Udt2FQBgAJwCheagdS21kFRlW9e1adJqTdugU4kqADBgQA0jKFC0CmthrQA=', 'base64'));
const Palette = [
  [0xff, 0xff, 0xff],
  [0xff, 0x00, 0x00],
  [0x00, 0xff, 0x00],
  [0x00, 0x00, 0xff],
  [0x00, 0xff, 0xff],
  [0xff, 0x00, 0xff],
  [0xff, 0xff, 0x00]
];

read = (offset) => {
  let value = 0;
  for (let i = 0; i < 3; ) {
    const bit_offset = offset & 7;
    const read = Math.min(3 - i, 8 - bit_offset);
    const read_bits = (Atlas[offset >> 3] >> bit_offset) & (~(0xff << read));
    value |= read_bits << i;
    offset += read;
    i += read;
  }
  return value;
};

unpack = (g) => {
  return (new Uint8Array(5)).map((_, i) =>
    read(Alphabet.length*3*i + Alphabet.indexOf(g)*3));
};

decode = (g) => {
  const rgb = new Uint8Array(5*3);
  unpack(g).forEach((value, index) =>
    rgb.set(Palette[value], index*3));
  return rgb;
}

print = (t) => {
  const c = t.toUpperCase().replace(/[^\w\d ]/g, '');
  const w = c.length * 2 - 1, h = 5, bpp = 3;
  const b = new Uint8Array(w*h*bpp);
  let x = 0;
  [...c].forEach((g, i) => {
    if (g !== ' ') for (let y = 0; y < 5; y++) {
      b.set(decode(g).slice(y*3, y*3+3), (y * w + i*2) * bpp);
    }
  });
  return {w: w, h: h, data: b};
};