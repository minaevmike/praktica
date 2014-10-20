////var FizzyText = function() {
////  this.message = 'dat.gui';
////  this.speed = 0.8;
////  this.displayOutline = false;
////  this.explode = function() {  };
////  // Define render logic ...
////};
//
//window.onload = function() {
// // var text = new FizzyText();
//  //var gui = new dat.GUI();
////  gui.add(text, 'message');
////  gui.add(text, 'speed', -5, 5);
////  gui.add(text, 'displayOutline');
////  gui.add(text, 'explode');
//};
//
////window.onload = function() {
////
////	fizzyText = new FizzyText();
////
////   //DAT.GUI.autoPlace = false;
////	gui = new dat.GUI();
////
////	//gui.domElement.style.position = 'absolute';
////	//gui.domElement.style.top = '0px';
////	//gui.domElement.style.left = '0px';
////
////	gui.add(fizzyText, 'addfile').name('Открыть');
////	gui_wireframe = gui.add(fizzyText, 'wireframe').options({'Заливка': 0, 'Фасетное': 1}).name('Отображение');
////	gui_opacity = gui.add(fizzyText, 'opacity', 0, 100, 1).min(0).max(100).step(1).name('Непрозрачность');
////	gui_color = gui.addColor(fizzyText, 'color').name('Цвет');
////	gui_hide = gui.add(fizzyText, 'hide').name('Скрыть');
////	gui.add(fizzyText, 'selectall').name('Выбрать все');
////	gui.add(fizzyText, 'disselectall').name('Сбросить выбор');
////	//Сценарии
////	script_menu = gui.addFolder('Сценарии');
////	//Сценарии вращения
////	rot_menu = script_menu.addFolder('Вращение');
////	rotscript = new Rot_Script();
////	rot_menu.add(rotscript, 'rotate').name('Добавить');
////	rotscript_x = rot_menu.add(rotscript, 'vec3_x',-10,10).name('X').step(1);
////	rotscript_y = rot_menu.add(rotscript, 'vec3_y',-10,10).name('Y').step(1);
////	rotscript_z = rot_menu.add(rotscript, 'vec3_z',-10,10).name('Z').step(1);
////	rotscript_ang = rot_menu.add(rotscript, 'r_angle',0,360).name('Угол').step(5);
////	rotscript_t = rot_menu.add(rotscript, 'r_time').name('Время(с)').min(0).step(1);
////
////	//Сценарии перемещения
////	mov_menu = script_menu.addFolder('Перемещение');
////	movscript = new Mov_Script();
////	mov_menu.add(movscript, 'move').name('Добавить');
////	rotscript_x = mov_menu.add(movscript, 'vec3_x',-10,10).name('X').step(1);
////	rotscript_y = mov_menu.add(movscript, 'vec3_y',-10,10).name('Y').step(1);
////	rotscript_z = mov_menu.add(movscript, 'vec3_z',-10,10).name('Z').step(1);
////	rotscript_dst = mov_menu.add(movscript, 'm_distance',0,100).name('Перемещение').step(5);
////	rotscript_t = mov_menu.add(movscript, 'm_time').name('Время(с)').min(0).step(1);
////
////	//Добавленные файлы
////	folder = gui.addFolder('Файлы');
////
////	gui_wireframe.onChange(function(value){
////		units_selected.forEach(function( unit ) {
////			if(value == 1){
////			//console.log('wireframe change : true');
////				//console.log(value);
////				unit.material.wireframe = true;
////			}//if
////			else{
////			//console.log('wireframe change : false');
////				//console.log(value);
////				unit.material.wireframe = false;
////			}//else
////        });//forEach
////	}//function
////	);//gui_wireframe.onChange
////
////	gui_color.onChange(function(value){
////		//console.log('color change : ' + value);
////		//console.log(value);
////		units_selected.forEach(function( unit ) {
////				unit.material.color.setStyle(value);
////        });//forEach
////	}//function
////	);//gui_color.onChange
////
////	gui_opacity.onChange(function(value){
////		//console.log('opacity change 1: ');
////		units_selected.forEach(function( unit ) {
////				unit.material.opacity = value/100;
////				//console.log('opacity change 2: ');
////				//props(list[i].mesh);
////        });//forEach
////	}//function
////	);//gui_opacity.onChange
////}//test_gui
////
////function add_file(){
////	filein = document.getElementById('filein');
////	if (filein){
////		filein.click();
////	}//if
////}//add_file
////
////function select_all(){
////	units_all.children.forEach(function( unit ) {
////		//units_selected[unit.id] = unit;
////		//console.log('Выбран элемент');
////		unit.folder_elem.setValue(true);
////	//	console.log(unit.folder_elem);
////    });//forEach
////}//select_all
////
////function disselect_all(){
////	units_all.children.forEach(function( unit ) {
////		//units_selected[unit.id] = unit;
////		unit.folder_elem.setValue(false);
////	//	console.log(unit.folder_elem);
////    });//forEach
////}//select_all
////
////function FizzyText() {
////	var that = this;
////
////	this.addfile = function() {add_file();};
////	this.wireframe = false;
////	this.opacity = 100;
////	this.color = "#7b7b7b";
////	this.hide = function() {
////		var visible_exists = false;
////		units_selected.forEach(function( unit ) {
////			if(unit.visible){
////				visible_exists = true;
////			}//if
////        });//forEach
////		units_selected.forEach(function( unit ) {
////				if(visible_exists){
////					unit.visible = false;
////				}//if
////				else{
////					unit.visible = true;
////				}
////        });//forEach
////	};//function
////	this.selectall = function() {select_all();};
////	this.disselectall = function() {disselect_all();};
////}//FizzyText
////
////function Rot_Script() {
////	var that = this;
////	this.vec3_x = 0;
////	this.vec3_y = 0;
////	this.vec3_z = 0;
////	this.r_angle = 0;
////	this.r_time = 0;
////	this.rotate = function() {
////		units_selected.forEach(function( unit ) {
////			MOVEROTATE.rotate(unit, new THREE.Vector3(that.vec3_x*0.1, that.vec3_y*0.1, that.vec3_z*0.1), that.r_angle, that.r_time);
////        });//forEach
////	};//function
////}//Rot_Script
////
////function Mov_Script() {
////	var that = this;
////	this.vec3_x = 0;
////	this.vec3_y = 0;
////	this.vec3_z = 0;
////	this.m_distance = 0;
////	this.m_time = 0;
////	this.move = function() {
////		units_selected.forEach(function( unit ) {
////			MOVEROTATE.move(unit, new THREE.Vector3(that.vec3_x*0.1, that.vec3_y*0.1, that.vec3_z*0.1), that.m_distance, that.m_time);
////        });//forEach
////	};//function
////}//Mov_Script