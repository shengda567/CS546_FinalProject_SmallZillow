const BMP24 = require('gd-bmp').BMP24;


function rand (min, max)
{
    return Math.random() * (max - min + 1) + min | 0 ;
}


function makeCapcha(str) {
  let img = new BMP24(100, 40); 
  
  img.fillRect(0, 0, 100, 40, 0xffffff);
  
  var w = img.w / 2;
  var h = img.h;
  var color = rand(0, 0xffffff);
  var y1 = rand(-5, 5); 
  var w2 = rand(10, 15); 
  var h3 = rand(3, 5); 
  var bl = rand(1, 5);
  for (let i = -w; i < w; i += 0.1) {
    var y = Math.floor(h / h3 * Math.sin(i / w2) + h / 2 + y1);
    var x = Math.floor(i + w);
    for (let j = 0; j < bl; j++) {
      img.drawPoint(x, y + j, color);
    }
  }

  
  var fonts = [BMP24.font12x24, BMP24.font16x32];
  var x = 15;
  for (var i = 0; i < str.length; i++) {
    let f = fonts[Math.random() * fonts.length | 0];
    y = 8 + rand(-10, 10);
    img.drawChar(str[i], x, y, f, rand(0, 0xffffff));
    x += f.w + rand(2, 8);
  }
  return img;
}



module.exports = {
    makeCapcha
    
    }