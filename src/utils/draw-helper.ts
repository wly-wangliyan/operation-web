
export class CanvasConst {
  /* 描画点数据 */
  public static drawPoint(drawCanvas , context: CanvasRenderingContext2D, offsetX: number, offsetY: number, index: any, radius) {
    context.lineWidth = 1; // 设置线宽
    context.beginPath(); // 路径开始

    offsetX = offsetX < 10 ? offsetX + 10 : (offsetX > (drawCanvas.width - 10) ? offsetX - 10 : offsetX);
    offsetY = offsetY < 10 ? offsetY + 10 : (offsetY > (drawCanvas.height - 10) ? offsetY - 10 : offsetY);

    context.arc(offsetX, offsetY, 10, -Math.PI / 2, -Math.PI / 2 + 360 * radius, false); // 用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
    context.strokeStyle = 'red'; // 设置描边样式
    context.strokeText(index, offsetX, offsetY);

    context.arc(offsetX, offsetY, 10, -Math.PI / 2, -Math.PI / 2 + 360 * radius, false); // 用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
    context.strokeStyle = 'red'; // 设置描边样式
    context.strokeText(index, offsetX, offsetY);
    context.stroke(); // 绘制
    context.closePath(); // 路径结束
    context.restore();
  }

  public static drawRectangle(context: CanvasRenderingContext2D , dataList) {
    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.beginPath();
    dataList.forEach(spotShape => {
      if (spotShape.rectangleGenerator.isCompleted) {
        const points = spotShape.rectangleGenerator.rectangle.points;
        for (let i = 0; i < 4; i++) {
          for (let j = i + 1; j <= 4; j++) {
            if (j < 4) {
              context.moveTo(points[i].x, points[i].y);
              context.lineTo(points[j].x, points[j].y);
              break;
            } else if (j === 4) {
              context.moveTo(points[3].x, points[3].y);
              context.lineTo(points[0].x, points[0].y);
            }

          }
        }
      }
    });
    context.stroke();
    context.closePath();
  }
}



