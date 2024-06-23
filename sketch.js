let img;
let brightnessThreshold = 0; // brightness threshold for sorting
let rowThickness = 4; // number of rows to process together

function preload() {
  img = loadImage('near_ocean.jpeg');
}

function setup() {
  createCanvas(img.width, img.height);
  img.loadPixels();
  pixelDensity(1);
  pixelSort(img);
  img.updatePixels();
  image(img, 0, 0);
}


// TODO: mask and segment rows by intervals.
function pixelSort(img) {
  const startX = img.height * 0.25
  const endX = img.height * 0.5
  const startY = img.height * 0.25
  const endY = img.height * 0.75

  for (let y = 0; y < img.height; y += rowThickness) {

    if (y < startY || y >= endY) {
      continue
    }

    let rows = [];
    let brightPixels = [];

    const randomWidth = Math.random() * 400

    for (let row = 0; row < rowThickness; row++) {
      if (y + row >= img.height) break; // Avoid going out of bounds


      for (let x = startX; x < endX + randomWidth; x++) {
        let index = (x + (y + row) * img.width) * 4;
        let r = img.pixels[index];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];
        let a = img.pixels[index + 3];
        rows.push({ r, g, b, a });

        if (getBrightness([r, g, b]) >= brightnessThreshold) {
          brightPixels.push({ r, g, b, a });
        }
      }
    }

    rows.sort((a, b) => getBrightness([a.r, a.g, a.b]) - getBrightness([b.r, b.g, b.b]));
    brightPixels.sort((a, b) => getBrightness([a.r, a.g, a.b]) - getBrightness([b.r, b.g, b.b]));

    for (let row = 0; row < rowThickness; row++) {
      if (y + row >= img.height) break; // Avoid going out of bounds

      for (let x = startX; x < endX + randomWidth; x++) {
        let index = (x + (y + row) * img.width) * 4;

        if (getBrightness([img.pixels[index], img.pixels[index + 1], img.pixels[index + 2]]) >= brightnessThreshold) {
          let brightPixel = brightPixels.shift();

          img.pixels[index] = brightPixel.r;
          img.pixels[index + 1] = brightPixel.g;
          img.pixels[index + 2] = brightPixel.b;
          img.pixels[index + 3] = brightPixel.a;
        } else {
          let pixel = rows.shift();
          img.pixels[index] = pixel.r;
          img.pixels[index + 1] = pixel.g;
          img.pixels[index + 2] = pixel.b;
          img.pixels[index + 3] = pixel.a;
        }
      }
    }
  }
}

function getBrightness(rgb) {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
