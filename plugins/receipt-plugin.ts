import type { Editor, Plugin } from "grapesjs";

enum ComponentType {
  HEADER = "header-section",
  TABLE = "table-section",
  SUMMARY = "table-summary",
  FOOTER = "footer-section",
}

const resizable = {
  tl: false, // top left
  tc: true, // top center
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
    min: 50,
    units: ["px"],
    default: "100px",
  },
];

const typeDefine: Plugin = (editor) => {
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
      content: `<div class="header-section" style="height: 100px; min-height: 100px; width: 100%;">表头区域</div>`,
    },
  });

  editor.BlockManager.add(ComponentType.TABLE, {
    label: "表格区",
    category: "PDF 布局",
    content: {
      type: ComponentType.TABLE,
      content: `<div class="table-section" style="min-height: 100px; width: 100%;">表格区域</div>`,
    },
  });

  editor.BlockManager.add(ComponentType.SUMMARY, {
    label: "表格合计区",
    category: "PDF 布局",
    content: {
      type: ComponentType.SUMMARY,
      content: `<div class="table-summary" style="min-height: 50px; width: 100%;">表格合计区域</div>`,
    },
  });

  editor.BlockManager.add(ComponentType.FOOTER, {
    label: "表尾区",
    category: "PDF 布局",
    content: {
      type: ComponentType.FOOTER,
      content: `<div class="footer-section" style="min-height: 50px; width: 100%;">表尾区域</div>`,
    },
  });
};

const receiptPlugin: Plugin = (editor, config) => {
  // 添加自定义组件类型
  typeDefine(editor, config);

  // 添加区块
  addBlock(editor, config);
};

const addComponentToEditor = (editor: Editor, type: ComponentType) => {
  const componentMap = {
    [ComponentType.HEADER]: {
      style: "height: 100px; min-height: 100px; width: 100%",
    },
    [ComponentType.TABLE]: {
      style: "min-height: 100px; width: 100%",
    },
    [ComponentType.SUMMARY]: {
      style: "min-height: 50px; width: 100%",
    },
    [ComponentType.FOOTER]: {
      style: "min-height: 50px; width: 100%",
    },
  };

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
  addComponentToEditor(editor, ComponentType.HEADER);
  addComponentToEditor(editor, ComponentType.TABLE);
  addComponentToEditor(editor, ComponentType.SUMMARY);
  addComponentToEditor(editor, ComponentType.FOOTER);
};

export { initReceiptLayout, addComponentToEditor };

export default receiptPlugin;
