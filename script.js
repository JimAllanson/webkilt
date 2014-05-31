pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;

var clothGeometry;
var sphere;
var object, arrow;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 50;
    camera.position.z = 1000;
    scene.add( camera );

    var light;

    scene.add( new THREE.AmbientLight( 0x666666 ) );

    light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );

    light.castShadow = true;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    var d = 300;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.5;

    scene.add( light );

    light = new THREE.DirectionalLight( 0x3dff0c, 0.35 );
    light.position.set( 0, -1, 0 );

    scene.add( light );

    var clothTexture = THREE.ImageUtils.loadTexture( 'kilt.png' );
    clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
    clothTexture.anisotropy = 16;

    var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, ambient: 0xffffff, color: 0xffffff, specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

    clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );
    clothGeometry.dynamic = true;
    clothGeometry.computeFaceNormals();

    var uniforms = { texture:  { type: "t", value: clothTexture } };
    var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

    object = new THREE.Mesh( clothGeometry, clothMaterial );
    object.position.set( 0, 0, 0 );
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add( object );

    object.customDepthMaterial = new THREE.ShaderMaterial( { uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader } );

   var ballGeo = new THREE.SphereGeometry( ballSize, 20, 20 );
    var ballMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    sphere = new THREE.Mesh( ballGeo, ballMaterial );
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );

    arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50, 0xff0000 );
    arrow.position.set( -200, 0, -200 );

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.physicallyBasedShading = true;
    renderer.shadowMapEnabled = true;

    window.addEventListener( 'resize', onWindowResize, false );
    sphere.visible = !true
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
    requestAnimationFrame( animate );
    var time = Date.now();

    windStrength = Math.cos( time / 7000 ) * 10 + 10;
    windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) ).normalize().multiplyScalar( windStrength );
    arrow.setLength( windStrength );
    arrow.setDirection( windForce );

    simulate(time);
    render();
}

function render() {
    var p = cloth.particles;
    for ( var i = 0, il = p.length; i < il; i ++ ) {
        clothGeometry.vertices[ i ].copy( p[ i ].position );
    }
    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();
    clothGeometry.normalsNeedUpdate = true;
    clothGeometry.verticesNeedUpdate = true;
    sphere.position.copy( ballPosition );
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}