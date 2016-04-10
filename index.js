var examples = {
  first: [
    { x: 26,  y: 195},
    { x: 90,  y: 119},
    { x: 350, y: 120},
    { x: 129, y: 252},
    { x: 43,  y: 263},
  ],
  second: [
    { x: 97,  y: 179},
    { x: 267, y: 42},
    { x: 363, y: 207},
    { x: 227, y: 317},
  ]

};

function drawPath(data, container, color) {
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  var str = 'M' + data[0].x + ',' + data[0].y+' ';
  str += data.slice(1).map(function (point) {
    return 'L' + point.x + ',' + point.y;
  }).join(' ');
  str += 'L' + data[0].x + ',' + data[0].y+' ';
  path.setAttribute('d', str);
  path.style.fill = color;
  container.appendChild(path);
}

drawPath(examples.first, document.querySelector('svg.base'), 'navy');
drawPath(examples.second, document.querySelector('svg.base'), 'yellow');

intersects(examples.first, examples.second).forEach(function (p) {
  drawPath(p, document.querySelector('svg.intersections'), 'red');
})
