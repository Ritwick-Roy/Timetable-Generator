import './App.css';
import axios from 'axios';
import React, { useState } from "react";

function App() {

  const [data, setData] = useState("");

  const func = async () =>{
    axios.post('/',{
      'input':'5 5 4 6 NA 3 tina 4 L1 L2 M1 M2 audi 0 4 tina 1 L1 C1 tina 1 L2 C1 pankaj 1 M1 C2 pankaj 1 M2 C2 DMS 3 vivek 4 L1 L2 M1 M2 audi 4 vivek 1 L1 S1 vivek 1 L2 S1 vivek 1 M1 S1 vivek 1 M2 S1 0 CAO 3 vivek 4 L1 L2 M1 M2 audi 0 0 PC 1 vivek 4 L1 L2 M1 M2 audi 0 4 vivek 1 L1 C2 manisha 1 L2 C1 deep 1 M1 C2 jain 1 M2 C2 DSA 3 manisha 4 L1 L2 M1 M2 audi 0 4 manisha 1 L1 C2 manisha 1 L2 C2 manisha 1 M1 C1 manisha 1 M2 C1 OS 3 jain 4 L1 L2 M1 M2 audi 0 4 jain 1 L1 C2 jain 1 L2 C2 jain 1 M1 C1 jain 1 M2 C2 '
    },{
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then((res)=>{
      console.log(res.data);
      setData(res.data.message);
    })
  }

  return (
    <div className="App">
      { data }
      <button
        onClick={() => {
          func();
        }}
      >
        Check Again
      </button>
    </div>
  );
}

export default App;
