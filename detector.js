/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {
    canvas: !! window.CanvasRenderingContext2D,
    webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )(),
    workers: !! window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,

    getWebGLErrorMessage: function () {
        var element = document.createElement( 'div' );
        element.className = 'webgl-error-message';
        if ( ! this.webgl ) {
            element.innerHTML = '<img src="http://i1.adis.ws/i/JIMC/kilt.png?w=400" class="kilt" alt="Photo of a Kilt">'
        }
        return element;
    },

    addGetWebGLMessage: function ( parameters ) {
        var parent, id, element;

        parameters = parameters || {};

        parent = parameters.parent !== undefined ? parameters.parent : document.body;
        id = parameters.id !== undefined ? parameters.id : 'oldie';

        element = Detector.getWebGLErrorMessage();
        element.id = id;

        parent.appendChild( element );
    }
};