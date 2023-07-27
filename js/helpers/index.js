function getMinMaxCoordinates(list) {
    let minX = minY = Infinity;
    let maxX = maxY = -Infinity;


    for (let coord of list) {
        if (coord.x < minX) minX = coord.x;
        if (coord.y < minY) minY = coord.y;
        if (coord.x > maxX) maxX = coord.x;
        if (coord.y > maxY) maxY = coord.y;
    }

    return { minX, minY, maxX, maxY };
}

function limitDragPosition(draggedPosition, minMaxValues) {
    if (draggedPosition.x < minMaxValues.minX) draggedPosition.x = minMaxValues.minX;
    if (draggedPosition.y < minMaxValues.minY) draggedPosition.y = minMaxValues.minY;
    if (draggedPosition.x > minMaxValues.maxX) draggedPosition.x = minMaxValues.maxX;
    if (draggedPosition.y > minMaxValues.maxY) draggedPosition.y = minMaxValues.maxY;

    return draggedPosition;
}

function findOptimalCoordinates(coordinates, selecting, calculated) {
    let {x, y} = calculated
    coordinates = getMinMaxCoordinates(coordinates)


    if(coordinates.maxX < x) {
        x = coordinates.maxX - (coordinates.maxX - x)
    }

    if(coordinates.maxY < y) {
        y = coordinates.maxY - (coordinates.maxY - maxY)
    }

    if(coordinates.minX > x) {
        x = 0
    }
    
    if(coordinates.minY > y) {
        y = 0
    }

    x *= 8;
    y *= 8;
    // x = selecting.x;
    // y = selecting.y;
    // console.log({selecting, x, y, calculated, coordinates})
    return {x, y}
}