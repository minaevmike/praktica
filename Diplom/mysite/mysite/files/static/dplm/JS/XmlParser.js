function ParseXml(xmlStr, outputDivId)
{
    var xml = CreateXmlFromString(xmlStr);
    var resultHtmlDoc = "";

    resultHtmlDoc += RenderTag(xml, "name", "Название детали");
    resultHtmlDoc += RenderTag(xml, "description", "Описание");
    resultHtmlDoc += RenderTag(xml, "work_surface", "Рабочая поверхность");
    resultHtmlDoc += RenderTag(xml, "join_surface", "Присоединительная поверхность");
    resultHtmlDoc += RenderTag(xml, "deformations", "Деформации во время работы");
    resultHtmlDoc += RenderTag(xml, "chemical_influence", "Химико-термические воздействия во время работы");

    $(outputDivId).html(resultHtmlDoc);

    var modelTag = xml.getElementsByTagName("model")[0];
    var mesh_name = modelTag.childNodes[0].nodeValue;
    var xhr2 = new XMLHttpRequest();
    var params2 = "msh_name=" + encodeURIComponent(mesh_name);
    xhr2.open('POST', '/dplm/get_mesh_data', true);
    SetHeaderForPostRequest(xhr2);

    xhr2.onreadystatechange = function() {
        if(xhr2.readyState != 4){
            return;
        }

        //Данные ответа будут находиться в xhr.responseText
        CreateGeometry(xhr2.responseText);
        //alert("Модель загружена");
    }

    xhr2.send(params2);
}

function CreateXmlFromString(str)
{
//    var doc = new ActiveXObject("Microsoft.XMLDOM");
//    doc.loadXML(str);
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "application/xml");
    return doc;
}

function RenderTag(xmlDoc, tagName, tagOutputTitle)
{
    var outputHtml = "<div>";
    outputHtml += "<ins>";
    outputHtml += tagOutputTitle;
    outputHtml += ":";
    outputHtml += "</ins>";
    outputHtml += "</div>";

    outputHtml += "<div class = \"MyMarginLeft\">";
    var tag = xmlDoc.getElementsByTagName(tagName)[0];
    outputHtml += tag.childNodes[0].nodeValue;
    outputHtml += "</div>";
    outputHtml += "<br>";
    //outputHtml += "<br>";

    return outputHtml;
}
//
//function RenderModelTag(xmlDoc)
//{
//    var outputHtml = "<div>";
//    outputHtml += "<ins>";
//    outputHtml += "Модель:";
//    outputHtml += "</ins>";
//    outputHtml += "</div>";
//
////    var modelTag = xmlDoc.getElementsByTagName("model")[0];
////    var meshName = modelTag.childNodes[0].nodeValue;
//
//    outputHtml += "<div class=\"detsil\" id=\"viewport\">";
//    //outputHtml += "<div class=\"width:500px;height:100px;border:1px solid #000;\" id=\"viewport\">";
//    outputHtml += "</div>";
//    outputHtml += "<br>";
//
//    return outputHtml;
//}
