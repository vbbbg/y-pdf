import { useLayoutEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";
import receiptPlugin, { initReceiptLayout } from "../plugins/receipt-plugin";

export function useGrapes() {
  const editorRef = useRef<Editor>(null);

  useLayoutEffect(() => {
    editorRef.current = grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: "#gjs",
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      fromElement: true,
      // Disable the storage manager for the moment
      storageManager: false,
      // Avoid any default panel
      panels: { defaults: [] },
      plugins: [receiptPlugin],
    });

    initReceiptLayout(editorRef.current);
  }, []);
}
