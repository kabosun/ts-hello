class Hello {
    private count = 0;

    public constructor() {
        console.log("Hello World!!");
    }

    public tick() : void {
        this.count++;
        console.log("count", this.count);
    }

    public init() : void {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas");
        if (canvas === null)
        {
            console.log("canvas is null");
        }

        canvas.width = 500;
        canvas.height = 300;
        var gl = canvas.getContext("webgl");

        gl.clearColor(1.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var v_shader = this.createShader('vs');
        console.log('vs:' + v_shader);
        var f_shader = this.createShader('fs');
        console.log('fs:' + f_shader);
        var program = this.createProgram(v_shader, f_shader);
        var attLocation = gl.getAttribLocation(program, 'position');
        var attStrie = 3;
        var vertex_position = [
            0.0, 1.0, 0.0,
            1.0, 0.0, 0.0,
           -1.0, 0.0, 0.0,
        ];
        var vbo = this.createVbo(vertex_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.enableVertexAttribArray(attLocation);
        gl.vertexAttribPointer(attLocation, attStrie, gl.FLOAT, false, 0, 0);

        var m = new matIV();
    
        // 各種行列の生成と初期化
        var mMatrix = m.identity(m.create());
        var vMatrix = m.identity(m.create());
        var pMatrix = m.identity(m.create());
        var mvpMatrix = m.identity(m.create());
        
        // ビュー座標変換行列
        m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
        
        // プロジェクション座標変換行列
        m.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix);
        
        // 各行列を掛け合わせ座標変換行列を完成させる
        m.multiply(pMatrix, vMatrix, mvpMatrix);
        m.multiply(mvpMatrix, mMatrix, mvpMatrix);
        
        // uniformLocationの取得
        var uniLocation = gl.getUniformLocation(program, 'mvpMatrix');
        
        // uniformLocationへ座標変換行列を登録
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        
        // モデルの描画
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        
        // コンテキストの再描画
        gl.flush();
    }

    public createShader(id) : void {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas");
        var gl = canvas.getContext("webgl");
        var shader;
        var scriptElement = document.getElementById(id);

        if (!scriptElement) {
            console.log('none element');
            return;
        }

        switch(scriptElement.type) {
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default:
                console.log('none');
                return;
        }
        console.log(scriptElement.text);
        gl.shaderSource(shader, scriptElement.text);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            console.log('error');
            alert(gl.getShaderInfoLog(shader));
        }
    }

    public createProgram(vs, fs) {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas");
        var gl = canvas.getContext("webgl");

        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            return program;
        } else {
            alert(gl.getProgramInfoLog(program));
        }
    }

    public createVbo(data) : void {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas");
        var gl = canvas.getContext("webgl");
        var vbo = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return vbo;
    }
}

var hello = new Hello();

function main() {
    hello.tick();
    setTimeout(main, 10000);
}

onload = function() {
    // 初期化
    hello.init();

    // メインループ
    // main();
}