"use strict";

const intersections = require('kld-intersections');

const IntersectionParams = intersections.IntersectionParams;
const Intersection = intersections.Intersection;
const Point2D = intersections.Point2D;

// https://github.com/substack/point-in-polygon/blob/master/index.js
const checkInside = (point, polygon) => {
  var x = point.x, y = point.y;
  var vs = polygon.params[0].map(point => [point.x, point.y]);

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];

      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }

  return inside;
}

const splitLine = (line, _points) => {
  const linePoints = line.params.sort((a, b) => a.x > b.x);
  const points = _points.sort((a, b) => a.x > b.x);
  const lines = [];

  points.unshift(linePoints[0]);
  points.push(linePoints[linePoints.length - 1]);

  for(let i = 0; i < points.length -1; i++) {
    lines.push(IntersectionParams.newLine(points[i], points[i+1]));
  }

  return lines;
}


// http://stackoverflow.com/a/27943/269968
const deg2rad = deg => deg * (Math.PI/180);

const convertToKm = (lat1,lon1,lat2,lon2) => {
  var R = 6373;
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

module.exports = (_polygon, path) => {
  const polygonLines = _polygon.map(i => new Point2D(i.lng, i.lat));
  const polygon = IntersectionParams.newPolygon(polygonLines);
  let totalLength = 0;

  for(let i = 0; i < path.length - 1; i++) {
    let startPoint = new Point2D(path[i].lng, path[i].lat);
    let endPoint = new Point2D(path[i + 1].lng, path[i + 1].lat);
    let line = IntersectionParams.newLine(startPoint, endPoint);
    let intersection = Intersection.intersectShapes(polygon, line);

    const m = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);

    splitLine(line, intersection.points).forEach(line => {
      const points = line.params;
      const center = new Point2D((points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2);

      if (checkInside(center, polygon)) {
        totalLength += convertToKm(points[0].y, points[0].x, points[1].y, points[1].x)
      }
    });
  }

  return totalLength;
}
