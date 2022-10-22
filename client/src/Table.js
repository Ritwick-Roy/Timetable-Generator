import { useEffect, useRef, useState } from 'react'
import './index.css'

const Table = ({ rows, columns, setBans }) => {

    const [periods, setPeriods] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const data = useRef([])
    const index = useRef([])

    const onChangeInput = (e, i, j) => {
        e.preventDefault();
        const { value } = e.target;
        data.current[i].col_number[j] = value;
        setPeriods(data.current);
        parseTT(data.current);
        setRefresh(!refresh);
    }

    const parseTT = (periods) => {
        let res = "";
        periods.forEach((period) => {
            for (let i = 0; i < columns; ++i)
                res += period.col_number[i];
        })
        setBans(res);
    }

    useEffect(() => {
        let i, j;
        for (i = 0; i < rows; ++i) {
            data.current[i] = {};
            data.current[i]["row_number"] = i;
            const col = {}
            for (j = 0; j < columns; ++j)
                col[j.toString()] = "1"
            data.current[i]["col_number"] = col;
        }
        index.current = [];
        for (i = 0; i < columns; ++i)
            index.current[i] = i.toString();
        data.current = data.current.slice(0, rows);
        setPeriods(data.current);
    }, [rows, columns])

    return (
        <div className="container">
            <h1 className="title">Set allowed periods</h1>
            <table>
                <thead>
                    <tr>
                        {
                            index.current.map((item) => (<th>Period{1 + parseInt(item)}</th>))
                        }
                    </tr>
                </thead>
                <tbody>
                    {periods.map((row) => (
                        <tr key={row.row_number}>
                            {
                                index.current.map((entry) => (
                                    <td>
                                        <input
                                            name="col"
                                            value={row.col_number[entry]}
                                            type="text"
                                            onChange={(e) => onChangeInput(e, row.row_number, entry)}
                                            placeholder="1"
                                        />
                                    </td>
                                ))
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <br />
        </div>
    )
}

export default Table