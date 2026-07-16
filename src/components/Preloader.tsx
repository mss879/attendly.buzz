"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Logo } from "@/components/Logo";

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(true);

  // WebGL Shader Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Handle resolution & resizing
    const handleResize = () => {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio, 1.5); // cap DPR at 1.5 for mobile performance
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Full screen quad geometry
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Morphing orange/cream fluid shader
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
          return a + b*cos( 6.28318*(c*t+d) );
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;
          uv.x *= u_resolution.x / u_resolution.y;

          vec2 uv0 = uv;
          vec3 finalColor = vec3(0.0);
          
          for (float i = 0.0; i < 2.0; i++) {
              uv = fract(uv * 1.4) - 0.5;

              float d = length(uv) * exp(-length(uv0));

              vec3 col = palette(length(uv0) + i*0.4 + u_time*0.15, 
                  vec3(0.8, 0.4, 0.1), 
                  vec3(0.6, 0.2, 0.0), 
                  vec3(1.0, 1.0, 1.0), 
                  vec3(0.0, 0.25, 0.25)
              );

              d = sin(d*8.0 + u_time*0.4)/8.0;
              d = abs(d);

              d = pow(0.012 / d, 1.2);

              finalColor += col * d;
          }
          
          float intensity = clamp((finalColor.r + finalColor.g + finalColor.b) / 3.0, 0.0, 1.0);
          
          // Cream (#f7f4f0) base
          vec3 cream = vec3(0.97, 0.96, 0.94);
          vec3 orange = vec3(0.97, 0.45, 0.09); // #f97316
          vec3 dark = vec3(0.4, 0.12, 0.0); // depth
          
          vec3 color = mix(cream, mix(orange, dark, intensity), intensity);
          
          gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile helpers
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Buffer setup
    const vertices = new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");

    let animationFrameId: number;
    let startTime = Date.now();

    const render = () => {
      if (!gl || !canvas) return;
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);

      gl.clearColor(0.97, 0.96, 0.94, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  // Lock body scroll during load
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // GSAP 3D Hinge Welcome Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setMounted(false);
          if (onComplete) onComplete();
        },
      });

      // Initial gentle hanging swing
      gsap.fromTo(
        ".welcome-sign",
        { rotation: -2, transformOrigin: "top center" },
        {
          rotation: 2,
          transformOrigin: "top center",
          repeat: -1,
          yoyo: true,
          duration: 2.2,
          ease: "sine.inOut",
        }
      );

      // 1. Right hinge breaks, swing down hanging by left
      tl.to(".welcome-sign", {
        rotation: 75,
        transformOrigin: "20px 20px", // top-left area
        ease: "back.out(2.5)",
        duration: 1.0,
        delay: 1.8, // display preloader for ~2 seconds
      });

      // Swing back slightly
      tl.to(".welcome-sign", {
        rotation: 60,
        transformOrigin: "20px 20px",
        ease: "sine.inOut",
        duration: 0.5,
      });

      // 2. Fall down with gravity acceleration
      tl.to(".welcome-sign", {
        y: "120vh",
        rotation: 85,
        opacity: 0,
        ease: "power2.in",
        duration: 0.8,
      });

      // 3. Doors swing open in 3D + canvas fades out
      tl.to(
        ".left-panel",
        {
          rotateY: -110,
          opacity: 0,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "-=0.2"
      );

      tl.to(
        ".right-panel",
        {
          rotateY: 110,
          opacity: 0,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "<"
      );

      tl.to(
        ".webgl-canvas",
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "<"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#f7f4f0]"
      style={{ perspective: "1200px" }}
    >
      {/* WebGL Canvas in background */}
      <canvas
        ref={canvasRef}
        className="webgl-canvas absolute inset-0 h-full w-full transition-opacity duration-300"
      />

      {/* Double Glass Doors */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="left-panel w-1/2 h-full bg-[#f7f4f0]/20 border-r border-orange-950/5 origin-left backdrop-blur-[3px] shadow-[inset_-10px_0_30px_rgba(234,88,12,0.03)]" />
        <div className="right-panel w-1/2 h-full bg-[#f7f4f0]/20 border-l border-orange-950/5 origin-right backdrop-blur-[3px] shadow-[inset_10px_0_30px_rgba(234,88,12,0.03)]" />
      </div>

      {/* Welcome Sign (Hinged Board) */}
      <div className="welcome-sign relative z-10 flex flex-col items-center gap-2 rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-black/[0.03] backdrop-blur-md max-w-[280px] sm:max-w-xs text-center border border-white/60">
        {/* Mock chain connectors */}
        <div className="absolute -top-3 left-1/4 h-3.5 w-1 bg-slate-400 rounded" />
        <div className="absolute -top-3 right-1/4 h-3.5 w-1 bg-slate-400 rounded" />

        <Logo accent="orange" size="lg" />
        
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-800/80">
            Entering Experience
          </span>
        </div>
      </div>
    </div>
  );
}
