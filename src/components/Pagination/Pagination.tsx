import React from "react";
import styles from "./Pagination.module.css";
import Button from "../Button/Button";

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
      <Button onClick={onPrev} size="small" disabled={currentPage === 1}>
        Prev
      </Button>
      <span
        className={styles.pagination_label}
      >{`${currentPage} / ${totalPages}`}</span>
      <Button
        onClick={onNext}
        size="small"
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
