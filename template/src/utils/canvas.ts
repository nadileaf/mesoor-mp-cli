export type RoundedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
};

// 绘制圆角矩形
export function drawRoundedRect(ctx: UniApp.CanvasContext, { x, y, width, height, radius }: RoundedRect, strokeColor: string) {
  const { topLeft, topRight, bottomLeft, bottomRight } = radius;

  ctx.beginPath();
  ctx.arc(x + topLeft, y + topLeft, topLeft, Math.PI, (Math.PI * 3) / 2);
  ctx.lineTo(width - topLeft + x, y);

  ctx.arc(width - topRight + x, topRight + y, topRight, (Math.PI * 3) / 2, Math.PI * 2);
  ctx.lineTo(width + x, height + y - topRight);

  ctx.arc(width - bottomLeft + x, height - bottomLeft + y, bottomLeft, 0, (Math.PI * 1) / 2);
  ctx.lineTo(bottomLeft + x, height + y);

  ctx.arc(bottomRight + x, height - bottomRight + y, bottomRight, (Math.PI * 1) / 2, Math.PI);
  ctx.closePath();

  ctx.setStrokeStyle(strokeColor);
  ctx.stroke();
}

export function getFormatText(text: string, textWidth: number, maxWidth: number) {
  if (textWidth <= maxWidth) return text;

  const maxLength = Math.floor(maxWidth / (textWidth / text.length)) - 2;
  const displayText = text.slice(0, maxLength) + '...';
  console.log('displayText :>> ', displayText);
  return displayText;
}

type RenderWrapTextOptions = {
  x: number;
  y: number;
  maxWidth: number;
  maxLine?: number;
};
export function renderWrapText(ctx: UniApp.CanvasContext, text: string, { x, y, maxWidth, maxLine }: RenderWrapTextOptions) {
  if (!text) return;

  console.log('text :>> ', text, text.split('\n'));

  if (text.includes('\n')) {
    const breakLines = text.split('\n');
    let totalLines = 1;

    // 遍历换行符的每一段文字
    for (let i = 0; i < breakLines.length; i++) {
      const text = breakLines[i].split('');

      let currentLineText = '';

      let _y = y + 20 * (totalLines - 1);

      // 遍历每一个字符
      for (let j = 0; j < text.length; j++) {
        const item = text[j];

        if (totalLines >= (maxLine ?? 0)) break;

        if (ctx.measureText(currentLineText + item).width > maxWidth) {
          if (totalLines == maxLine) {
            const text = currentLineText.slice(0, -1) + '...';
            ctx.fillText(text, x, _y);
            totalLines += 1;
            break;
          }
          ctx.fillText(currentLineText, x, _y);

          currentLineText = item;
          _y += 20;
          totalLines += 1;
        } else {
          currentLineText += item;
        }
        if (j === text.length - 1) {
          ctx.fillText(currentLineText, x, _y);
          totalLines += 1;
        }
      }
    }
  } else {
    const textArr = text.split('');
    let currentLine = 1;
    let currentLineText = '';
    let _y = y;

    for (let i = 0; i < textArr.length; i++) {
      const item = textArr[i];
      if (ctx.measureText(currentLineText + item).width > maxWidth) {
        if (currentLine == maxLine) {
          const text = currentLineText.slice(0, -1) + '...';
          ctx.fillText(text, x, _y);
          break;
        }
        ctx.fillText(currentLineText, x, _y);
        currentLine += 1;
        currentLineText = item;
        _y += 20;
      } else {
        currentLineText += item;
      }
      if (i === textArr.length - 1) {
        ctx.fillText(currentLineText, x, _y);
      }
    }
  }
}

interface TagProps {
  text: string;
  x: number;
  y: number;
  height: number;
  padding?: number;
  color: string;
  bgColor: string;
}

// TODO 应该不用这个了
export function drawTag(ctx: UniApp.CanvasContext, tag: TagProps): void {
  // 设置默认 padding 值
  const padding = tag.padding || 2;

  // 计算 tag 宽度 (文本长度 + 两倍 padding)
  const tagWidth = ctx.measureText(tag.text).width + 2 * padding;

  ctx.save();
  drawRoundedRect(
    ctx,
    {
      x: tag.x,
      y: tag.y,
      width: tagWidth,
      height: tag.height,
      radius: {
        topLeft: 4,
        topRight: 4,
        bottomLeft: 4,
        bottomRight: 4
      }
    },
    tag.bgColor
  );
  ctx.setFillStyle(`${tag.bgColor}`);
  ctx.fill();

  // 设置文本样式
  ctx.font = '8px Arial';
  ctx.fillStyle = `${tag.color}`;
  ctx.setTextAlign('center');
  ctx.setTextBaseline('middle');

  // 绘制文本
  ctx.fillText(tag.text, tag.x + tagWidth / 2, tag.y + tag.height / 2);

  ctx.restore();
}

export type CanvasTagConfig = {
  // 标签范围参数
  spaceX: number; // x坐标
  spaceY: number; // y坐标
  spaceWidth: number; // 宽度
  spaceHeight?: number; // 高度

  // 标签参数
  paddingRight: number; // 文本至左边框距离
  paddingLeft: number; // 文本至右边框距离
  marginTop: number; // 上外边界
  marginRight: number; // 右外边界
  marginBottom: number; // 下外边界
  marginLeft: number; // 左外边界
  labelHeight: number; // 高度
  labelRadius: number; // 圆角
  labelBackgroundColor: string; // 背景色

  // 字体参数
  fontSize: number; // 字体大小
  fontColor: string; // 字体颜色
  fontFamily: string; // 字体类型
};

type CanvasTagList = {
  name: string;
  textWidth: number;
  x: number;
  y: number;
}[];

export function formatCanvasTags(ctx: UniApp.CanvasContext, list: { name: string }[], config: CanvasTagConfig) {
  let lineIndex = 0;
  let usedWidth = 0;

  const formattedTags = list.map((item) => {
    const textWidth = ctx.measureText(item.name).width;
    // 标签实际占据宽度
    const labelSpace = textWidth + config.paddingLeft + config.paddingRight + config.marginLeft + config.marginRight;
    if (usedWidth + labelSpace > config.spaceWidth) {
      usedWidth = 0;
      lineIndex += 1;
    }
    const x = config.spaceX + usedWidth + config.marginLeft;
    const y = config.spaceY + lineIndex * (config.labelHeight + config.marginTop + config.marginBottom);

    usedWidth += labelSpace;

    return {
      name: item.name,
      textWidth,
      x,
      y
    };
  });

  return { formattedTags, tagsLineCount: lineIndex + 1 };
}

export function drawCanvasTags(ctx: UniApp.CanvasContext, list: CanvasTagList, config: CanvasTagConfig) {
  ctx.save();

  ctx.font = `${config.fontSize}px ${config.fontFamily}`;
  ctx.setTextAlign('center');
  ctx.setTextBaseline('middle');
  ctx.fillStyle = config.fontColor;

  list.forEach((item) => {
    const radius = {
      topLeft: config.labelRadius,
      topRight: config.labelRadius,
      bottomLeft: config.labelRadius,
      bottomRight: config.labelRadius
    };

    drawRoundedRect(
      ctx,
      {
        x: item.x,
        y: item.y,
        width: item.textWidth + config.paddingLeft + config.paddingRight,
        height: config.labelHeight,
        radius
      },
      config.labelBackgroundColor
    );

    // 标签背景色
    ctx.setFillStyle(config.labelBackgroundColor);
    ctx.fill();

    // 标签文本
    ctx.fillStyle = config.fontColor;
    ctx.fillText(item.name, item.x + config.paddingLeft + item.textWidth / 2, item.y + config.labelHeight / 2);
  });

  ctx.restore();
}
