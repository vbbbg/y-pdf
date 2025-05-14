import { useLayoutEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";
import receiptPlugin, { initReceiptLayout } from "../plugins/receipt-plugin";
import { paperConfigs, getPaperName } from "../plugins/paper-type";

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
          id: `paper-${type}`,
          name: getPaperName(config),
          width: `${config.mmWidth}mm`,
          height: `${config.mmHeight}mm`,
        })),
      },
      plugins: [receiptPlugin],
    });

    initReceiptLayout(editorRef.current);
  }, []);
}
