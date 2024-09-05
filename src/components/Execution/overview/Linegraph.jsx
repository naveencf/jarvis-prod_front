import React, { useState } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const getAxisYDomain = (from, to, ref, offset) => {
    const refData = initialData.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
        if (d[ref] > top) top = d[ref];
        if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
};



const Linegraph = ({ gdata }) => {
    const initialState = {
        data: gdata,
        left: 'dataMin',
        right: 'dataMax',
        refAreaLeft: '',
        refAreaRight: '',
        top: 'dataMax+1',
        bottom: 'dataMin-1',
        top2: 'dataMax+20',
        bottom2: 'dataMin-20',
        animation: true,
    };
    const [state, setState] = useState(initialState);

    const zoom = () => {
        let { refAreaLeft, refAreaRight, data } = state;

        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            setState(prevState => ({
                ...prevState,
                refAreaLeft: '',
                refAreaRight: '',
            }));
            return;
        }

        // xAxis domain
        if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        // yAxis domain
        const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, 'cost', 1);
        const [bottom2, top2] = getAxisYDomain(refAreaLeft, refAreaRight, 'impression', 50);

        setState(prevState => ({
            ...prevState,
            refAreaLeft: '',
            refAreaRight: '',
            data: data.slice(),
            left: refAreaLeft,
            right: refAreaRight,
            bottom,
            top,
            bottom2,
            top2,
        }));
    }

    const zoomOut = () => {
        const { data } = state;
        setState(prevState => ({
            ...prevState,
            data: data.slice(),
            refAreaLeft: '',
            refAreaRight: '',
            left: 'dataMin',
            right: 'dataMax',
            top: 'dataMax+1',
            bottom: 'dataMin',
            top2: 'dataMax+50',
            bottom2: 'dataMin+50',
        }));
    }

    const { data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2 } = state;

    return (
        <div className="highlight-bar-charts" style={{ userSelect: 'none', width: '100%' }}>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    width={800}
                    height={400}
                    data={data}
                    onMouseDown={(e) => setState(prevState => ({ ...prevState, refAreaLeft: e.activeLabel }))}
                    onMouseMove={(e) => refAreaLeft && setState(prevState => ({ ...prevState, refAreaRight: e.activeLabel }))}
                    onMouseUp={zoom}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis allowDataOverflow dataKey="name" domain={[left, right]} type="number" />
                    <YAxis allowDataOverflow domain={[bottom, top]} type="number" yAxisId="1" />
                    <YAxis orientation="right" allowDataOverflow domain={[bottom2, top2]} type="number" yAxisId="2" />
                    <Tooltip />
                    <Line yAxisId="1" type="natural" dataKey="cost" stroke="#8884d8" animationDuration={300} />
                    <Line yAxisId="2" type="natural" dataKey="impression" stroke="#82ca9d" animationDuration={300} />

                    {refAreaLeft && refAreaRight ? (
                        <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                    ) : null}
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}

export default Linegraph;