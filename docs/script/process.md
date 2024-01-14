---
title: process
order: 1
nav:
  title: script
  order: 4
---

## 一个新建新流程代码的脚本

### process.ts

```ts
const fs = reqiure('fs');
const path = require('path');
const fg = require('fast-glob');
const ejs = require('ejs');
const argv = require('yargs').argv;
const chalk = require('chalk');

const tagetPath = path.json(__dirname, '../src/business/view/Process');
const routePath = path.json(__dirname, '../src/business/view/Process/route.ts');
const routerConfig = path.json(__dirname, '../src/business/views/Process/route.ts');

const addRoute = (title, flowMatchPath) => {
  const newConfig = {
    ...routerConfig,
    routes: [
      ...(routerConfig?.routes || []),
      {
        path: `/process/${flowMatchPath}/add`,
        name: `${title}发起`,
        hideMenu: true,
        component: `../business/views/Process/${flowMatchPath}`,
        multiple: true,
      },
      {
        path: `/process/${flowMatchPath}/edit/:businessId`,
        name: `${title}编辑`,
        hideMenu: true,
        component: `../business/views/Process/${flowMatchPath}`,
      },
      {
        path: `/process/${flowMatchPath}/detail/:businessId`,
        name: `${title}详情`,
        multiple: true,
        hideMenu: true,
        component: `../business/views/Process/${flowMatchPath}`,
      },
    ],
  };

  fs.writeFileSync(
    routerPath,
    `module.exports = ${JSON.stringify(newConfig, null, 2).replace(/"/g, "'")}
  `,
  );
};

/**
 * 检查模板文件
 * @param entries
 * wb-w
 */
const checkTemplateFiles = (entries) => {
  const invalidFile = entries.find((entry) => !entry.endsWith('ejs'));

  if (invalidFile) {
    console.error(`Invalid file: ${path.resolve(dirname, invalidFile)} is not a template.`);
    process.exit(1);
  }
};

const create = async () => {
  const message = `\n. \n\n yarn create-process <流程名称> <流程路由关键字> <发起等网络请求关键字> <流程右上角流程信息code> --<流程模板类型 default|table 默认default>\n
例如:
yarn create-process xx流程 Applxxx fetchxx xx
yarn create-process xx流程 Applxxx fetchxx xx --table
`;

  if (!argv._[0]) {
    console.error(message);
    process.exit(1);
  }

  if (!argv._[1]) {
    console.error(message);
    process.exit(1);
  }

  if (!argv._[2]) {
    console.error(message);
    process.exit(1);
  }

  if (!argv._[3]) {
    console.error(message);
    process.exit(1);
  }

  const title = argv._[0];
  const flowMatchPath = argv._[1];
  const flowFetchPath = argv._[2];
  const flowCode = argv._[3];

  let templateType = 'default';
  if (argv?.table) templateType = 'table';

  const templatePath = path.join(
    __dirname,
    '../src/components/ProcessPage/template/',
    templateType,
  );

  console.log(
    chalk.green(`
--------开始创建流程demo--------
流程名称: ${title}
流程路由关键字: ${flowMatchPath}
发起等网络请求关键字: ${flowFetchPath}
流程右上角流程信息code: ${flowCode}
------模板---------
使用的模板类型: ${templateType}
模板路径: ${templatePath}
`),
  );

  const entries = await fg(['**/*'], {
    cwd: templatePath,
    dot: true,
  });

  const filesPromise = entries.map(async (entry = []) => {
    const data = {
      title,
      flowMatchPath,
      flowFetchPath,
      flowCode,
    };

    const result = await ejs.renderFile(path.join(templatePath, entry), data, { async: true });

    const newPath = path.join(
      targetPath,
      flowMatchPath,
      entry.replace(/{([^}]*)}/g, (m, key) => data[key]).slice(0, -4),
    );
    await fs.outputFile(newPath, result);
  });

  await Promise.all(filesPromise);

  console.log(chalk.green('创建文件成功'));
  console.log(chalk.green('开始添加路由'));
  addRoute(title, flowMatchPath);
  console.log(chalk.green('路由添加完成'));
  console.log(chalk.green('2本执行完'));
};

create();
```

### template

```markdown
template/default

template/default/index.tsx.ejs
template/default/index.less.ejs
...more

## 变量

<%- title %>
<%- flowMatchPath %>
<%- flowFetchPath %>
<%- flowCode %>

## example

const <%- flowMatchPath %> = () => {
return <div>这是一个模板<div>
}
return <%- flowMatchPath %>
```
