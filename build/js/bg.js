//©Blu2020
{
  //get generic
  const {
    alert,
    Browser,
    debounce,
    devicePixelRatio,
    Event,
    WebGL2RenderingContext
  } = window;
  //set generic
  let { initBg } = window;
  //-//
  const _L = new Proxy(
    {},
    {
      get: (obj, prop, val) => {
        {
          const _app = "L";

          !window[_app] && [(window[_app] = {})];
          !window[_app][prop] && [(window[_app][prop] = {})];
          for (const key of Object.keys(window.L)) {
            window[_app][key] = window[key];
          }
        }
        return window[prop];
      },
      set: function(obj, prop, val) {
        const _app = "L";
        window[prop] = val;
        !window[_app] && [(window[_app] = {})],
          !window[_app][prop] && [(window[_app][prop] = {})];
        window[_app][prop] = val;
      }
    }
  );
  let { LOADED } = _L;
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  initBg = () => {
    "use strict";
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.append(canvas);
    const gl = canvas.getContext("webgl2", { antialias: false });
    ping(gl);
    window.addEventListener("resize", () => fscn(gl));
    // --- vshader, share among basic geoms
    const vss = `#version 300 es
in vec4 P;
in lowp vec4 C;
uniform mat4 M0;
uniform mat4 M1;
out lowp vec4 vC;
void main() {
    // trnp is used just becuz i hvn't made "matlib" in js....
    gl_Position = transpose(M0) * transpose(M1) * P;
    vC = C;
}
`;
    const fss = `#version 300 es
precision mediump float;
out vec4 o;
in lowp vec4 vC;
void main() {
  o = vC;
}
`;
    let prg;
    try {
      prg = mkprg(gl, vss, fss);
    } catch (e) {
      alert("failed to mk prg, see console, bye");
      throw e;
    }
    var Box;
    (function(Box_1) {
      // --- internal
      const vrts = new Float32Array([
        -0.5,
        -0.5,
        -0.5,
        +0.5,
        -0.5,
        -0.5,
        +0.5,
        +0.5,
        -0.5,
        -0.5,
        +0.5,
        -0.5,
        -0.5,
        -0.5,
        +0.5,
        +0.5,
        -0.5,
        +0.5,
        +0.5,
        +0.5,
        +0.5,
        -0.5,
        +0.5,
        +0.5
      ]);
      const idxs = new Uint16Array([
        1,
        5,
        6,
        1,
        6,
        2,
        4,
        0,
        3,
        4,
        3,
        7,
        3,
        2,
        6,
        3,
        6,
        7,
        4,
        5,
        1,
        4,
        1,
        0,
        5,
        4,
        7,
        5,
        7,
        6,
        0,
        1,
        2,
        0,
        2,
        3
      ]);
      const shader = prg;
      const info = qprg(shader);
      // share among all boxes
      let vrtsObj;
      let idxsObj;
      function mk(
        gl,
        color = [0, 0, 0, 0] // rgba in [0,255]
      ) {
        if (!vrtsObj) {
          vrtsObj = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vrtsObj);
          gl.bufferData(gl.ARRAY_BUFFER, vrts, gl.STATIC_DRAW);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        if (!idxsObj) {
          idxsObj = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxsObj);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idxs, gl.STATIC_DRAW);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
        // --- vao (each inst has own vao)
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        // --- "attrib vec4 P"
        gl.bindBuffer(gl.ARRAY_BUFFER, vrtsObj);
        gl.enableVertexAttribArray(info.a.P);
        gl.vertexAttribPointer(info.a.P, 3, gl.FLOAT, false, 0, 0);
        // --- draw order
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxsObj);
        // --- "atttib lowp vec4 color"
        const clrs = new Uint8Array([
          ...color,
          ...color,
          ...color,
          ...color,
          0,
          0,
          0,
          255,
          0,
          0,
          0,
          255,
          0,
          0,
          0,
          255,
          0,
          0,
          0,
          255
        ]);
        const clrsObj = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, clrsObj);
        gl.bufferData(gl.ARRAY_BUFFER, clrs, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(info.a.C);
        gl.vertexAttribPointer(info.a.C, 4, gl.UNSIGNED_BYTE, true, 0, 0);
        // --- done (unbind vao)
        gl.bindVertexArray(null);
        return new Box(gl, vao);
      }
      Box_1.mk = mk;
      // internal
      class Box {
        constructor(gl, vao) {
          this.gl = gl;
          this.vao = vao;
          this.mat = identity4();
          this.pos = new Float32Array([0, 0, 0]);
          this.avel = new Float32Array([0, 0, 0]);
        }
        render(proj) {
          this.gl.useProgram(shader);
          this.gl.bindVertexArray(this.vao);
          this.gl.uniformMatrix4fv(info.u.M0, false, proj);
          this.gl.uniformMatrix4fv(info.u.M1, false, this.mat);
          this.gl.drawElements(
            this.gl.TRIANGLES,
            36,
            this.gl.UNSIGNED_SHORT,
            0
          );
          this.gl.bindVertexArray(null);
        }
      }
    })(Box || (Box = {}));
    // ---- preload
    // --- projector stub ---
    const orthoProj = ortho();
    let proj = clone4(orthoProj);
    const fillContain = (r, proj) => {
      r > 1
        ? mul4(scale4(1 / r, 1, 1), orthoProj, proj)
        : mul4(scale4(1, r, 1), orthoProj, proj);
    };
    const fillCover = (r, proj) => {
      r > 1
        ? mul4(scale4(1, r, 1), orthoProj, proj)
        : mul4(scale4(1 / r, 1, 1), orthoProj, proj);
    };
    let frozen = false;
    window.addEventListener("resize", () => {
      frozen = false;
      fillCover(canvas.width / canvas.height, proj);
    });
    // --- boxes
    const boxes = [];
    const W = 40,
      H = 40,
      D = 1;
    const RANGE = [-1, 1];
    const len = RANGE[1] - RANGE[0];
    const sc = 0.1;
    for (let k = 0; k < D; ++k) {
      for (let j = 0; j < H; ++j) {
        for (let i = 0; i < W; ++i) {
          const color = [(i / W) * 256, (j / H) * 256, 255, 10];
          const box = Box.mk(gl, color);
          box.pos[0] = RANGE[0] + len * (i / (W - 1));
          box.pos[1] = RANGE[0] + len * (j / (H - 1));
          box.pos[2] = 0;
          mul4c(
            [
              move4v(box.pos),
              rx4(Math.PI / 6),
              ry4(Math.PI * 2 * Math.random()),
              rz4(Math.PI / 6 + Math.random() * Math.PI),
              scale4(sc, sc, sc * 2)
            ],
            box.mat
          );
          box.avel[2] = 0.005 + Math.random() * 0.005;
          boxes.push(box);
        }
      }
    }
    // ---- render
    gl.clearColor(0, 0, 0, 1);
    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    function render(gl, dt) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      for (const box of boxes) {
        box.render(proj);
        mul4c(
          [
            move4v(box.pos),
            // rx4(0.01),
            rz4(box.avel[2]),
            move4(-box.pos[0], -box.pos[1], -box.pos[2]),
            clone4(box.mat)
          ],
          box.mat
        );
      }
    }
    // trigger once
    window.dispatchEvent(new Event("resize"));
    raf(render);
    setTimeout(() => render, 999);
    function raf(f) {
      const sch =
        "requestPostAnimationFrame" in window
          ? window.requestPostAnimationFrame
          : window.requestAnimationFrame;
      let t0 = Date.now();
      (function g() {
        if (!frozen) {
          //sch(g);
          frozen=true;
          let now = Date.now();
          f(gl, (now - t0) / 1e3);
          t0 = now;
          if (Browser.isMobileChrome || Browser.isSafari) frozen = true;
        }
      })();
    }
    // helper: make shader program
    function mkprg(gl, vss, fss) {
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, vss);
      gl.compileShader(vs);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, fss);
      gl.compileShader(fs);
      const prg = gl.createProgram();
      gl.attachShader(prg, vs);
      gl.attachShader(prg, fs);
      gl.linkProgram(prg);
      let ok = false;
      if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        console.error("vs er", gl.getShaderInfoLog(vs));
        console.error("fs er", gl.getShaderInfoLog(fs));
        console.error("prg er", gl.getProgramInfoLog(prg));
      } else {
        ok = true;
      }
      gl.detachShader(prg, vs);
      gl.deleteShader(vs);
      gl.detachShader(prg, fs);
      gl.deleteShader(fs);
      if (!ok) {
        throw "shd prg link err";
      }
      return prg;
    }
    // helper: query shader program (locations)
    function qprg(prg) {
      const u = {};
      const a = {};
      for (
        let i = 0;
        i <
        (gl === null || gl === void 0
          ? void 0
          : gl.getProgramParameter(prg, gl.ACTIVE_UNIFORMS));
        ++i
      ) {
        const { name } =
          gl === null || gl === void 0 ? void 0 : gl.getActiveUniform(prg, i);
        const loc =
          gl === null || gl === void 0
            ? void 0
            : gl.getUniformLocation(prg, name); // is object ..
        u[name] = loc;
      }
      for (
        let i = 0;
        i <
        (gl === null || gl === void 0
          ? void 0
          : gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES));
        ++i
      ) {
        const { name } =
          gl === null || gl === void 0 ? void 0 : gl.getActiveAttrib(prg, i);
        const loc =
          gl === null || gl === void 0
            ? void 0
            : gl.getAttribLocation(prg, name); // is number ..
        a[name] = loc;
      }
      return { a, u };
    }
    // helper: fill entire screen
    function fscn(gl) {
      const c = gl.canvas;
      if (c instanceof HTMLCanvasElement) {
        const { width, height } = getComputedStyle(c);
        c.width = Math.ceil(parseFloat(width)) * devicePixelRatio;
        c.height = Math.ceil(parseFloat(height)) * devicePixelRatio;
        gl.viewport(0, 0, c.width, c.height);
      } else {
        throw new Error("offscreen? nah, bye");
      }
    }
    // helper: asserts gl is webgl2 rendering ctx
    function ping(x) {
      if (!(x instanceof WebGL2RenderingContext)) {
        throw new Error("wgl2 ctx, nah");
      }
    }
    // -------------- matlib stub -------------
    // helper: create mat4 (row major)
    //         I will transpose the matrix in shader. Hah
    //
    // maths | 0 1 2 3 | === [0, 1, 2, 3
    //       | 4 5 6 7 |      4, 5, 6, 7
    //       | 8 9 a b |      ..
    //       | c d e f |                ]
    function mat4(xs) {
      return new Float32Array(xs);
    }
    function identity4() {
      return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    function clone4(m) {
      return Float32Array.from(m);
    }
    // mul mat m and mat n, put result into mat o
    //      m          n
    // | 0 1 2 3 || 0 1 2 3 |
    // | 4 5 6 7 || 4 5 6 7 |
    // | 8 9 a b || 8 9 a b |
    // | c d e f || c d e f |
    function mul4(m, n, o) {
      o || (o = identity4());
      // row 1
      o[0] = m[0] * n[0] + m[1] * n[4] + m[2] * n[8] + m[3] * n[0xc];
      o[1] = m[0] * n[1] + m[1] * n[5] + m[2] * n[9] + m[3] * n[0xd];
      o[2] = m[0] * n[2] + m[1] * n[6] + m[2] * n[0xa] + m[3] * n[0xe];
      o[3] = m[0] * n[3] + m[1] * n[7] + m[2] * n[0xb] + m[3] * n[0xf];
      // row 2
      o[4] = m[4] * n[0] + m[5] * n[4] + m[6] * n[8] + m[7] * n[0xc];
      o[5] = m[4] * n[1] + m[5] * n[5] + m[6] * n[9] + m[7] * n[0xd];
      o[6] = m[4] * n[2] + m[5] * n[6] + m[6] * n[0xa] + m[7] * n[0xe];
      o[7] = m[4] * n[3] + m[5] * n[7] + m[6] * n[0xb] + m[7] * n[0xf];
      // row 3
      o[8] = m[8] * n[0] + m[9] * n[4] + m[0xa] * n[8] + m[0xb] * n[0xc];
      o[9] = m[8] * n[1] + m[9] * n[5] + m[0xa] * n[9] + m[0xb] * n[0xd];
      o[0xa] = m[8] * n[2] + m[9] * n[6] + m[0xa] * n[0xa] + m[0xb] * n[0xe];
      o[0xb] = m[8] * n[3] + m[9] * n[7] + m[0xa] * n[0xb] + m[0xb] * n[0xf];
      // row 4
      o[0xc] = m[0xc] * n[0] + m[0xd] * n[4] + m[0xe] * n[8] + m[0xf] * n[0xc];
      o[0xd] = m[0xc] * n[1] + m[0xd] * n[5] + m[0xe] * n[9] + m[0xf] * n[0xd];
      o[0xe] =
        m[0xc] * n[2] + m[0xd] * n[6] + m[0xe] * n[0xa] + m[0xf] * n[0xe];
      o[0xf] =
        m[0xc] * n[3] + m[0xd] * n[7] + m[0xe] * n[0xb] + m[0xf] * n[0xf];
      return o;
    }
    // mul array of mats, starting from end..
    function mul4c(ms, o) {
      o || (o = identity4());
      let i = ms.length - 2;
      let n = Float32Array.from(ms[i + 1]); // copy
      while (i >= 0) {
        mul4(ms[i], n, o);
        n.set(o);
        --i;
      }
      return o;
    }
    // stub.. (because vertices already in clipspace, LOL)
    function ortho() {
      return mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    function rz4(a) {
      const c = Math.cos(a);
      const s = Math.sin(a);
      return mat4([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    function rx4(a) {
      const c = Math.cos(a);
      const s = Math.sin(a);
      return mat4([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
    }
    function ry4(a) {
      const c = Math.cos(a);
      const s = Math.sin(a);
      return mat4([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
    }
    function scale4(sx, sy, sz) {
      return mat4([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
    }
    function move4(mx, my, mz) {
      return mat4([1, 0, 0, mx, 0, 1, 0, my, 0, 0, 1, mz, 0, 0, 0, 1]);
    }
    function move4v(xs) {
      return mat4([1, 0, 0, xs[0], 0, 1, 0, xs[1], 0, 0, 1, xs[2], 0, 0, 0, 1]);
    }
  };
  window.done = () =>
    setTimeout(() => {
      $("aside[name=loader]").style.display = "none";
      //remove blur class
      $("content").classList.remove("loading");
      LOADED = true;

      //Control.
      for (const key of Object.keys(window.L)) {
        window.L[key] = window[key];
      }
    }, 999);
}
