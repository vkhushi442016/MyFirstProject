import { useState, useEffect } from "react";
import axios from "axios";

const PaginationSchoolManagement = () => {
    const [schools, setSchools] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchSchoolsPaginatedData = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5008/api/schools?page=${pageNumber}&limit=10`);
            setSchools(res.data.data);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSchoolsPaginatedData(page)
    }, [page]);

    return (
        <div className="p-4">
            <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>{page} / {totalPages}</span>

        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

        </div>
    )
}

export default PaginationSchoolManagement
