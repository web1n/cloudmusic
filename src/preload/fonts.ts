const CHINESE_FONT_FAMILIES = [
    // Windows 
    "Microsoft YaHei", "Microsoft YaHei UI", "微软雅黑",
    "SimSun", "新宋体", "NSimSun", "宋体",
    "SimHei", "黑体",
    "KaiTi", "楷体",
    "FangSong", "仿宋",
    "DengXian", "等线",
    "LiSu", "隶书",
    "YouYuan", "幼圆",
    "STCaiyun", "华文彩云",
    "STHupo", "华文琥珀",
    "STXingkai", "华文行楷",
    "STXinwei", "华文新魏",
    "STZhongsong", "华文中宋",
    // macOS 
    "PingFang SC", "PingFang TC", "PingFang HK",
    "STHeiti SC", "STHeiti TC", "Heiti SC", "Heiti TC",
    "STSong", "Songti SC", "Songti TC",
    "STKaiti", "Kaiti SC", "Kaiti TC",
    "STFangsong", "Baoli SC", "Baoli TC",
    "Hanzhen Giads", "Hanzi Pen SC", "Hanzi Pen TC",
    "Wawati SC", "Wawati TC",
    "Xingkai SC", "Xingkai TC", "Yuanti SC", "Yuanti TC",
    // Linux 
    "Noto Sans CJK SC", "Noto Sans CJK TC", "Noto Sans CJK HK",
    "Noto Serif CJK SC", "Noto Serif CJK TC",
    "Source Han Sans CN", "Source Han Sans SC", "Source Han Sans TC",
    "Source Han Serif CN", "Source Han Serif SC",
    "WenQuanYi Micro Hei", "WenQuanYi Zen Hei",
    "Droid Sans Fallback",
];

function isFontInstalled(fontName: string, testChar = 'A') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;

    const fontSize = 48;
    const baseFont = 'monospace';

    ctx.font = `${fontSize}px ${baseFont}`;
    const baseWidth = ctx.measureText(testChar).width;

    ctx.font = `${fontSize}px "${fontName}", ${baseFont}`;
    const targetWidth = ctx.measureText(testChar).width;

    return targetWidth !== baseWidth;
}

export function getAvaliableFontFamilies() {
    const fontFamilies = CHINESE_FONT_FAMILIES
        .filter(font => isFontInstalled(font));

    return Array.from(new Set(fontFamilies)).sort();
}
