function FillRelatedInfoDiv(divElement, relatedInfo)
{
    //TODO: в divElement содержится элемент, в который мы будем записывать инфу
    //TODO: в переменную relatedFilesComment записываем коммент к вспомогательным файлам
    //TODO: в переменную relatedFilesString записываем строку с названиями вспомгательных файлов
    var relatedFilesComment;
    var relatedFilesString;

    //В relatedInfo содержится xml строка с инфой. Ее надо разобрать.
    //Заполняем поле с названием детали
    var info = "Название детали: ";
    info += detailName;
    info += "\n";

    //Заполняем ссылку на STL файлы детали
    info += "STL файлы: оригинальный - ";
    info += origStlUrl;
    info += "; редуцированый - ";
    info += decimStlUrl;
    info += "\n";

    //Заполняем поле с общим комментарием
    if(detailComment != undefined){
        info += "Общий комментарий: ";
        info += detailComment;
        info += "\n";
    }

    //Заполняем поле с вспомогательными файлам
    if(relatedFilesString != undefined){
        info += "Вспомогательные файлы:\n"
        var filesUrlsArr = relatedFilesString.split(";");
        var countOfFiles = filesUrlsArr.length();
        for(var i = 0; i < countOfFiles; ++i ){
            info += "\t";
            info += filesUrlsArr[i]; //TODO: возможно здесь надо добавить тег static
            info += "\n";
        }
        info += "\n";
    }

    //Заполняем поле с комментарием к вспомогательным файлам
    if(relatedFilesComment != undefined){
        info += "Комментарий к вспомогательным файлам: ";
        info += relatedFilesComment;
    }

    //Записываем сформированный блок текста в div элемент
    divElement.innerHTML = info;
}
