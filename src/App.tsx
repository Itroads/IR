import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ipcRenderer } from 'electron';

import { handleMouseWheel } from './utils/handleImgFuncs';
import './App.global.css';
import styles from './app.module.css';

const Hello = () => {
  const [isUrl, setIsUrl] = useState(false);
  const imgRef = useRef({} as HTMLImageElement);

  // function handleMouseWheel(e: any) {
  //   const down = e.wheelDelta > 0;

  //   if (down) {
  //     imgRef.current.style.height = imgRef.current.offsetHeight + 10 + 'px';
  //   } else {
  //     imgRef.current.style.height = imgRef.current.offsetHeight - 10 + 'px';
  //   }
  // }

  function handleMoveImg() {
    imgRef.current.onmousedown = (event: any) => {
      event.preventDefault();
      // 获取屏幕中可视化的宽高的坐标
      const dx = event.clientX - imgRef.current.offsetLeft;
      const dy = event.clientY - imgRef.current.offsetTop;

      // 实时改变目标元素imgRef.current的位置
      imgRef.current.onmousemove = (event: any) => {
        imgRef.current.style.left = event.clientX - dx + 'px';
        imgRef.current.style.top = event.clientY - dy + 'px';
      };

      // 抬起停止拖动
      imgRef.current.onmouseup = () => {
        console.log('onmouseup');
        imgRef.current.onmousemove = null;
        imgRef.current.onmouseup = null;
      };
    };
  }

  useEffect(() => {
    const imgDom = imgRef.current;
    // 加载图片
    ipcRenderer.on('img-path', (_, message) => {
      if (message) {
        imgDom.src = message;
      } else {
        setIsUrl(false);
      }
    });
    // 实现滑轮放大，缩小
    imgDom.addEventListener('mousewheel', (e) => handleMouseWheel(e, imgRef));

    // 图片拖拽
    handleMoveImg();

    document.addEventListener(
      'drop',
      (e: any) => {
        e.preventDefault();
        console.log(e);
        const { files } = e.dataTransfer;
        console.log('path', files[0].path);
        imgDom.src = files[0].path;
        setIsUrl(true);
      },
      false
    );
    document.addEventListener('dragover', (e: any) => {
      e.preventDefault();
    });
    return function cleanup() {
      imgDom.removeEventListener('mousewheel', () => {});
      document.addEventListener('drop', () => {});
    };
  }, []);

  return (
    <div className="box">
      <img
        ref={imgRef}
        className={isUrl ? styles.show : styles.hide}
        style={{ position: 'relative' }}
        id="photo"
        alt="图片"
      />
      <div className={`${isUrl ? styles.hide : styles.show} ${styles.dragBox}`}>
        拖拽打开图片
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
