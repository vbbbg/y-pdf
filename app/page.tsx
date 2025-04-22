"use client";

import "grapesjs/dist/css/grapes.min.css";
import { useGrapes } from "@/hooks/useGrapes";

export default function Home() {
  useGrapes();

  return (
    <div className="w-[90%] m-auto">
      <div id="gjs">
        <h1>Hello World Component!</h1>
      </div>
    </div>
  );
}
