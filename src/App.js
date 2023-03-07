import { useState, useEffect } from 'react';
import {
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
} from '@codesandbox/sandpack-react';

async function fetchFiles(query) {
  return await fetch(` http://172.17.33.145:3001/files/${query}`, {
    credentials: 'same-origin'
  }).then((response) => {
    return response.json();
  });
}
function App() {
  const [files, setFiles] = useState(null);
  
  useEffect(() => {
    const hrefArr = window.location.href.split('/');
    const query = hrefArr[hrefArr.length - 1];

    if (!query) {
      setFiles({});
      return;
    }

    fetchFiles(query).then(u => {
      const newData = Object.keys(u.files).reduce((acc, key) => {
        acc[key] = u.files[key];
        acc[key]['code'] = acc[key]['content'] || acc[key]['code']; // 有些数据文件的 key 是 content, 需要替换为 code

        delete acc[key]['content'];

        return acc;
      }, {});
      setFiles(newData);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const openBtn = document.querySelectorAll('.sp-preview-actions button')[1];
      const form = openBtn.querySelector('form');
      form.setAttribute('action', ' http://172.17.33.145:3001/api');
    }, 1000)
  }, [])
  
  if (files === null) {
    return <p>Loading Files...</p>;
  }

  return (
    <SandpackProvider 
      template='vue'
      files={ files }
      options={{ bundlerURL: 'http://codesandbox.fe.aaa.cn/' }} 
    >
      <SandpackLayout style={{ display: 'flex', width: '100%', height: '100%' }}>
        <SandpackFileExplorer style={{ width: 300 }} />
        <SandpackCodeEditor showTabs showLineNumbers style={{ flex: 1 }} />
        <SandpackPreview style={{ flex: 1 }} />
      </SandpackLayout>
    </SandpackProvider>
  );
}

export default App;
