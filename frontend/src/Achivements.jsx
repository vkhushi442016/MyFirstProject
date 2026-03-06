import React, { useState } from 'react'

const Achivements = () => {
  let [data, setData] = useState([])

  function getDistrictsData() {
    fetch('https://gist.githubusercontent.com/devzakir/ade5836fae0ac40531e6afb111d61870/raw/4fe8c90e127060d55ad3c7d6d603d13528450e5b/india-states-and-districts.json')
      .then((res) => res.json())
      .then((res) => {
        const mp = res.states.find((s) => s.state === "Madhya Pradesh");
        setData(mp.districts)
      })
  }

  return (
    <div>
      <h1>This is achivement and awards section</h1>


      <button onClick={getDistrictsData}>GetData</button>
      <table>
        <thead>
          <tr>
            <th>District ID</th>
            <th>Districts</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((d) => (
              <tr>
                <td>{d.id}</td>
                <td>{d.name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>

    </div>
  )
}

export default Achivements
