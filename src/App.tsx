import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import demoImg from '../assets/ver_img_fail@2x.png';
const fs = require('fs');
const path = require('path');

const Hello = () => {
  const imgRef = useRef({} as any);

  function handleImageLoadClick() {
    let data = fs.readFileSync(path.resolve('assets/ver_img_fail@2x.png'));
    console.log(data);
    console.log(data.length);

    let arrayBufferView = new Uint8Array(data);
    var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    // var img = document.querySelector('#photo') as any;
    imgRef.current.src = imageUrl;
  }

  function handleMouseWheel(e: any) {
    let down = e.wheelDelta > 0 ? true : false;

    if (down) {
      imgRef.current.style.height = imgRef.current.offsetHeight + 10 + 'px';
    } else {
      imgRef.current.style.height = imgRef.current.offsetHeight - 10 + 'px';
    }
  }

  function handleMoveImg() {
    imgRef.current.onmousedown = function (event: any) {
      event.preventDefault();
      // 获取屏幕中可视化的宽高的坐标
      console.log('event.clientX= ', event.clientX);
      console.log('offsetLeft= ', imgRef.current.offsetLeft);
      var dx = event.clientX - imgRef.current.offsetLeft;
      var dy = event.clientY - imgRef.current.offsetTop;
      console.log(dx);
      //实时改变目标元素imgRef.current的位置
      imgRef.current.onmousemove = function (event: any) {
        console.log('onmousemove= ', event.clientX - dx);
        imgRef.current.style.left = event.clientX - dx + 'px';
        imgRef.current.style.top = event.clientY - dy + 'px';
      };

      //抬起停止拖动
      imgRef.current.onmouseup = function () {
        console.log('onmouseup');
        imgRef.current.onmousemove = null;
        imgRef.current.onmouseup = null;
      };
    };
  }

  useEffect(() => {
    // 加载图片
    // handleImageLoadClick();

    // 实现滑轮放大，缩小
    imgRef.current.addEventListener('mousewheel', handleMouseWheel);

    handleMoveImg();

    return function cleanup() {
      imgRef.current.removeEventListener('mousewheel', () => {});
    };
  });

  return (
    <div className="box">
      <img
        ref={imgRef}
        style={{ position: 'relative' }}
        src={demoImg}
        id="photo"
        alt="图片查看"
      />
      <div>resolve= {path.resolve()}</div>
      <div>resolve+path= {path.resolve('assets/ver_img_fail@2x.png')}</div>
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
