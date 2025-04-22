import { useLayoutEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";

export function useGrapes() {
  const editorRef = useRef<Editor>(null);

  useLayoutEffect(() => {
    editorRef.current = grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: "#gjs",
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      fromElement: true,
      // Size of the editor
      height: "300px",
      width: "auto",
      // Disable the storage manager for the moment
      storageManager: false,
      // Avoid any default panel
      panels: { defaults: [] },
    });

    // Append components directly to the canvas
    editorRef.current.addComponents(
      `<div><img src="https://path/image" /><span title="foo">Hello world!!!</span></div>`,
    );
  }, []);
}
