---
order: 3
title: Demo规范
---

## Demo 规范

<Tree>
  <ul>
    <li>
      src
      <ul>
        <li>
          component
          <ul>
            <li>
              Xxx
              <small>添加新的组件</small>
              <ul>
                <li>
                  index.tsx 
                  <small>导出组件 设置子组件(Xxx.Item)</small>
                </li>
                <li>
                  interface.ts 
                  <small>ts文件 export 形式</small>
                </li>
                <li>
                  Xxx.tsx
                  <small>主文件</small>
                </li>
                <li>
                  Item.tsx
                  <small>子文件</small>
                </li>
                <li>
                  index.less
                </li>
                <li>
                  index.md
                  <small>文档主文件</small>
                </li>
                <li>
                  index.$tab-xxx.tsx
                  <small>多tab页文档子文件</small>
                </li>
                <li>
                  demo
                  <small>demo的文件夹</small>
                  <ul>
                    <li>
                      Xxx.tsx 
                    </li>
                  </ul>
                </li>
                <li>
                  test
                  <small>单元测试</small>
                  <ul>
                    <li>
                      Xxx.tsx 
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      package.json
    </li>
  </ul>
</Tree>
