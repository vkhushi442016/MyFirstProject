import React, { useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import ProgressBar from './ProgressBar'
import axios from 'axios'
import PieChart from './PieChart'
import DoughnutChart from './DoughnutChart'

const SyllabusTracking = () => {
  const [res, setRes] = useState([])
  const [data, setData] = useState([])
  const [hsdata, setHsData] = useState([])

  async function getSyllabusData() {
    const result = await fetch('http://localhost:5008/syllabusdata');
    const response = await result.json();
    setRes(response);
  }

  useEffect(() => {
    getSyllabusData()
  }, [])

  async function getMiddleSchoolSyllabus() {
    const result = await fetch('http://localhost:5008/syllabusdatamiddleschool');
    const response = await result.json();
    setData(response);
  }

  useEffect(() => {
    getMiddleSchoolSyllabus()
  }, [])

  async function getHigherSchoolSyllabus() {
    const response = await axios('http://localhost:5008/syllabusdatahs')
    setHsData(response.data)
  }

  useEffect(() => {
    getHigherSchoolSyllabus()
  }, [])

  const averageOfAverages = data.length
    ? (
      data.reduce((sum, item) => {
        const avgPerRow =
          (
            Number(item.class1 || 0) +
            Number(item.class2 || 0) +
            Number(item.class3 || 0) +
            Number(item.class4 || 0) +
            Number(item.class5 || 0) +
            Number(item.class6 || 0) +
            Number(item.class7 || 0) +
            Number(item.class8 || 0)
          ) / 8;
        return sum + avgPerRow;
      }, 0) / data.length
    ).toFixed(2)
    : "0.00";

  const averageOfAveragesPrimary = res.length
    ? (
      res.reduce((sum, item) => {
        const avgPerRow =
          (
            Number(item.class1 || 0) +
            Number(item.class2 || 0) +
            Number(item.class3 || 0) +
            Number(item.class4 || 0) +
            Number(item.class5 || 0) 
          ) / 5;
        return sum + avgPerRow;
      }, 0) / res.length
    ).toFixed(2)
    : "0.00";

    const averageOfAveragesHS = hsdata.length
    ? (
      hsdata.reduce((sum, item) => {
        const avgPerRow =
          (
            Number(item.class1 || 0) +
            Number(item.class2 || 0) +
            Number(item.class3 || 0) +
            Number(item.class4 || 0) +
            Number(item.class5 || 0) +
            Number(item.class6 || 0) +
            Number(item.class7 || 0) +
            Number(item.class8 || 0) +
            Number(item.class9 || 0) +
            Number(item.class10 || 0) +
            Number(item.class11 || 0) +
            Number(item.class12 || 0)
          ) / 12;
        return sum + avgPerRow;
      }, 0) / hsdata.length
    ).toFixed(2)
    : "0.00";

  console.log("Average of all Primary:", averageOfAveragesHS);


  return (
    <div>
      <h1 className='text-2xl m-1 font-bold'>Syllabus Tracking 2025-26</h1>
      <hr className='border-gray-300 m-2' />
      <h1 className='text-xl m-1 font-semibold'>Syllabus Completion</h1>
      <div className='flex justify-between bg-white'>
        <div className='m-3'>
          <h2 className="text-xl font-semibold text-center mb-4">
            Primary School
          </h2>
          <DoughnutChart averageOfAverages={averageOfAveragesPrimary} />
        </div>
        <div className='m-3'>
          <h2 className="text-xl font-semibold text-center mb-4">
            Middle School
          </h2>
          <DoughnutChart averageOfAverages={averageOfAverages} />
        </div>
        <div className='m-3'>
          <h2 className="text-xl font-semibold text-center mb-4">
            Higher Secondary School
          </h2>
            <DoughnutChart averageOfAverages={averageOfAveragesHS}/>
        </div>
      </div>
      <div className='m-2'>
        <span className='text-2xl'>Primary School</span>
      </div>

      <div className='w-full overflow-x-auto overflow-y-visible'>
        <table className="table-auto mt-2 border-collapse w-full capitalise bg-white rounded-md">
          <thead>
            <tr className='border-b border-gray-300 h-11 px-4'>
              <th className="font-normal">Dise Code</th>
              <th className="font-normal">School Name</th>
              <th className="font-normal">Class 1</th>
              <th className="font-normal">Class 2</th>
              <th className="font-normal">Class 3</th>
              <th className="font-normal">Class 4</th>
              <th className="font-normal">Class 5</th>
              <th className="font-normal">Progress</th>
              <th className="font-normal">Expected Date of Completion</th>
            </tr>
          </thead>
          <tbody>
            {
              res.map((item) => {
                const average =
                  (
                    Number(item.class1) +
                    Number(item.class2) +
                    Number(item.class3) +
                    Number(item.class4) +
                    Number(item.class5)
                  ) / 5;
                return (
                  <tr className='border-b border-gray-300 h-12'>
                    <td className="h-11 px-4 pl-6 py-2">{item.dise_code}</td>
                    <td className="h-11 px-4 pl-6 py-2 font-semibold">{item.schoolName}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class1}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class2}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class3}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class4}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class5}</td>
                    <td className="h-11 px-4 pl-6 py-2">
                      {average.toFixed(2)} %
                      <ProgressBar value={average.toFixed(2)} />
                    </td>
                    <td className="h-11 px-4 pl-6 py-2">
                      {
                        item.expected_date_of_completion ?
                          new Date(item.expected_date_of_completion).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          }).replace(/ /g, ' ')
                          : "-"}</td>
                  </tr>

                );
              })
            }
          </tbody>
        </table>
      </div>

      <div className='m-2'>
        <span className='text-2xl mt-2'>Middle School</span>
      </div>

      <div className='w-full overflow-x-auto overflow-y-visible'>
        <table className="table-auto mt-2 border-collapse w-full capitalise bg-white rounded-md">
          <thead>
            <tr className='border-b border-gray-300 h-11 px-4'>
              <th className="font-normal">Dise Code</th>
              <th className="font-normal">School Name</th>
              <th className="font-normal">Class 1</th>
              <th className="font-normal">Class 2</th>
              <th className="font-normal">Class 3</th>
              <th className="font-normal">Class 4</th>
              <th className="font-normal">Class 5</th>
              <th className="font-normal">Class 6</th>
              <th className="font-normal">Class 7</th>
              <th className="font-normal">Class 8</th>
              <th className="font-normal">Progress</th>
              <th className="font-normal">Expected Date of Completion</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((item) => {
                const average2 = (
                  Number(item.class1) +
                  Number(item.class2) +
                  Number(item.class3) +
                  Number(item.class4) +
                  Number(item.class5) +
                  Number(item.class6) +
                  Number(item.class7) +
                  Number(item.class8)
                )
                  / 8;
                return (
                  <tr className='border-b border-gray-300 h-12'>
                    <td className="h-11 px-4 pl-6 py-2">{item.dise_code}</td>
                    <td className="h-11 px-4 pl-6 py-2 font-semibold">{item.schoolName}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class1}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class2}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class3}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class4}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class5}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class6}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class7}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class8}</td>
                    <td className="h-11 px-4 pl-6 py-2">
                      {average2.toFixed(2)} %
                      <ProgressBar value={average2.toFixed(2)} />
                    </td>
                    <td className="h-11 px-4 pl-6 py-2">
                      {
                        item.expected_date_of_completion ?
                          new Date(item.expected_date_of_completion).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          }).replace(/ /g, ' ')
                          : "-"}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>

      <div className='m-2'>
        <span className='text-2xl mt-2'>Higher Secondary School</span>
      </div>
      <div className='w-full overflow-x-auto overflow-y-visible'>
        <table className="table-auto mt-2 border-collapse w-full capitalise bg-white rounded-md">
          <thead>
            <tr className='border-b border-gray-300 h-11 px-4'>
              <th className="font-normal">Dise Code</th>
              <th className="font-normal">School Name</th>
              <th className="font-normal">Class 1</th>
              <th className="font-normal">Class 2</th>
              <th className="font-normal">Class 3</th>
              <th className="font-normal">Class 4</th>
              <th className="font-normal">Class 5</th>
              <th className="font-normal">Class 6</th>
              <th className="font-normal">Class 7</th>
              <th className="font-normal">Class 8</th>
              <th className="font-normal">Class 9</th>
              <th className="font-normal">Class 10</th>
              <th className="font-normal">Class 11</th>
              <th className="font-normal">Class 12</th>
              <th className="font-normal">Progress</th>
              <th className="font-normal">Expected Date of Completion</th>
            </tr>
          </thead>
          <tbody>
            {
              hsdata.map((item) => {
                const average3 = (
                  Number(item.class1) +
                  Number(item.class2) +
                  Number(item.class3) +
                  Number(item.class4) +
                  Number(item.class5) +
                  Number(item.class6) +
                  Number(item.class7) +
                  Number(item.class8) +
                  Number(item.class9) +
                  Number(item.class10) +
                  Number(item.class11) +
                  Number(item.class12)
                )
                  / 12;
                return (
                  <tr className='border-b border-gray-300 h-12'>
                    <td className="h-11 px-4 pl-6 py-2">{item.dise_code}</td>
                    <td className="h-11 px-4 pl-6 py-2 font-semibold">{item.schoolName}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class1}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class2}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class3}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class4}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class5}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class6}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class7}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class8}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class9}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class10}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class11}</td>
                    <td className="h-11 px-4 pl-6 py-2">{item.class12}</td>
                    <td className="h-11 px-4 pl-6 py-2">
                      {average3.toFixed(2)} %
                      <ProgressBar value={average3.toFixed(2)} />
                    </td>
                    <td className="h-11 px-4 pl-6 py-2">
                      {
                        item.expected_date_of_completion ?
                          new Date(item.expected_date_of_completion).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          }).replace(/ /g, ' ')
                          : "-"}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
      <br />

      {/* <Dropdown /> */}
    </div>
  )
}

export default SyllabusTracking
