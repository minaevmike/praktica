//Объекты, необходимые для контроля камеры
var isMouseDown = false;                        //нажата ли левая клавиша мыши?
var onMouseDownPosition = new THREE.Vector2();  //позиция курсора мыши в момент нажатия левой кнопки
var scene, camera, renderer, geometry, material, mesh, bMeshIsLoaded;    //объекты для трехмерной визуализации
var loader;                                               //загрузчик
var fov;    //угол обзора
var redrawEvent = new CustomEvent(  //событие на отрисовку
    "render_event",
	{
		detail: {
			message: "Render Event",
			time: new Date(),
		},
		bubbles: true,
		cancelable: true
	}
);

var bIsFrameModeEnabled = false; //флаг, включающий/выключающий режим каркасной отрисовки
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
        document.addEventListener('render_event', OnRenderEvent, false);
        hookEvent(divElement, "mousewheel", OnDocumentMouseWheel);
    }

    //Функция подготавливает объекты, необходимые для визуализации
    function PrepareThreejsScene(divName)
    {
        //Создаем необходимые объекты - камеру и сцену
        var container = document.getElementById(divName);
        scene = new THREE.Scene();
        fov = 75.;
        camera = new THREE.PerspectiveCamera(fov, container.clientWidth/container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        camera.lookAt(scene.position);
        scene.add(camera);

        //Настраиваем рендер
        document.body.appendChild(container);
        renderer = new THREE.WebGLRenderer();

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColorHex(0x333F47, 1);
        container.appendChild(renderer.domElement);

        //Создаем материал для меша
        //material = new THREE.MeshPhongMaterial( {shading: THREE.FlatShading});  //Создали материал
        //material = new THREE.MeshPhongMaterial( {shading: THREE.SmoothShading});  //Создали материал
        material = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide, shading: THREE.FlatShading} );

        //Настраиваем свет
        var light = new THREE.PointLight();
        light.position = camera.position;
        scene.add(light);

        //Выключаем режим каркасного тображения
        bIsFrameModeEnabled = false;
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

            geometry.mergeVertices();
            geometry.computeVertexNormals();
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            //Устанавливаем камеру таким образом, чтобы загруженный объект полностью помещался в окно просмотра
            PositionCameraToFitObjectOnScreen(camera, mesh);

            //Перерисовываем сцену
            render();
        } );
    }

    //Функция создает геометрию
    function CreateGeometry(geomUrl)
    {
        loader.load( geomUrl );
    }

    //Функция позиционирует камеру таким образом, чтобы трехмерная сцена полностью помещалась на экране
    function PositionCameraToFitObjectOnScreen(cameraObj, meshObj)
    {
        var boundingSphereRadius = CalculateBoundingSphereRadius(meshObj);
        cameraObj.position.z = - 0.5 * boundingSphereRadius / Math.tan(fov * 0.5);
        cameraObj.updateMatrix();
    }

    //Функция вычисляет радиус ограничиващей сферы трехмерного объекта
    function CalculateBoundingSphereRadius(volumeObject)
    {
        volumeObject.geometry.computeBoundingSphere();
        return volumeObject.geometry.boundingSphere.radius;
    }

    //Функция отрисовки сцены
    function render() {
        renderer.render( scene, camera );
    }

    //Функция для обновления геометрии меша
    function UpdateMeshGeometry( geomUrl )
    {
        loader.load(geomUrl);
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

    function OnRenderEvent(event)
    {
        alert("render");
        render();
    }

    function OnDocumentMouseWheel( event )
    {
        event = event ? event : window.event;
        // Получить элемент, на котором произошло событие
        var wheelElem = event.target ? event.target : event.srcElement;
        // Получить значение поворота колесика мыши
        var wheelData = event.detail ? event.detail * -1 : event.wheelDelta / 40;
        // В движке WebKit возвращается значение в 100 раз больше
        if (Math.abs(wheelData)>100) { wheelData=Math.round(wheelData/100); }

        // Теперь в переменной wheelElem содержится элемент, который получил
        // собщение от колесика мыши, а в wheelData значение поворота колеса

        camera.position.z -= wheelData;
        camera.updateMatrix();

        render();

        // Отменить штатные действия браузера при кручении колеса мыши
        return cancelEvent(event);
    }

    function EnableFrameMode()
    {
        bIsFrameModeEnabled = true;
        mesh.material = new THREE.MeshPhongMaterial( {shading: THREE.FlatShading, wireframe: true});
    }

    function DisableFrameMode()
    {
        bIsFrameModeEnabled = false;
        mesh.material = new THREE.MeshPhongMaterial( {shading: THREE.FlatShading, wireframe: false});
    }
