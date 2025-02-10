import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  onNext: () => void;
  onPrev: () => void;
  totalPages: number;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  onNext,
  onPrev,
  totalPages,
  currentPage,
}) => {
  return (
    <div className={styles.root}>
      <button onClick={onPrev} className={styles.prev_btn} disabled={currentPage === 1}>
        Previous
      </button>
      <span className={styles.pagination_label}>{`${currentPage} / ${totalPages}`}</span>
      <button onClick={onNext} className={styles.next_btn} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
