import { useEffect, useRef, useState } from 'react'
import '../index.css'

const Table = ({ rows, columns, setBans }) => {

    const [periods, setPeriods] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const index_row = useRef([])
    const index_col = useRef([])

    const onChangeInput = (e, i, j) => {
        e.preventDefault();
        const { value } = e.target;
        const new_periods = periods;
        if (parseInt(value) === 1)
            new_periods[i * columns + j] = 0;
        else
            new_periods[i * columns + j] = 1;
        setPeriods(new_periods);
        parseTT(periods);
        setRefresh(!refresh);
    }

    const parseTT = (periods) => {
        let res = "";
        periods.forEach((period) => {
            res += period.toString();
        })
        setBans(res);
    }

    useEffect(() => {
        index_row.current=[]
        index_col.current=[]
        let i;
        for (i = 0; i < rows; ++i)
        index_row.current[i] = i;
        for (i = 0; i < columns; ++i)
        index_col.current[i] = i;
        const periods_init=[]
        for (i = 0; i < rows*columns; ++i)
        periods_init[i] = 1;
        setPeriods(periods_init);
    }, [rows, columns])

    return (
        <div className="container">
            <h1 className="title">Set allowed periods</h1>
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
                                        <button value={periods[row * columns + col]} onClick={(e) => onChangeInput(e, row, col)}>{periods[row * columns + col]}</button>
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