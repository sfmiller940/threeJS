
window.onload = function(){
	// Setup scene
	var scene = new THREE.Scene();
	
	// Scene lights
	var ambientLight = new THREE.AmbientLight( 0xffffff );
	scene.add( ambientLight );

	var lights = [];
	lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
	lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
	lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );

	lights[0].position.set( 0, 2000, 0 );
	lights[1].position.set( 1000, 2000, 1000 );
	lights[2].position.set( -1000, -2000, -1000 );

	scene.add( lights[0] );
	scene.add( lights[1] );
	scene.add( lights[2] );

	//Setup camera
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
	camera.position.z = 1500;
	
	// Camera controls
	var controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );

	//Setup renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	// Add objects to scene
	var Hopf = function(zeta1,zeta2,eta){
		var X1 = Math.cos( zeta1 + zeta2) * Math.sin(eta);	
		var X2 = Math.sin( zeta1 + zeta2) * Math.sin(eta);	
		var X3 = Math.cos( zeta1 - zeta2) * Math.cos(eta);	
		var X4 = Math.sin( zeta1 - zeta2) * Math.cos(eta);
		var norm = (1 + X4);
		if( norm == 0){ return false; }
		X1 = X1 / norm;	
		X2 = X2 / norm;	
		X3 = X3 / norm;
		norm = 1 + Math.sqrt( X1*X1 + X2*X2 + X3*X3  );
		X1 = 1000 * X1 / norm;	
		X2 = 1000 * X2 / norm;	
		X3 = 1000 * X3 / norm;
		return new THREE.Vector3(X1, X2, X3);
	};
	
	var TAU = 2 * Math.PI;
	var curves = [];
	var numSeg = 16;
	for (var i=0; i < numSeg; i++){
		newCurve: for (var k=0; k < 12; k++){
			var vectors = [];
			for (var j=0; j < 100; j++){
				var Vect = Hopf( TAU * i / numSeg, TAU * j / 100,  k * Math.PI / 24);
				if( Vect !== false){ vectors.push( Vect ); }
				else{ continue newCurve; }
			}
			var curve = new THREE.ClosedSplineCurve3( vectors );
			var geometry = new THREE.TubeGeometry(curve,60,5,12,true);
			var material = new THREE.MeshLambertMaterial({color:0xcccccc});
			curves.push( new THREE.Mesh( geometry, material ) );
			scene.add( curves[ curves.length - 1 ] );
			var vectors = [];
			for (var j=0; j < 100; j++){
				var Vect = Hopf( TAU * j / 100, TAU * i / numSeg,  k * Math.PI / 24 );
				if( Vect !== false){ vectors.push( Vect ); }
				else{ continue newCurve; }
			}
			var curve = new THREE.ClosedSplineCurve3( vectors );
			var geometry = new THREE.TubeGeometry(curve,60,5,12,true);
			var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
			curves.push( new THREE.Mesh( geometry, material ) );
			scene.add( curves[ curves.length - 1 ] );
		}
	}
	
	// Animate
	var count = 0;
	var render = function () {
		requestAnimationFrame( render );
		count = (count+1)%600;

		for( var i =0; i < curves.length; i++){	
			//curves[i].material.color.setHSL( ( ( i / curves.length) + (count/600) ) % 1,1,0.5);
			ambientLight.color.setHSL( count / 600, 1, 0.5 );
			if (document.getElementById('rotate').checked) {
				curves[i].rotation.x += 0.005;
				curves[i].rotation.y += 0.005;
			}
		}
		
		renderer.render(scene, camera);
		controls.update();
	};
	render();
	
	// Setup resize
	window.addEventListener( 'resize', function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );
};
