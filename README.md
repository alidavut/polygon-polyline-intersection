polygon-polyline-intersection
=============================
Measure total distance of a polyline inside a polygon with geolocation data.

```
npm install popoin
```
----
```javascript
var measureIntersection = require('polygon-polyline-intersection');
var polygon = [{ lng: 0, lat: 0 }, { lng: 180, lat: 0 }, { lng: 180, lat: 180 }, { lng: 0, lat: 180 }, { lng: 0, lat: 160 }, { lng: 10, lat: 170 }, { lng: 16, lat: 140 }];
var polyline = [{ lng: 27.021178, lat: 41.064817 }, { lng: 30.415517, lat: 40.974942 }, { lng: 30.675006, lat: 40.406268 }];


measureIntersection(polygon, polyline);
> 351.9457278368907 (as km)
```
