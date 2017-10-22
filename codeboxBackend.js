var codeBoxArr = [];

/**
 * Creates a div that has a textarea as a child. These will be the diagram boxes that you can drag around and fill with code.
 * @param {string} type is the type of the box. 
 *                      'f' means 'first', or the starting block. It leads to its primary connection box.
 *                      's' means a simple box that leads to its primary connection box.
 *                      'i' means 'input'. It prompts the user to enter an expression that is assigned to the variable it contains. It leads to its primary connection box.
 *                      'c' means 'conditional'. It leads to its primary connection box if its condition it true. Else, it leads to its secondary connection box.
 *                      'e' means 'end'. The program halts when these boxes are reached. We do not actually need these right now.
 */
function addBox(type) {
    function actualAdd(index) {
        var codeBox = [document.createElement("div"), document.createElement("textarea"), type, undefined, undefined, []];

        codeBox[0].id = "" + codeBoxArr.length;
        codeBox[0].className = type + "_box";

        codeBox[1].className = type + "_code";
        codeBox[1].value = "";

        codeBox[0].appendChild(codeBox[1]);

        document.body.appendChild(codeBox[0]);
        codeBoxArr.push(codeBox);
    }
    for (let i = 0; i < codeBoxArr.length; ++i) {
        if (codeBoxArr[i] == null) {
            actualAdd(i);
            return;
        }
    }
    actualAdd(codeBoxArr.length);
}
 
//index is the index of the box you are removing
function removeBox(index) {
    document.body.removeChild(codeBoxArr[index][0]);
    codeBoxArr[index] = null;
}


//You are setting a primary connection from the box with ID startIndex to the box with ID endIndex.
function primaryConnect(startIndex, endIndex) {
    let start = parseInt(startIndex);
    let end = parseInt(endIndex);
    codeBoxArr[start][3] = parseInt(end);
    codeBoxArr[end][5].push(start);
}

function secondaryConnect(startIndex, endIndex) {
    let start = parseInt(startIndex);
    let end = parseInt(endIndex);
    codeBoxArr[start][4] = parseInt(end);
    codeBoxArr[end][5].push(start);
}

//You are removing the primary connection from the box with ID startIndex. The endIndex is already known.
function primaryUnconnectStart(startIndex) {
    let start = parseInt(startIndex);
    let end = codeBoxArr[start][3];
    if (end == undefined) {
        return;
    }
    codeBoxArr[start][3] = undefined;
    codeBoxArr[end][5] = codeBoxArr[end][5].filter(num => num != start);
}

function secondaryUnconnectStart(startIndex) {
    let start = parseInt(startIndex);
    let end = codeBoxArr[start][4];
    if (end == undefined) {
        return;
    }
    codeBoxArr[start][4] = undefined;
    codeBoxArr[end][5] = codeBoxArr[end][5].filter(num => num != start);
}

//You are removing all the connections that lead to the box with ID endIndex. The list of boxes that lead to it is already known.
function unconnectEnd(endIndex) {
    let end = parseInt(endIndex);
    for (let i = 0; i < codeBoxArr[end][5].length; ++i) {
        primaryUnconnectStart("" + codeBoxArr[end][5][i]);
    }
    codeBoxArr[end][5] = [];
}




function codeMaker() {
    code = [];
    var start;
    for (let i = 0; i < codeBoxArr.length; ++i) {
        if (codeBoxArr[i][2] == 'f') {
            start = i;
            let tmp = codeBoxArr[i];
            code.push(['s', "", tmp[3]]);
            break;
        }
    }
    for (let i = 0; i < start; ++i) {
        let tmp = codeBoxArr[i];
        let line = [tmp[2], tmp[1].value];
        if (tmp[3] != undefined) {
            line.push(tmp[3]);
            if (tmp[4] != undefined) {
                line.push(tmp[4]);
            }
        } else {
            line = ['e'];
        }
        code.push(line);
        code.push(line);
    }
    for (let i = start + 1; i < codeBoxArr.length; ++i) {
        let tmp = codeBoxArr[i];
        let line = [tmp[2], tmp[1].value];
        if (tmp[3] != undefined) {
            line.push(tmp[3]);
            if (tmp[4] != undefined) {
                line.push(tmp[4]);
            }
        } else {
            line = ['e'];
        }
        code.push(line);
    }
    return code;
}



