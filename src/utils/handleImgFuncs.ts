// 处理图片的放大缩小 - handles zooming in and out of pictures
export function handleMouseWheel(
  e: any,
  imgRef: React.MutableRefObject<HTMLImageElement>
) {
  const down = e.wheelDelta > 0;

  if (down) {
    imgRef.current.style.height = imgRef.current.offsetHeight + 10 + 'px';
  } else {
    imgRef.current.style.height = imgRef.current.offsetHeight - 10 + 'px';
  }
}
