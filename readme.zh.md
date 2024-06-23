# 前言
项目中经常会遇到缩略展示文字的场景，即要求文字在一行不换行展示，超出自动展示`...`

常用的展示效果有两种，文字中间缩略以及文字末尾缩略，效果如下所示
```
// 中间缩略
这是一段超长...超长文字如何展示

// 末尾缩略
这是一段超长的文字，看看超长....
```

对于描述之类的文本，一般选择末尾缩略，这种场景仅靠`css`即可快速实现。但是对于文件名之类的场景，会期望中间缩略，保留末尾的文件后缀。下面分别介绍下两种方案的实现。


# 末尾缩略

使用css需实现3个效果：

1. 内容超出不展示
2. 文字不会自动折行
3. 设置对应超出样式

> 如果在实现过程中发现样式不生效，一定是上述3个条件有不满足的。

对应`css`代码如下：
```css
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
```

# 中间缩略

中间缩略的样式，只能手动切分字符串，并在中间拼接`...`， 因此关键在与，如何获得要切分的起止位置。

## 思路整理

> 本例使用`React`实现

1. 因为要做到通用性所以， container 的宽度是不能确定的，它的宽度需要根据它外层的父元素来决定。因此定义两层嵌套元素，外层宽度跟随父元素，并设置`overflow: hidden;white-space: nowrap;`。内层宽度不做限定，保证可以正常占位。

```js
<div className="auto-ellipsis-text">
    <span className="auto-ellipsis-text-inner">{str}</span>
 </div>
```

```css
.auto-ellipsis-text{
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
}
```

2. 然后实现下宽度计算逻辑，并更新渲染节点

在`div.auto-ellipsis-text`上增加`ref`，获取对应的`dom`句柄


```js
const handle = useCallback(() => {
    // 获取渲染节点的句柄
    const cu = textRef.current;
    if (!cu) {
        return;
    }
    // 获取此时父元素宽度
    const width = cu.clientWidth;

    // 获取文本节点宽度
    const textChild = cu.firstElementChild as HTMLElement;
    const innerWidth = textChild.offsetWidth;
    
    // 没有超出则不处理
    if (width >= innerWidth) {
        return;
    }

    // 计算切分位置
    const splitWidth = width / 2;

    const range = document.createRange();
    const length = textChild.innerText.length;
    const arr = [];
    let countWidth = 0;
    let startIndex = 0;
    let endIndex = 0;
    // 步进为2，逐个获取对应的宽度，并在首次累计宽度大于 splitWidth 时记录起始位置，
    // 在首次剩余宽度小于 splitWidth 时，记录截止位置，停止for循环
    for (let i = 0; i < length - 2; i += 2) {
        range.setStart(textChild.childNodes[0], i);
        range.setEnd(textChild.childNodes[0], i + 2);
        const rs = range.getBoundingClientRect();
        arr.push({ index: i, width: rs.width });
        countWidth += rs.width;
        if (countWidth > splitWidth && !startIndex) {
            startIndex = i;
        }
        if (innerWidth - countWidth < splitWidth) {
            endIndex = i + 2;
            break;
        }
    }
    // 切分字符串并补充缩略符
    const newStr = text.slice(0, startIndex) + '...' + str.slice(endIndex);

    // 更新渲染节点
    setStr(newStr);
}, []);

```
## 最终实现

1. 如果每个实例都监听父元素宽度的变化，性能太差，因此补充入参`version`，由调用方自行监听宽度并变更`version`来触发更新
2. 在`useEffect`中监听`version`和`text`的变化，先重置`str`，保证渲染是最新的，然后在下个事件循环中，使用上文中的方式，计算切分位置并更新文本渲染
3. 不直接依赖`str`是为了防止计算出问题导致的无线死循环，上条中`useEffect`只会在`text`变化或者`version`变化后才会执行

```js
export default function AutoEllipsisText({
    text,
    className,
    version,
}: {
    text: string;
    className?: string;
    version?: number;
}) {
    const [str, setStr] = useState(text);
    const textRef = useRef<HTMLDivElement>(null);

    const handle = useCallback(() => {
        /* 功能函数...*/
    }, []);

    useEffect(() => {
        setStr(text);
        Promise.resolve().then(() => {
            handle();
        });
    }, [text, version]);

    return (
        <div className={`auto-ellipsis-text ${className || ''}`} ref={textRef}>
            <span className="auto-ellipsis-text-inner">{str}</span>
        </div>
    );
}

```

# License

[MIT License](./LICENCE.md)