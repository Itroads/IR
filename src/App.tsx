import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { ipcRenderer } from 'electron';
import OpenModel from './constanst';
import styles from './app.css';

const Hello = () => {
  const [openModel, setOpenModel] = useState(OpenModel.Drag);
  const imgRef = useRef({} as any);
  const dragRef = useRef({} as any);

  function handleMouseWheel(e: any) {
    const down = e.wheelDelta > 0;

    if (down) {
      imgRef.current.style.height = imgRef.current.offsetHeight + 10 + 'px';
    } else {
      imgRef.current.style.height = imgRef.current.offsetHeight - 10 + 'px';
    }
  }

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
    let imgDom: HTMLImageElement;
    if (OpenModel.File) {
      imgDom = imgRef.current;
      // 加载图片
      ipcRenderer.on('img-path', (_, message) => {
        console.log('message=', message);
        if (message) {
          imgDom.src = message;
        } else {
          setOpenModel(OpenModel.File);
        }
      });
      // 实现滑轮放大，缩小
      imgDom.addEventListener('mousewheel', handleMouseWheel);

      // 图片拖拽
      handleMoveImg();
    }
    console.log('event listener');
    dragRef.current.addEventListener(
      'drop',
      (e: any) => {
        e.preventDefault();
        console.log(e);
        const { files } = e.dataTransfer;
        console.log('path', files[0].path);
      },
      false
    );
    dragRef.current.addEventListener('dragover', (e: any) => {
      e.preventDefault();
    });
    return function cleanup() {
      imgDom.removeEventListener('mousewheel', () => {});
      document.addEventListener('drop', () => {});
    };
  });

  return (
    <div className="box">
      <img
        ref={imgRef}
        className={openModel === OpenModel.File ? styles.show : styles.hide}
        style={{ position: 'relative' }}
        id="photo"
        alt="图片"
      />
      <div
        ref={dragRef}
        className={`${
          openModel === OpenModel.Drag ? styles.show : styles.hide
        } ${styles.dragBox}`}
      >
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
