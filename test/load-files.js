var srcCssFiles = [
    "../src/effects/fade.css",
    "../src/effects/flip-down.css",
    "../src/effects/flip-left.css",
    "../src/effects/flip-right.css",
    "../src/effects/flip-up.css",
    "../src/effects/rotate-left.css",
    "../src/effects/rotate-right.css",
    "../src/effects/slide-down.css",
    "../src/effects/slide-left.css",
    "../src/effects/slide-right.css",
    "../src/effects/slide-up.css",
    "../src/effects/zoom-in.css",
    "../src/effects/zoom-out.css",
    "../src/adp-hide.css"
];

var srcJsFiles = [
    "../src/adp.js"
];

var distCssFiles = [
    "../dist/adp.min.css"
];

var distJsFiles = [
    "../dist/adp.min.js"
];

function getQueryParameter(parameter) {
    var query = window.location.search.substring(1);
    var params = query.split("&");
    for (var i = 0; i < params.length; i++) {
        var pair = params[i].split("=");
        if (pair[0] == parameter) {
            return pair[1];
        }
    }
    return false;
}

function loadCssFile(path) {
    var linkTag = document.createElement("link");
    linkTag.setAttribute("type", "text/css");
    linkTag.setAttribute("rel", "stylesheet");
    linkTag.setAttribute("href", path);
    document.getElementsByTagName("head")[0].appendChild(linkTag);
}

function loadJsFile(path) {
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", path);
    document.getElementsByTagName("head")[0].appendChild(scriptTag);
}

function loadFiles(cssFiles, jsFiles) {
    for (var i = 0; i < cssFiles.length; i++) {
        loadCssFile(cssFiles[i]);
    }
    for (var j = 0; j < jsFiles.length; j++) {
        loadJsFile(jsFiles[j]);
    }
}

function onLoad() {
    var filesToLoad = getQueryParameter("files");
    if ((filesToLoad !== "src" && filesToLoad !== "dist") || !filesToLoad) {
        filesToLoad = "src";
    }

    if (filesToLoad === "dist") {
        loadFiles(distCssFiles, distJsFiles);
    } else {
        loadFiles(srcCssFiles, srcJsFiles);
    }
}

window.addEventListener("load", onLoad);
