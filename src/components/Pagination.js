
import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate, onChangePage }) => {
    const pageNumbers = [];

    function handlePageChange(event, newPage) {
        event.preventDefault();
        onChangePage(newPage);
    }

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={(e) => handlePageChange(e, number)} href="!#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;