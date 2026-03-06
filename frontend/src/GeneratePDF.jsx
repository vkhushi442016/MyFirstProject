import React from 'react'
import { usePDF } from "react-to-pdf"
import { TfiDownload } from "react-icons/tfi";
import StaffPdfContent from './StaffPdfContent';

const GeneratePDF = ({ staff }) => {
    const { toPDF, targetRef } = usePDF({ filename: "mydocument.pdf" })

    return (
        <div>
            <button
                onClick={toPDF}
                className="m-1 hover:text-red-600 text-purple-500 px-4 py-2 text-sm cursor-pointer sm:text-lg"
            ><TfiDownload />
            </button>
            {/* Hidden PDF Content */}
            <div
                ref={targetRef}
                className="absolute -left-[9999px] w-[800px] p-5 bg-white"
            >
                <StaffPdfContent staff={staff} />
            </div>
        </div>
    )
}

export default GeneratePDF
