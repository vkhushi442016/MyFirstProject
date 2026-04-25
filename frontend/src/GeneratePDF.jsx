import { usePDF } from "react-to-pdf";
import { TfiDownload } from "react-icons/tfi";

const GeneratePDF = ({ filename, title, children, renderButton }) => {
    const { toPDF, targetRef } = usePDF({ filename });

    return (
        <div>
            {renderButton ? renderButton(toPDF) : (
                <button
                    onClick={toPDF}
                    className="flex items-center gap-1 px-4 py-2 text-purple-500 hover:text-red-600 transition"
                >
                    <TfiDownload />
                </button>
            )}

            {/* Hidden content for PDF */}
            <div ref={targetRef} className="absolute -left-[9999px] w-[800px] p-5 bg-white">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default GeneratePDF;