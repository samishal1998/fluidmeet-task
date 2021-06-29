import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { ListingRow } from "./ListingRow.js";
import { EnhancedTableHead } from "./EnhancedTableHead.jsx";
import { EnhancedTableToolbar } from "./EnhancedTableToolbar.jsx";

const columns = [
  {
    id: "hotel_name",
    numeric: false,
    disablePadding: true,
    label: "Hotel",
    minWidth: 170,
    sortable: true,
  },
  {
    id: "user_name",
    numeric: false,
    disablePadding: true,
    label: "User",
    minWidth: 170,
    sortable: true,
  },

  {
    id: "budget",
    label: "Budget",
    minWidth: 20,
    align: "right",
    numeric: true,
    disablePadding: true,
    format: (value) => value.toFixed(2),
    sortable: true,
  },
  {
    id: "price",
    label: "Price",
    minWidth: 20,
    align: "left",
    numeric: true,
    disablePadding: true,
    format: (value) => value.toFixed(2),
    sortable: true,
  },
  {
    id: "proposal_status",
    label: "Status",
    minWidth: 100,
    align: "left",
    numeric: true,
    disablePadding: false,
    format: (value) => value.toLocaleString("en-US"),
    sortable: true,
  },
  {
    id: "user_type",
    label: "User Type",
    minWidth: 80,
    align: "left",
    numeric: false,
    disablePadding: false,
    format: (value) => value.toLocaleString("en-US"),
    sortable: true,
  },
  {
    id: "created_datetime_ms",
    label: "Created",
    minWidth: 80,
    align: "left",
    numeric: true,
    disablePadding: false,
    date: true,
    format: (value) =>
      value ? new Date(value).toLocaleString("en-US") : " --- ",
    sortable: true,
  },
  {
    id: "proposal_datetime_ms",
    label: "Proposed",
    minWidth: 80,
    align: "left",
    numeric: true,
    disablePadding: false,
    date: true,
    format: (value) =>
      value ? new Date(value).toLocaleString("en-US") : " --- ",
    sortable: true,
  },

  {
    id: "actions",
    label: "Actions",
    minWidth: 10,
    maxWidth: 120,
    align: "left",
  },
];

const LISTINGS_FILTERS = [
  {
    id: "proposal_status",
    label: "Status",
    values: [
      { id: "Accepted", checked: true },
      { id: "Active", checked: true },
      { id: "Pending", checked: true },
      { id: "Priced", checked: true },
    ],
  },
  {
    id: "user_type",
    label: "User Type",
    values: [
      { id: "User", checked: true },
      { id: "Host", checked: true },
    ],
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
  },
  container: {
    maxHeight: "70vh",
    minHeight: "20vh",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export function DataTable({ data }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  let [rows, setRows] = React.useState(data);
  const [orderBy, setOrderBy] = React.useState("hotel_name");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [filters, setFilters] = React.useState(LISTINGS_FILTERS);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleRequestFilter = (filters) => {
    setFilters(filters);
    let filteredData = data;
    filters.forEach((filter) => {
      const compareArray = [
        ...filter.values.filter((obj) => obj.checked).map((obj) => obj.id),
      ];
      filteredData = filteredData.filter((value) =>
        compareArray.includes(value[filter.id])
      );
    });

    setRows(filteredData);
  };

  const handleRequestQuery = (query) => {
    setRows(
      query
        ? data.filter((value) =>
            value.hotel_name.toLowerCase().includes(query.trim().toLowerCase())
          )
        : data
    );
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          requestFilter={handleRequestFilter}
          requestQuery={handleRequestQuery}
          filters={filters}
        />
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={columns}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((listing) => {
                  return <ListingRow listing={listing} columns={columns} />;
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[...Array(10).keys()].map((i) => 5 * (i + 1))}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  console.log(array);
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
