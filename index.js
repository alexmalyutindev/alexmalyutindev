initWebGL();

function initWebGL() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');

    // Shader
    const vertexSrc = `
        attribute vec4 aVertex;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertex;
        }
    `;
    const fragmentSrc = `
        void main() {
            gl_FragColor = 1.0;
        }
    `;

    shaderId = "vertex";
    type = gl.VERTEX_SHADER;

    var vertex = gl.createShader(gl.VERTEX_SHADER);
    var fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertex, vertexSrc);
    gl.compileShader(vertex);

    gl.shaderSource(fragment, fragmentSrc);
    gl.compileShader(fragment);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertex);
    gl.attachShader(shaderProgram, fragment);
    gl.linkProgram(shaderProgram);


    // Map of shader data
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertex'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    // Vertex Buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    // Prepare Render
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera Frustum
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // MVP Matrix
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix,
        modelViewMatrix,
        [0.0, 0.0, -6.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        gl.getAttribLocation(shaderProgram, 'position'),
        2, gl.FLOAT,
        false, 0, 0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);


    // Render
    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}