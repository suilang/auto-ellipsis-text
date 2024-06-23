import { useCallback, useState } from 'react';
import { AutoEllipsisText } from './components';
import './index.less';

export default function Root(props) {
    const [width, setWidth] = useState(200);

    const handleWidthChange = useCallback((width: number) => {
        setWidth(width);
    }, []);

    return (
        <div className="demo-page">
            <div className="demo-page-container">
                <div className="demo-page-container-label">中间省略</div>
                <div className="fixed-width-container" style={{ width }}>
                    <AutoEllipsisText text="这是一个超长的文件名超长的文件名超长的文件名文件末尾在这里.txt" version={width} />
                </div>
                <div className="demo-page-container-label">末尾省略</div>
                <div className="fixed-width-container" style={{ width }}>
                    <div className="end-ellipsis">{'这是一个超长的超长的文件名超长的文件名文件名文件末尾在这里.txt'}</div>
                </div>
                <div className="size-button-list">
                    <div className="size-button-list-item" onClick={() => handleWidthChange(200)}>
                        200
                    </div>
                    <div className="size-button-list-item" onClick={() => handleWidthChange(400)}>
                        400
                    </div>
                    <div className="size-button-list-item" onClick={() => handleWidthChange(500)}>
                        500
                    </div>
                </div>
            </div>
        </div>
    );
}
