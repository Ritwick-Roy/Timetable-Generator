import { useEffect, useRef, useState } from 'react'
import './index.css'

const Table = () => {

    const [rows, setRows] = useState(5);
    const [columns, setColumns] = useState(9);
    const [periods, setPeriods] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const data=useRef([])
    const index=useRef([])

    const onChangeInput = (e, i, j) => {
        e.preventDefault();
        const { value } = e.target;
        data.current[i].col_number[j] = value;
        setPeriods(data.current);
        console.log(data.current);
        setRefresh(!refresh);
    }

    useEffect(()=>{
        let i, j;
        for (i = 0; i < rows; ++i) {
            data.current[i] = {};
            data.current[i]["row_number"] = i;
            const col = {}
            for (j = 0; j < columns; ++j)
                col[j.toString()] = "1"
            data.current[i]["col_number"] = col;
        }
        index.current=[];
        for (i = 0; i < columns; ++i)
            index.current[i] = i.toString();
        console.log(index.current);
        data.current=data.current.slice(0,rows);
        setPeriods(data.current);
    },[rows,columns])

    return (
        <div className="container">
            <h1 className="title">Dynamic Table</h1>
            <label htmlFor="rows">Rows:</label>{'\n'}
            <input
                name="rows"
                value={rows}
                type="number"
                onChange={(e) => {setRows(e.target.value)}}
                placeholder="Rows"
            />
            <label htmlFor="columns">Columns:</label>
            <input
                name="columns"
                value={columns}
                type="number"
                onChange={(e) => {setColumns(e.target.value)}}
                placeholder="Columns"
            />
            <table>
                <thead>
                    <tr>
                        {
                            index.current.map((item) => (<th>Period{1+parseInt(item)}</th>))
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
                                        />
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

export default Table