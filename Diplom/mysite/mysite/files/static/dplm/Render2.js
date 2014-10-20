//Объекты, необходимые для контроля камеры
var isMouseDown = false;                        //нажата ли левая клавиша мыши?
var onMouseDownPosition = new THREE.Vector2();  //позиция курсора мыши в момент нажатия левой кнопки
var scene, camera, renderer, geometry, material, mesh, bMeshIsLoaded;    //объекты для трехмерной визуализации
var loader;                                               //загрузчик

//==========================================================================================================
//Функции---------------------------------------------------------------------------------------------------

    //Инициализация сцены
    function InitScene(divElementName, geomUrl)
    {
        SetEventListeners(divElementName);
        PrepareThreejsScene(divElementName);
        PrepareStlLoader();
        CreateGeometry(geomUrl);
    }

    //Установка обработчиков событий
    function SetEventListeners(divName)
    {
        var divElement = document.getElementById(divName);
        divElement.addEventListener( 'mousemove', OnDocumentLeftMouseMove, false );
        divElement.addEventListener( 'mousedown', OnDocumentLeftMouseDown, false );
        divElement.addEventListener( 'mouseup', OnDocumentLeftMouseUp, false );
        divElement.addEventListener( 'mousewheel', OnDocumentMouseWheel, false );
    }

    //Функция подготавливает объекты, необходимые для визуализации
    function PrepareThreejsScene(divName)
    {
        //Создаем необходимые объекты - камеру и сцену
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        camera.lookAt(scene.position);//TODO: возможно это нужно поместить в другое место
        scene.add(camera);

        //Настраиваем рендер
        var container = document.getElementById(divName);
        document.body.appendChild(container);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(600, 600); //TODO: тут лучше всего получать размер из самом div элемента
        renderer.setClearColorHex(0x333F47, 1);
        container.appendChild(renderer.domElement);

        //Создаем материал для меша
        material = new THREE.MeshPhongMaterial( {shading: THREE.FlatShading});  //Создали материал

        //Создаем пустой меш
//        geometry = new THREE.Geometry();
//        mesh = new THREE.Mesh(geometry, material);
//        scene.add(mesh);

        //Настраиваем свет
        var light = new THREE.PointLight();
        light.position = camera.position;
        scene.add(light);
    }

    //Функция инициализирует загрузчик STL
    function PrepareStlLoader()
    {
        loader = new THREE.STLLoader();
        loader.addEventListener( 'load', function ( event ) {
            var geometry = event.content;

            if ( mesh != undefined) {
               scene.remove(mesh);
            }

            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        } );
    }

    //Функция создает геометрию
    function CreateGeometry(geomUrl)
    {
       loader.load( geomUrl );
//        mesh = new THREE.Mesh(geometry, material);
//        scene.add(mesh);
        //loader.load("http://localhost:8000/media/dplm/meshes/tractor.STL");
    }

    //Функция отрисовки сцены
    function render() {
        renderer.render( scene, camera );
    }

    //Функция для обновления геометрии меша
    function UpdateMeshGeometry( geomUrl )
    {
        loader.load(geomUrl);
//        mesh.geometry.dynamic = true;
//        mesh.geometry.vertices = geometry.vertices;
//        mesh.geometry.verticesNeedUpdate = true;
    }

    //Функции для обработки действий пользователя-----------------------------------------------------------
    function OnDocumentLeftMouseDown(event)
    {
        event.preventDefault();

        isMouseDown = true;

        onMouseDownPosition.x = event.clientX;
        onMouseDownPosition.y = event.clientY;
    }

    function OnDocumentLeftMouseUp(event)
    {
        event.preventDefault();

        isMouseDown = false;

        onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
        onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;
    }

   function OnDocumentLeftMouseMove( event )
    {
        event.preventDefault();

        if ( isMouseDown ) {
            var mouseMoveX = event.clientX - onMouseDownPosition.x;
            var mouseMoveY = event.clientY - onMouseDownPosition.y;

            //Вращаем геометрию вместо камеры
            mesh.rotation.x += mouseMoveY * 0.005;
            mesh.rotation.z += mouseMoveX * 0.005;

            onMouseDownPosition.x = event.clientX;
            onMouseDownPosition.y = event.clientY;
        }

        render();
    }

    function OnDocumentMouseWheel( event )
    {
        event.preventDefault();
        alert("wheel");
        //radious -= event.wheelDeltaY;

        camera.position.z += event.wheelDeltaY;
        camera.updateMatrix();

        render();
    }
