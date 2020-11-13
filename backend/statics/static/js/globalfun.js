function myajax(argObj) {
    let xhr = XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
    const method = argObj.method || 'get'
    const async = argObj.async || true
    const data = argObj.data || null
    xhr.open(method, argObj.url,async)
    if (method.toLowerCase === 'post') {
        xhr.send(data)
    } else {
        xhr.send(null)
    }
    if (!async) {
        argObj.success(JSON.parse(xhr.response))
    } else {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                argObj.success(JSON.parse(xhr.response))
            }
        }
    }
}
function addEvent(eventType, elem, fn, isCapture = false) {
    if (window.addEventListener) {
        addEvent = function (eventType, elem, fn, isCapture) {
            elem.addEventListener(eventType, fn, isCapture)
        }
    } else if (window.attachEvent) {
        addEvent = function (eventType, elem, fn) {
            elem.attachEvent('on' + eventType, fn.bind(elem))
        }
    } else {
        addEvent = function () {
            elem['on' + eventType] = fn
        }
    }
    addEvent(eventType, elem, fn, isCapture)
}