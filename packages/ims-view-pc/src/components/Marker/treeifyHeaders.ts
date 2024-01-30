interface TreeNode {
  tag: string;
  text: string;
  id: string;
  children?: TreeNode[];
}

/**
 *
 * @param dom 富文本
 * @returns {TreeNode[]}
 */
export const treeifyHeaders = (dom: string): TreeNode[] => {
  //@ts-ignore
  const stack: TreeNode[] = [{ tag: 'H0', children: [] }];
  const headers = 'h1, h2, h3, h4, h5, h6';

  const content = document.createElement('div');
  content.innerHTML = dom;

  content.querySelectorAll(headers).forEach((header: HTMLHeadingElement) => {
    const { tagName: tag, textContent: text, id = '' } = header;
    const node: TreeNode = { tag, text: text || '', id };
    let last = stack.at(-1)!;

    while (last.tag >= node.tag) {
      stack.pop();
      last = stack.at(-1)!;
    }

    last.children = last.children || [];
    last.children.push(node);
    stack.push(node);
  });

  return stack[0].children!;
};

// const dom = `<h1 id="w-e-element-0">1232</h1><p>123</p><h2 id="a8qob">123123</h2><h3 id="e3t9l">123123</h3><p></p><h1 id="8sbb1">123123</h1><h4 id="1he7e">123123</h4><p>123</p>`;
// const result = treeifyHeaders(dom);
