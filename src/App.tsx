import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { ipcRenderer } from 'electron';

const Hello = () => {
  const imgRef = useRef({} as any);

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
      console.log('event.clientX= ', event.clientX);
      console.log('offsetLeft= ', imgRef.current.offsetLeft);
      const dx = event.clientX - imgRef.current.offsetLeft;
      const dy = event.clientY - imgRef.current.offsetTop;
      console.log(dx);
      // 实时改变目标元素imgRef.current的位置
      imgRef.current.onmousemove = (event: any) => {
        console.log('onmousemove= ', event.clientX - dx);
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
      imgDom.src = message;
    });
    // 实现滑轮放大，缩小
    imgDom.addEventListener('mousewheel', handleMouseWheel);

    handleMoveImg();

    return function cleanup() {
      imgDom.removeEventListener('mousewheel', () => {});
    };
  });

  return (
    <div className="box">
      <img
        ref={imgRef}
        style={{ position: 'relative' }}
        // src={demoImg}
        id="photo"
        alt="图片查看"
      />
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
