/**
 * @description https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=4304371
 * 在iconfont  -   fe-miniapp获取所有icon的name
 * Array.from(document.querySelectorAll('.icon-code-show').entries()).map(([i,el])=>el.innerText)
 */

const iconTypes = [
  'icon-moshubang',
  'icon-filter',
  'icon-training-hours',
  'icon-xuelirenzheng',
  'icon-gongzuojingyan',
  'icon-didian',
  'icon-shujufenxi-liuliangfenxi',
  'icon-female',
  'icon-male',
  'icon-gongzuo',
  'icon-xueli',
  'icon-price',
  'icon-calender',
  'icon-budget',
  'icon-Collaboration',
  'icon-time',
  'icon-backspace',
  'icon-shouqijianpan',
  'icon-back',
  'icon-home',
  'icon-fankui',
  'icon-kefu',
  'icon-zhanghaoguanli',
  'icon-qiehuanyonghu',
  'icon-yinsibaohu',
  'icon-quanyi',
  'icon-jianli',
  'icon-copy'
] as const;

export type IconTypes = (typeof iconTypes)[number];
