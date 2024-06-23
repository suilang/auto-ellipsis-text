[简体中文](./readme.zh.md)

---

# Preface
In projects, it is common to encounter scenarios where text needs to be abbreviated, displaying in a single line without wrapping, and automatically showing '...' when exceeding the container's width.

There are two commonly used effects for this purpose: abbreviation in the middle of the text and at the end of the text. The effects are as follows:

```
// Middle abbreviation
This is an overly long...overly long text display.
// End abbreviation
This is an overly long text, see how it exceeds....
```
For descriptive text, it is generally preferred to abbreviate at the end, which can be quickly achieved with `css` alone. However, for filenames and similar scenarios, it is desirable to abbreviate in the middle while keeping the file extension at the end. Below, I will introduce the implementation of both methods.
# End Abbreviation
To achieve this with `css`, you need to implement three effects:
1. Hide content that exceeds the container.
2. Prevent text from wrapping automatically.
3. Set the corresponding style for overflow.
> If you find that the style is not taking effect during implementation, it is certain that one or more of the above three conditions are not met.
The corresponding `css` code is as follows:
```css
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
```
# Middle Abbreviation
The style for middle abbreviation requires manually splitting the string and inserting '...' in the middle. The key is to determine the starting and ending positions for the split.
## Organizing the Approach
> This example uses `React` for implementation.
1. To ensure versatility, the width of the container cannot be predetermined; it needs to adapt to the width of its parent element. Therefore, two nested elements are defined: the outer element follows the parent's width and sets `overflow: hidden; white-space: nowrap;`, while the inner element has no width restrictions to ensure it can occupy space normally.
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
2. Then, implement the logic for calculating width and update the rendered node.
Add a `ref` to `div.auto-ellipsis-text` to get the corresponding DOM handle.
```js
const handle = useCallback(() => {
    // Get the handle of the rendered node
    const cu = textRef.current;
    if (!cu) {
        return;
    }
    // Get the width of the parent element
    const width = cu.clientWidth;
    // Get the width of the text node
    const textChild = cu.firstElementChild as HTMLElement;
    const innerWidth = textChild.offsetWidth;
    
    // If it does not exceed, do nothing
    if (width >= innerWidth) {
        return;
    }
    // Calculate the split position
    const splitWidth = width / 2;
    const range = document.createRange();
    const length = textChild.innerText.length;
    const arr = [];
    let countWidth = 0;
    let startIndex = 0;
    let endIndex = 0;
    // Step through by 2, getting the corresponding width one by one, and recording the start position when the cumulative width first exceeds splitWidth,
    // and recording the end position when the remaining width first falls below splitWidth, stopping the for loop
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
    // Split the string and append the ellipsis
    const newStr = text.slice(0, startIndex) + '...' + str.slice(endIndex);
    // Update the rendered node
    setStr(newStr);
}, []);
```
## Final Implementation
1. Monitoring the width change of the parent element for each instance would be too performance-intensive, so an input parameter `version` is added. The caller is responsible for listening to the width change and updating `version` to trigger the update.
2. In `useEffect`, listen for changes in `version` and `text`, reset `str` first to ensure that the render is up-to-date, and then in the next event loop, calculate the split position and update the text render using the method described above.
3. Direct reliance on `str` is avoided to prevent infinite loops

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
        /* function...*/
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

This project is licensed under [MIT License](./LICENCE.md)