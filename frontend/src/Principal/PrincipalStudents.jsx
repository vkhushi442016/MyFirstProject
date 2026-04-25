import React, {useState, useEffect} from 'react'
import useStore from '../common/store/store';
import axios from 'axios';
import Students from '../TeacherComponents/Students';

const PrincipalStudents = () => {
    const [res, finalRes] = useState([])
    const diseCode = useStore((state) => state.dise_code)

    async function getISData(diseCode) {
        const response = await axios(`http://localhost:5008/school/facilities/${diseCode}`);
        console.log(response.data)
        finalRes(response.data)
    }

    useEffect(() => {
        getISData(diseCode);
    }, [])

    return (
        <div>
            <Students />
        </div>
    )
}

export default PrincipalStudents
