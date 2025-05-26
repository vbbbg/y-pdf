import { Component, Editor, Plugin } from "grapesjs";
import {
  mmToPx,
  PaperConfig,
  paperConfigs,
  PaperType,
} from "@/plugins/paper-type";

enum ComponentType {
  Paper = "full-paper",
  HEADER = "header-section",
  TABLE = "table-section",
  SUMMARY = "table-summary",
  FOOTER = "footer-section",
}

const resizable = {
  tl: false, // top left
  tc: false, // top center
  tr: false, // top right
  cl: false, // center left
  cr: false, // center right
  bl: false, // bottom left
  bc: true, // bottom center
  br: false, // bottom right
};

const traits = [
  {
    type: "number",
    name: "height",
    label: "高度",
    min: 10,
    units: ["px"],
    default: "100px",
  },
];

const componentMap: Record<
  Exclude<ComponentType, ComponentType.Paper>,
  { style: string }
> = {
  [ComponentType.HEADER]: {
    style: "height: 100px; width: 100%",
  },
  [ComponentType.TABLE]: {
    style: "height: 100px; width: 100%",
  },
  [ComponentType.SUMMARY]: {
    style: "height: 50px; width: 100%",
  },
  [ComponentType.FOOTER]: {
    style: "height: 50px; width: 100%",
  },
};

const typeDefine: Plugin = (editor) => {
  editor.DomComponents.addType(ComponentType.Paper, {
    isComponent: (el) => el.getAttribute("data-gjs-type") === "wrapper",
    model: {
      defaults: {
        name: "全幅纸张",
      },
    },
  });

  editor.DomComponents.addType(ComponentType.HEADER, {
    isComponent: (el) =>
      el.getAttribute("data-gjs-type") === ComponentType.HEADER,
    model: {
      defaults: {
        name: "表头区",
        stylable: ["height"],
        attributes: { "data-gjs-type": ComponentType.HEADER },
        style: { width: "100%" },
        resizable,
        traits,
        toolbar: [], // 禁用 toolbar
      },
    },
  });

  editor.DomComponents.addType(ComponentType.TABLE, {
    isComponent: (el) =>
      el.getAttribute("data-gjs-type") === ComponentType.TABLE,
    model: {
      defaults: {
        name: "表格区",
        stylable: ["height"],
        attributes: { "data-gjs-type": ComponentType.TABLE },
        style: { width: "100%" },
        resizable,
        traits,
        toolbar: [], // 禁用 toolbar
      },
    },
  });

  editor.DomComponents.addType(ComponentType.SUMMARY, {
    isComponent: (el) =>
      el.getAttribute("data-gjs-type") === ComponentType.SUMMARY,
    model: {
      defaults: {
        name: "表格合计区",
        stylable: ["height"],
        attributes: { "data-gjs-type": ComponentType.SUMMARY },
        style: { width: "100%" },
        resizable,
        traits,
        toolbar: [], // 禁用 toolbar
      },
    },
  });

  editor.DomComponents.addType(ComponentType.FOOTER, {
    isComponent: (el) =>
      el.getAttribute("data-gjs-type") === ComponentType.FOOTER,
    model: {
      defaults: {
        name: "表尾区",
        stylable: ["height"],
        attributes: { "data-gjs-type": ComponentType.FOOTER },
        style: { width: "100%" },
        resizable,
        traits,
        toolbar: [], // 禁用 toolbar
      },
    },
  });
};

const addBlock: Plugin = (editor) => {
  editor.BlockManager.add(ComponentType.HEADER, {
    label: "表头区",
    category: "PDF 布局",
    content: {
      type: ComponentType.HEADER,
      content: `<div class="header-section" style="height: 100px;  width: 100%;">表头区域</div>`,
    },
  });

  editor.BlockManager.add(ComponentType.TABLE, {
    label: "表格区",
    category: "PDF 布局",
    content: {
      type: ComponentType.TABLE,
      content: `<div class="table-section" style=" width: 100%;">表格区域</div>`,
    },
  });

  editor.BlockManager.add(ComponentType.SUMMARY, {
    label: "表格合计区",
    category: "PDF 布局",
    content: {
      type: ComponentType.SUMMARY,
      content: `<div class="table-summary" style=" width: 100%;">表格合计区域</div>`,
    },
  });

  editor.BlockManager.add(ComponentType.FOOTER, {
    label: "表尾区",
    category: "PDF 布局",
    content: {
      type: ComponentType.FOOTER,
      content: `<div class="footer-section" style=" width: 100%;">表尾区域</div>`,
    },
  });
};

const addEvents: Plugin = (editor) => {
  const metaData: { paperConfig?: PaperConfig } = {};

  editor.on(
    "component:resize",
    (e: {
      component: Component;
      el: HTMLElement;
      type: "start" | "move" | "end";
    }) => {
      switch (e.type) {
        case "start":
          const device = editor.Devices.getSelected();
          if (!device) return;

          const deviceId = device.attributes.id as unknown as PaperType;
          const paperConfig = paperConfigs[deviceId];
          metaData.paperConfig = paperConfig;
          break;

        case "end":
          if (!metaData.paperConfig) return;
          const maxHeight = mmToPx(metaData.paperConfig.mmHeight);

          const componentHeight = e.component.getEl()?.clientHeight || 0;
          const componentType = e.component.attributes.type;

          const parent = e.component.parent();
          if (!parent) return;

          const totalHeightWithoutComponentHeight = parent
            ?.components()
            .reduce<number>((_totalHeight: number, com: Component) => {
              if (com.attributes.type === componentType) {
                return _totalHeight;
              }

              return _totalHeight + (com.getEl()?.clientHeight || 0);
            }, 0);

          if (totalHeightWithoutComponentHeight + componentHeight > maxHeight) {
            e.component.setStyle({
              height: `${maxHeight - totalHeightWithoutComponentHeight}px`,
            });
          }
          break;

        default:
          break;
      }
    },
  );
};

const receiptPlugin: Plugin = (editor, config) => {
  // 添加自定义组件类型
  typeDefine(editor, config);

  // 添加区块
  addBlock(editor, config);

  // 添加事件
  addEvents(editor, config);
};

const addComponentToEditor = (
  editor: Editor,
  type: Exclude<ComponentType, ComponentType.Paper>,
) => {
  const config = componentMap[type];
  if (!config) {
    console.warn(`未找到组件类型: ${type}`);
    return;
  }

  editor.addComponents(
    `<div data-gjs-type="${type}" style="${config.style}"></div>`,
  );
};

const initReceiptLayout = (editor: Editor) => {
  // 添加 paper 组件，宽高铺满
  const paper = editor.addComponents({
    type: ComponentType.Paper,
    style: {
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
    },
    attributes: { "data-gjs-type": ComponentType.Paper },
  });

  // 获取添加的 paper 组件
  const paperComponent = Array.isArray(paper) ? paper[0] : paper;

  // 添加各个区域组件到 paper 中
  [
    ComponentType.HEADER,
    ComponentType.TABLE,
    ComponentType.SUMMARY,
    ComponentType.FOOTER,
  ].forEach((type) => {
    const component = editor.addComponents(
      `<div data-gjs-type="${type as Exclude<ComponentType, ComponentType.Paper>}" style="${componentMap[type as Exclude<ComponentType, ComponentType.Paper>].style}"></div>`,
    );
    // 将组件添加到 paper 中
    if (Array.isArray(component)) {
      paperComponent.append(component[0]);
    } else {
      paperComponent.append(component);
    }
  });
};

export { initReceiptLayout, addComponentToEditor };

export default receiptPlugin;
