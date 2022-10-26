import React, { useEffect, useRef, useState } from 'react'

const Schedule = ({ rows, columns, periods }) => {

    const index_row = useRef([])
    const index_col = useRef([])
    const timetable = useRef([])
    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        let i, j;
        index_row.current = [];
        index_col.current = [];
        for (i = 0; i < rows; ++i)
            index_row.current[i] = i.toString();
        for (i = 0; i < columns; ++i)
            index_col.current[i] = i.toString();
        for (i = 0; i < rows; ++i) {
            timetable.current[i] = []
            for (j = 0; j < columns; ++j) {
                timetable.current[i][j] = periods[columns * i + j];
            }
        }
        console.log(timetable.current);
    }, [rows, columns, refresh]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {refresh && <button onClick={() => setRefresh(!refresh)}>Display</button>}
            <table>
                <thead>
                    <tr>
                        {
                            index_col.current.map((item) => (<th>Period{1 + parseInt(item)}</th>))
                        }
                    </tr>
                </thead>
                <tbody>
                    {index_row.current.map((row) => (
                        <tr>
                            {
                                index_col.current.map((col) => (
                                    <td>
                                        {timetable.current[row][col]}
                                    </td>
                                ))
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Schedule