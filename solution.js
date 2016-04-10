function intersects(firstPolygon,secondPolygon){
  var fp = firstPolygon.slice();
  var sp = secondPolygon.slice();
  var arrayOfIntersectionPoints = doPolygonsIntersectAndGetArrayOfPoints(fp,sp);
  var firstSelfIntersect = doPolygonsIntersectAndGetArrayOfPoints(fp,fp);
  var secondSelfIntersect = doPolygonsIntersectAndGetArrayOfPoints(sp,sp);

  if(firstSelfIntersect != false || secondSelfIntersect != false){
    alert("I can\`t deal with self-intersecting polygons =\`-(\n"+
      "But if you give me any two non self-intersecting - i\`ll do the best!");
    return [];
  } else {
    if (arrayOfIntersectionPoints !== false){
      var firstPath = drawNewPath(fp,sp);
      var secondPath = drawNewPath(sp,fp);

      var firstClearedPath = deleteUselessPointsFromPath(firstPath,sp,arrayOfIntersectionPoints);
      var secondClearedPath = deleteUselessPointsFromPath(secondPath,fp,arrayOfIntersectionPoints);

      var filteredFirst = getFilteredPath(firstClearedPath,arrayOfIntersectionPoints.length);
      var filteredSecond = getFilteredPath(secondClearedPath,arrayOfIntersectionPoints.length);

      var firstStep = creatingResultArray(arrayOfIntersectionPoints,filteredFirst);
      var secondStep = creatingResultArray(arrayOfIntersectionPoints,filteredSecond);

      var array = [];
      array[0] = secondStep;

      return array;
    } else {
      return [];
    };
  };
};

/*
Определяет, пересекаются ли два полигона, если да - возвращает массив точек пересечений
*/
function doPolygonsIntersectAndGetArrayOfPoints(firstPolygon,secondPolygon){

  var intersect = false;
  var arrayOfIntersectionPoints = [];
  var fp = firstPolygon;
  var sp = secondPolygon;
  //соединями последний и первый элементы массивов
  fp[fp.length]=fp[0];
  sp[sp.length]=sp[0];

  for (var i = 0; i < (fp.length-1); i++){
    for (var j = 0; j < (sp.length-1); j++){  
      if (doLinesIntersect(fp[i],fp[i+1],sp[j],sp[j+1])) {
        intersect = true;
        arrayOfIntersectionPoints.push(findPointOfIntersection(fp[i],fp[i+1],sp[j],sp[j+1]));
      };
    };
  };
  if (intersect === true){
     return arrayOfIntersectionPoints;
   } else {
    return false;
   };

};

/*
Создает новые полигоны, в которые входят точки пересечений
*/
function drawNewPath(firstPolygon,secondPolygon){

  var newPolygonPath = firstPolygon.slice();
  var foundPointsCounter = 0;
  var fp = firstPolygon.slice();
  var sp = secondPolygon.slice();
  //соединяем первый и последний элементы массивов
  fp[fp.length]=fp[0];
  sp[sp.length]=sp[0];

  for (var i = 0;i<(fp.length-1);i++){
    for (var j = 0;j<(sp.length-1);j++){  
      if (doLinesIntersect(fp[i],fp[i+1],sp[j],sp[j+1])) {
        foundPointsCounter++;
        newPolygonPath.splice((i+foundPointsCounter), 0, findPointOfIntersection(fp[i],fp[i+1],sp[j],sp[j+1]));
          
      };
    };
  };

     newPolygonPath.pop();
     return newPolygonPath;
};






/*
Возвращает массив, состоящий из массивов, в каждом из которых
одна или более точек. Каждый из массивом имеет свойство left и 
right, которые несут в себе информацию о точках пересечения, 
которые должны находится соответственно слева или справа
*/
function getFilteredPath(path,arrlnt){

  var newarr = [];
  var count = 0;
  var onoff = {onoff:false,left:{}};
  var arr = path;



  for (var i = 0; i<arr.length;i++){
    var next = arr[i+1];

    if (i == arr.length-1){next=arr[0]};
      switch (arr[i].flag) {
        case true:
            if (onoff.onoff == false){
              if (next.flag===undefined){
                newarr[count]=[];
                newarr[count].left = arr[i];
                onoff.onoff = true;
              };
            } else {
              onoff.onoff = false;
              newarr[count].right = arr[i];
              count++;
            }

          break
        case undefined:

        if (onoff.onoff === true){
          var temp = arr.splice(i,1);
            newarr[count][newarr[count].length] = temp[0];
            i--;
          }
          break
        };
        if (i == arr.length-1 && arr.length>arrlnt){
          var val = arr.splice(arr.length-1,1)
          arr.unshift(val[0]);
          i=0;
        };
};
return newarr;
}






/*
Удаляет точки из пути полигона, если они не лежат внутри другого 
или не являются точками пересечений полинонов
*/
function deleteUselessPointsFromPath(path,polygon,arrOfIntr){
  var filteredPath = path.filter(function (point){
    var flag = false;

    for (var i = 0; i < arrOfIntr.length;i++){
      if (arrOfIntr[i].x == point.x && arrOfIntr[i].y == point.y){
        flag = true;
        point.flag = true;
      }
    }

    return doPointBelongToPolygon(point,polygon) || flag;
  });
  return filteredPath;
}


//Проверяет,находится ли точка одного полигона внутри другого
function doPointBelongToPolygon(testeePoint,polygon){
  var belongsCounter = 0;
  var testingLines = [{x:testeePoint.x,y:0},{x:400,y:testeePoint.y},{x:testeePoint.x,y:400},{x:0,y:testeePoint.y}];

  var pol = polygon.slice();
  pol[pol.length]=pol[0];

  for (var i = 0; i < 4; i++){
    if (countIntersections(testingLines[i],pol,testeePoint)%2 === 1){
      belongsCounter++;
    };
  };

  function countIntersections(defoultLinePoint,polygon,testeePoint){
    var intersectingCounter = 0;
    for (var i = 0; i < (polygon.length-1); i++){
      if(doLinesIntersect(testeePoint,defoultLinePoint,polygon[i],polygon[i+1])){intersectingCounter++};

    };
    return intersectingCounter;
  };


  if (belongsCounter === 4){
    return true;
  } else {
    return false;
  };
}

/*
Вставляет в массив точек пересечения массивы с "соседями", в итоге получается
итоговый массив полигона пересечения.
*/
function creatingResultArray(inters,check){
  var inters = inters;
  var check = check;


  for (var i = 0; i < check.length; i++){
    var found = 0;
    for (var j = 0; j < inters.length-1; j++){

      if (found == 0){
        if (check[i].left.x == inters[j].x && check[i].left.y == inters[j].y &&
            check[i].right.x == inters[j+1].x && check[i].right.y == inters[j+1].y){

        for (var k = 0; k < check[i].length; k++){
          inters.splice(j+k+1,0,check[i][k]);
        };

        found = 1;
        };
      };
        if (found == 0 && j == inters.length-2) {
          var val = inters.splice(inters.length-1,1);
          inters.unshift(val[0]);
          j=0;
        };

    };
  };

  return inters;
};




//if intersects return  intersection points array
//if not - return false


//returns boolean
function doLinesIntersect(first_P,second_P,third_P,fourth_P){
  var p1 = first_P;
  var p2 = second_P;
  var p3 = third_P;
  var p4 = fourth_P;

  //making VECTORS points by initial points`
  var vp1 = makeVectorByPoints(p3,p4,p3,p1);
  var vp2 = makeVectorByPoints(p3,p4,p3,p2);

  var z1 = makeVectorByPoints(p3,p4,p3,p1);
  var z2 = makeVectorByPoints(p3,p4,p3,p2);
  var z3 = makeVectorByPoints(p1,p2,p1,p3);
  var z4 = makeVectorByPoints(p1,p2,p1,p4);

 //(z1*z2<0 & z3*z4<0) ? console.log("Пересекаются") : console.log("Не пересекаются");

  if (z1*z2<0 && z3*z4<0) { 
    return true;
    
  } else {
    return false;
    
  };
};


function makeVectorByPoints(p1,p2,p3,p4){
  var z_conponent  = 0;
  var firstVector  = {x:0,y:0};
  var secondVector = {x:0,y:0};
  firstVector.x  = p2.x-p1.x;
  firstVector.y  = p2.y-p1.y;
  secondVector.x = p4.x-p3.x;
  secondVector.y = p4.y-p3.y;

return z_component = vectorMultiplicator(firstVector,secondVector)
};


function findPointOfIntersection(p1,p2,p3,p4){
  var a1,a2,b1,b2,c1,c2,D,Dx,Dy,X,Y;
  var ans = {x:0, y:0};
  a1 = findA(p1,p2);
  a2 = findA(p3,p4);
  b1 = findB(p1,p2);
  b2 = findB(p3,p4);
  c1 = findC(p1,p2);
  c2 = findC(p3,p4);

  D = a1*b2-b1*a2;
  Dx = b1*c2-b2*c1;
  Dy = a2*c1-a1*c2;

  ans.x = Dx/D;
  ans.y = Dy/D;

  function findA(p1,p2){
    return p2.y - p1.y;
  };
  function findB(p1,p2){
    return p1.x - p2.x;
  };
  function findC(p1,p2){
    return p1.x*(p1.y-p2.y)+p1.y*(p2.x-p1.x);
  };

  return ans;
};

function vectorMultiplicator(firstVector,secondVector){
  var a = firstVector.x;
  var b = firstVector.y;
  var x = secondVector.x;
  var y = secondVector.y;

  return a*y-b*x

};