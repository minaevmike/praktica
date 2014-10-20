function IsThereModelWithThisTitle(title)
{
    //Формируем запрос к серверу
    var xhr = new XMLHttpRequest();
    var params = "title=" + encodeURIComponent(title);
    xhr.open('POST', '/dplm/is_there_model/', false);
    SetHeaderForPostRequest(xhr);
    xhr.send(params);

    var serverResponse = xhr.responseText;
    if(serverResponse == "true"){
        return true;
    }
    else{
        return false;
    }
}

//------------------------------------------------------------------
// Функция установки обработчика события
// Параметры вызова:
//   hElem     - DOM-элемент или его ID
//   eventName - событие
//   callback  - функция, которая будет вызвана при событии
// На выходе:
//   TRUE  - обработчик установлен
//   FALSE - элемент не найден или браузер не поддерживает события
//------------------------------------------------------------------
function hookEvent(hElem, eventName, callback)
{
    if (typeof(hElem) == 'string') {
        // Если передан ID, то получить DOM-элемент
        hElem = document.getElementById(hElem);
    }

    // Если такого элемента нет, то возврат с ошибкой
    if (!hElem) {
        return false;
    }

    if (hElem.addEventListener) {
        if (eventName == 'mousewheel') {
          // Событие вращения колесика для Mozilla
          hElem.addEventListener('DOMMouseScroll', callback, false);
        }

        // Колесико для Opera, WebKit-based, а также любые другие события
        // для всех браузеров кроме Internet Explorer
        hElem.addEventListener(eventName, callback, false);
    }
    else if (hElem.attachEvent) {
        // Все события для Internet Explorer
        hElem.attachEvent('on' + eventName, callback);
    }
    else {
        return false;
    }

    return true;
}

//------------------------------------------------------------------
// Функция снятия обработчика события
// Параметры вызова:
//   hElem     - DOM-элемент или его ID
//   eventName - событие
//   callback  - функция обработки события, которую надо отменить
//------------------------------------------------------------------
function unhookEvent(hElem, eventName, callback)
{
    if (typeof(hElem) == 'string') {
        // Если передан ID, то получить DOM-элемент
        hElem = document.getElementById(hElem);
    }

    // Если такого элемента нет, то возврат с ошибкой
    if (!hElem) {
        return false;
    }

    if (hElem.removeEventListener) {
        if (eventName == 'mousewheel') {
            // Событие вращения колесика для Mozilla
            hElem.removeEventListener('DOMMouseScroll', callback, false);
        }

        // Колесико для Opera, WebKit-based, а также любые другие события
        // для всех браузеров кроме Internet Explorer
        hElem.removeEventListener(eventName, callback, false);
    }
    else if (hElem.detachEvent) {
        // Все события для Internet Explorer
        hElem.detachEvent('on' + eventName, callback);
    }
    else {
      return false;
    }

    return true;
}

//------------------------------------------------------------------
// Кроссбраузерная функция подавления события
//------------------------------------------------------------------
function cancelEvent(e) {
  e = e ? e : window.event;
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}

//------------------------------------------------------------------
// Функция формирует тело для POST запроса
// в кодировке multipart/form-data
//------------------------------------------------------------------
function CreateBodyOfPostRequestInMultipartFormData(data, xhrRequest, destinateUrl)
{
    //Формируем тело запроса
    var boundary = String(Math.random()).slice(2);
    var boundaryMiddle = '--' + boundary + '\r\n';
    var boundaryLast = '--' + boundary + '--\r\n';

    var body = ['\r\n'];
    for(var key in data){
        //Добавление поля
        body.push('Content-Disposition: form-data;name="'+key+'"\r\n\r\n'+data[key]+'\r\n');
    }

    body = body.join(boundaryMiddle) + boundaryLast;

    //Тело запроса готово, продолжаем настраивать xhrRequest
    xhrRequest.open('POST', destinateUrl, true);
    xhrRequest.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

    return body;
}