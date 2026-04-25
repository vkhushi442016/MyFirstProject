import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center justify-between bg-white px-4 py-2 sm:px-6 border-t border-slate-200 rounded-2xl">
            {/* Mobile View: Simple Prev/Next */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    Next
                </button>
            </div>

            {/* Desktop View: Full Pagination */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-500 m-2">
                        Showing page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
                        <span className="font-semibold text-slate-900">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                        {/* Previous Button */}
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-xl border border-slate-300 bg-white px-3 py-2 text-slate-400 hover:bg-slate-50 focus:z-20 disabled:opacity-40 transition-colors"
                        >
                            <span className="sr-only">Previous</span>
                            <FaChevronLeft className="h-4 w-4" />
                        </button>

                        {/* Page Numbers */}
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            const isActive = currentPage === pageNum;
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-semibold transition-all focus:z-20 
                                        ${isActive 
                                            ? 'bg-violet-500 border-violet-500 text-white shadow-md scale-105 z-20' 
                                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {/* Next Button */}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-xl border border-slate-300 bg-white px-3 py-2 text-slate-400 hover:bg-slate-50 focus:z-20 disabled:opacity-40 transition-colors"
                        >
                            <span className="sr-only">Next</span>
                            <FaChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};
