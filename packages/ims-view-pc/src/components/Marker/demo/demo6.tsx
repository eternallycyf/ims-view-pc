import { Marker } from 'ims-view-pc';

const App = () => {
  const dom = `<h1 id="w-e-element-0">1232</h1><p>123</p><h2 id="a8qob">123123</h2><h3 id="e3t9l">123123</h3><p></p><h1 id="8sbb1">123123</h1><h4 id="1he7e">123123</h4><p>123</p>`;

  return <pre>{JSON.stringify(Marker.treeifyHeaders(dom), null, 2)}</pre>;
};

export default App;
