import React from 'react'

const SortingLogic = () => {
  const [results, setResults] = useState([]);
    
    const handleSort = (key) => {
    const sortedData = results.slice();  //for making a copy 

    sortedData.sort(function (a, b) {
      var valA = a[key].toLowerCase();
      var valB = b[key].toLowerCase();

      if (valA > valB) return sortOrder === "asc" ? -1 : 1;
      if (valA < valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setResults(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }

  return (
    <div>
      <button onClick={() => handleSort('schoolName')}>
        Sort {sortOrder === "asc" ? "A → Z" : "Z → A"}
      </button>
    </div>
  )
}

export default SortingLogic
