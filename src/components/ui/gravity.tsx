"use client";

import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import Matter, {
  Bodies,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
} from "matter-js";

import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const SVGPathCommander = require("svg-path-commander");

// Convert SVG path "d" attribute to Matter.js vertices
function parsePathToVertices(path: string, sampleLength = 15) {
  const commander = new SVGPathCommander(path);
  const points: { x: number; y: number }[] = [];
  let lastPoint: { x: number; y: number } | null = null;
  const totalLength = commander.getTotalLength();
  let length = 0;

  while (length < totalLength) {
    const point = commander.getPointAtLength(length);
    if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
      points.push({ x: point.x, y: point.y });
      lastPoint = point;
    }
    length += sampleLength;
  }

  const finalPoint = commander.getPointAtLength(totalLength);
  if (lastPoint && (finalPoint.x !== lastPoint.x || finalPoint.y !== lastPoint.y)) {
    points.push({ x: finalPoint.x, y: finalPoint.y });
  }

  return points;
}

function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number
) {
  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100;
    return containerSize * percentage;
  }
  return typeof value === "number"
    ? value
    : elementSize - containerSize + elementSize / 2;
}

type GravityProps = {
  children: ReactNode;
  debug?: boolean;
  gravity?: { x: number; y: number };
  resetOnResize?: boolean;
  grabCursor?: boolean;
  addTopWall?: boolean;
  autoStart?: boolean;
  /** When true, the floor is placed at window.innerHeight instead of
   *  the canvas bottom — keeps physics bodies inside the visible viewport
   *  when the canvas container is taller than the screen. */
  floorAtViewport?: boolean;
  /** Raise the floor by this many pixels from the bottom. Useful for
   *  keeping bodies above a fixed UI element like a cookie banner. */
  floorOffset?: number;
  /** When true, skips mouse/touch drag and instead drives gravity from
   *  the device gyroscope (DeviceOrientationEvent). Designed for mobile. */
  enableGyroscope?: boolean;
  className?: string;
};

type PhysicsBody = {
  element: HTMLElement;
  body: Matter.Body;
  props: MatterBodyProps;
};

type MatterBodyProps = {
  children: ReactNode;
  matterBodyOptions?: Matter.IBodyDefinition;
  isDraggable?: boolean;
  bodyType?: "rectangle" | "circle" | "svg";
  sampleLength?: number;
  x?: number | string;
  y?: number | string;
  angle?: number;
  className?: string;
};

export type GravityRef = {
  start: () => void;
  stop: () => void;
  reset: () => void;
};

const GravityContext = createContext<{
  registerElement: (id: string, element: HTMLElement, props: MatterBodyProps) => void;
  unregisterElement: (id: string) => void;
} | null>(null);

const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(GravityContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;
    context.registerElement(idRef.current, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    });
    return () => context.unregisterElement(idRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn("absolute", className, isDraggable && "pointer-events-none")}
    >
      {children}
    </div>
  );
};

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      floorAtViewport = false,
      floorOffset = 0,
      enableGyroscope = false,
      className,
      ...props
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null);
    const engine = useRef(Engine.create());
    const render = useRef<Render | undefined>(undefined);
    const runner = useRef<Runner | undefined>(undefined);
    const bodiesMap = useRef(new Map<string, PhysicsBody>());
    const frameId = useRef<number | undefined>(undefined);
    const mouseConstraint = useRef<Matter.MouseConstraint | undefined>(undefined);
    const mouseDown = useRef(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const isRunning = useRef(false);
    const floorBodyRef = useRef<Matter.Body | undefined>(undefined);

    const registerElement = useCallback(
      (id: string, element: HTMLElement, elementProps: MatterBodyProps) => {
        if (!canvas.current) return;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const canvasRect = canvas.current.getBoundingClientRect();
        const angleRad = (elementProps.angle || 0) * (Math.PI / 180);
        const x = calculatePosition(elementProps.x, canvasRect.width, width);
        const y = calculatePosition(elementProps.y, canvasRect.height, height);

        let body: Matter.Body | undefined;

        const renderOpts = {
          fillStyle: debug ? "#888888" : "#00000000",
          strokeStyle: debug ? "#333333" : "#00000000",
          lineWidth: debug ? 3 : 0,
        };

        const safeOpts = {
          ...elementProps.matterBodyOptions,
          chamfer: elementProps.matterBodyOptions?.chamfer ?? undefined,
          angle: angleRad,
          render: renderOpts,
        } as Matter.IChamferableBodyDefinition;

        if (elementProps.bodyType === "circle") {
          const radius = Math.max(width, height) / 2;
          body = Bodies.circle(x, y, radius, safeOpts);
        } else if (elementProps.bodyType === "svg") {
          const paths = element.querySelectorAll("path");
          const vertexSets: Matter.Vector[][] = [];
          paths.forEach((path) => {
            const d = path.getAttribute("d");
            if (d) vertexSets.push(parsePathToVertices(d, elementProps.sampleLength));
          });
          body = Bodies.fromVertices(x, y, vertexSets, safeOpts);
        } else {
          body = Bodies.rectangle(x, y, width, height, safeOpts);
        }

        if (body) {
          World.add(engine.current.world, [body]);
          bodiesMap.current.set(id, { element, body, props: elementProps });
        }
      },
      [debug]
    );

    const unregisterElement = useCallback((id: string) => {
      const entry = bodiesMap.current.get(id);
      if (entry) {
        World.remove(engine.current.world, entry.body);
        bodiesMap.current.delete(id);
      }
    }, []);

    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position;
        const rotation = body.angle * (180 / Math.PI);
        element.style.transform = `translate(${x - element.offsetWidth / 2}px, ${
          y - element.offsetHeight / 2
        }px) rotate(${rotation}deg)`;
      });
      frameId.current = requestAnimationFrame(updateElements);
    }, []);

    const startEngine = useCallback(() => {
      if (runner.current) {
        runner.current.enabled = true;
        Runner.run(runner.current, engine.current);
      }
      if (render.current) Render.run(render.current);
      frameId.current = requestAnimationFrame(updateElements);
      isRunning.current = true;
    }, [updateElements]);

    const stopEngine = useCallback(() => {
      if (!isRunning.current) return;
      if (runner.current) Runner.stop(runner.current);
      if (render.current) Render.stop(render.current);
      if (frameId.current) cancelAnimationFrame(frameId.current);
      isRunning.current = false;
    }, []);

    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return;
      const height = canvas.current.offsetHeight;
      const width = canvas.current.offsetWidth;

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      Common.setDecomp(require("poly-decomp"));

      engine.current.gravity.x = gravity.x;
      engine.current.gravity.y = gravity.y;

      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
        },
      });

      const wallOpts = { isStatic: true, friction: 1, render: { visible: debug } };
      // floorAtViewport: pin the floor to the visible screen bottom so physics
      // bodies don't fall off-screen when the canvas is taller than the viewport.
      const baseFloorY = floorAtViewport
        ? (typeof window !== "undefined" ? window.innerHeight : height)
        : height;
      const floorY = baseFloorY - floorOffset;
      const floorBody = Bodies.rectangle(width / 2, floorY + 10, width, 20, wallOpts);
      floorBodyRef.current = floorBody;
      const walls = [
        floorBody,
        Bodies.rectangle(width + 10, height / 2, 20, height, wallOpts),
        Bodies.rectangle(-10, height / 2, 20, height, wallOpts),
      ];
      if (addTopWall) walls.push(Bodies.rectangle(width / 2, -10, width, 20, wallOpts));

      if (!enableGyroscope) {
        // Forward wheel events to the page so the user can still scroll
        // while hovering over the physics canvas
        render.current.canvas.addEventListener(
          "wheel",
          (e) => {
            window.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: "auto" });
          },
          { passive: true }
        );

        const mouse = Mouse.create(render.current.canvas);
        mouseConstraint.current = MouseConstraint.create(engine.current, {
          mouse,
          constraint: {
            stiffness: 0.2,
            render: { visible: debug },
          },
        });

        const touchingMouse = () =>
          Query.point(
            engine.current.world.bodies,
            mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
          ).length > 0;

        if (grabCursor) {
          Events.on(engine.current, "beforeUpdate", () => {
            if (canvas.current) {
              canvas.current.style.cursor =
                !mouseDown.current && !touchingMouse()
                  ? "default"
                  : touchingMouse()
                  ? mouseDown.current
                    ? "grabbing"
                    : "grab"
                  : "default";
            }
          });

          canvas.current.addEventListener("mousedown", () => {
            mouseDown.current = true;
            if (canvas.current)
              canvas.current.style.cursor = touchingMouse() ? "grabbing" : "default";
          });
          canvas.current.addEventListener("mouseup", () => {
            mouseDown.current = false;
            if (canvas.current)
              canvas.current.style.cursor = touchingMouse() ? "grab" : "default";
          });
        }

        World.add(engine.current.world, [mouseConstraint.current, ...walls]);
        render.current.mouse = mouse;
      } else {
        // Gyroscope mode — no mouse/touch constraints, just walls
        World.add(engine.current.world, walls);
      }
      runner.current = Runner.create();
      Render.run(render.current);
      updateElements();
      runner.current.enabled = false;

      if (autoStart) {
        runner.current.enabled = true;
        startEngine();
      }
    }, [updateElements, debug, autoStart, gravity, grabCursor, addTopWall, startEngine, enableGyroscope]);

    // Dynamically move the floor when floorOffset changes (e.g. cookie banner dismissed)
    useEffect(() => {
      if (!floorBodyRef.current || !canvas.current) return;
      const w = canvas.current.offsetWidth;
      const h = canvas.current.offsetHeight;
      const baseY = floorAtViewport
        ? (typeof window !== "undefined" ? window.innerHeight : h)
        : h;
      Matter.Body.setPosition(floorBodyRef.current, { x: w / 2, y: baseY - floorOffset + 10 });
    }, [floorOffset, floorAtViewport]);

    // Gyroscope — update engine gravity from device tilt (mobile only)
    useEffect(() => {
      if (!enableGyroscope) return;
      const STRENGTH = 1.2;
      function handler(e: DeviceOrientationEvent) {
        const gamma = e.gamma ?? 0;   // left-right tilt: -90 to 90°
        const beta  = e.beta  ?? 90;  // front-back tilt: -180 to 180°
        engine.current.gravity.x = (gamma / 90) * STRENGTH;
        // sin(90°)=1 when upright (portrait), sin(-90°)=-1 when upside-down
        engine.current.gravity.y = Math.sin((beta * Math.PI) / 180) * STRENGTH;
      }
      window.addEventListener("deviceorientation", handler, true);
      return () => window.removeEventListener("deviceorientation", handler, true);
    }, [enableGyroscope]);

    const clearRenderer = useCallback(() => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      if (mouseConstraint.current) World.remove(engine.current.world, mouseConstraint.current);
      if (render.current) {
        if (render.current.mouse) Mouse.clearSourceEvents(render.current.mouse);
        Render.stop(render.current);
        render.current.canvas.remove();
      }
      if (runner.current) Runner.stop(runner.current);
      if (engine.current) {
        World.clear(engine.current.world, false);
        Engine.clear(engine.current);
      }
      bodiesMap.current.clear();
    }, []);

    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return;
      setCanvasSize({
        width: canvas.current.offsetWidth,
        height: canvas.current.offsetHeight,
      });
      clearRenderer();
      initializeRenderer();
    }, [clearRenderer, initializeRenderer, resetOnResize]);

    const reset = useCallback(() => {
      stopEngine();
      bodiesMap.current.forEach(({ element, body, props: p }) => {
        body.angle = p.angle || 0;
        body.position.x = calculatePosition(p.x, canvasSize.width, element.offsetWidth);
        body.position.y = calculatePosition(p.y, canvasSize.height, element.offsetHeight);
      });
      updateElements();
      handleResize();
    }, [stopEngine, canvasSize, updateElements, handleResize]);

    useImperativeHandle(ref, () => ({ start: startEngine, stop: stopEngine, reset }), [
      startEngine,
      stopEngine,
      reset,
    ]);

    useEffect(() => {
      if (!resetOnResize) return;
      const debouncedResize = debounce(handleResize, 500);
      window.addEventListener("resize", debouncedResize);
      return () => {
        window.removeEventListener("resize", debouncedResize);
        debouncedResize.cancel();
      };
    }, [handleResize, resetOnResize]);

    useEffect(() => {
      initializeRenderer();
      return clearRenderer;
    }, [initializeRenderer, clearRenderer]);

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={cn(className, "absolute top-0 left-0 w-full h-full")}
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    );
  }
);

Gravity.displayName = "Gravity";
export { Gravity, MatterBody };
