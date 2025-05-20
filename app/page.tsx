"use client";

import "grapesjs/dist/css/grapes.min.css";
import { useGrapes } from "@/hooks/useGrapes";

export default function Home() {
  useGrapes();

  return (
    <div className="w-[100%] m-auto">
      <div id="gjs"></div>
    </div>
  );
}
