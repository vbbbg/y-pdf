import { useLayoutEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";
import receiptPlugin, { initReceiptLayout } from "../plugins/receipt-plugin";
import { paperConfigs, getPaperName, mmToPx } from "../plugins/paper-type";

export function useGrapes() {
  const editorRef = useRef<Editor>(null);

  useLayoutEffect(() => {
    editorRef.current = grapesjs.init({
      container: "#gjs",
      fromElement: true,
      storageManager: false,
      // 添加设备配置
      deviceManager: {
        devices: Object.entries(paperConfigs).map(([type, config]) => ({
          id: `${type}`,
          name: getPaperName(config),
          width: `${mmToPx(config.mmWidth)}px`,
          height: `${mmToPx(config.mmHeight)}px`,
        })),
      },
      plugins: [receiptPlugin],
    });

    initReceiptLayout(editorRef.current);
  }, []);
}
