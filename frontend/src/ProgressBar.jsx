import React from 'react'

const ProgressBar = ({ value }) => {
    const getColor = (value) => {
        if (value >= 80) return "bg-green-400 "
        if (value >= 60) return "bg-blue-400"
        if (value >= 40) return "bg-yellow-400"
        return "bg-red-400"
    }
    return (
        <>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${getColor(value)}`}
                style={{ width: `${value}%` }} />
        </div>        
        </>
    )
}

export default ProgressBar
