import axios from 'axios';
import React, { useState } from "react";

const Form = () => {
        
  const [data, setData] = useState("");

    const func = async () =>{
    axios.post('/',{
        'input':'5 5 4 6 NA 3 tina 4 L1 L2 M1 M2 audi none 0 4 tina 1 L1 C1 none tina 1 L2 C1 none pankaj 1 M1 C2 none pankaj 1 M2 C2 none DMS 3 vivek 4 L1 L2 M1 M2 audi none 4 vivek 1 L1 S1 none vivek 1 L2 S1 none vivek 1 M1 S1 none vivek 1 M2 S1 none 0 CAO 3 vivek 4 L1 L2 M1 M2 audi none 0 0 PC 1 vivek 4 L1 L2 M1 M2 audi none 0 4 vivek 1 L1 C2 none manisha 1 L2 C1 none deep 1 M1 C2 none jain 1 M2 C2 none DSA 3 manisha 4 L1 L2 M1 M2 audi none 0 4 manisha 1 L1 C2 none manisha 1 L2 C2 none manisha 1 M1 C1 none manisha 1 M2 C1 none OS 3 jain 4 L1 L2 M1 M2 audi none 0 4 jain 1 L1 C2 none jain 1 L2 C2 none jain 1 M1 C1 none jain 1 M2 C2 none '
    },{
        headers:{
        'Content-Type':'application/json'
        }
    })
    .then((res)=>{
        console.log(res.data);
        setData(JSON.stringify(res.data));
    })
    }

    return (
        <div className="App">
            <button
                onClick={() => {
                    func();
                }}
                >
                GET TIMETABLE
            </button>
            { data }
        </div>
    );

}

export default Form;