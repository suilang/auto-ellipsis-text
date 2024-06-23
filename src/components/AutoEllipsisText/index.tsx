import { useCallback, useEffect, useRef, useState } from 'react';


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

    useEffect(() => {
        setStr(text);
        Promise.resolve().then(() => {
            handle();
        });
    }, [text, version]);

    return (
        <div
            className={`auto-ellipsis-text ${className || ''}`}
            ref={textRef}
            style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}
        >
            <span className="auto-ellipsis-text-inner">{str}</span>
        </div>
    );
}
