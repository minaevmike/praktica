/**
 * Created by Mike on 26.10.2014.
 */
function create_project(){
    document.getElementById('create_project_form').style.visibility ='visible';
}

function open_project(){
    var selector = document.getElementById('projects_selector');
    var s = selector.options[selector.selectedIndex].innerHTML;
    location.href = '/dplm/?project=' + s;
}