import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import {  makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  error: {
    backgroundColor: "#D84F4F",
  },
}));
export function ListingRow({ listing, columns }) {
  const classes = useStyles();
  let now = new Date().getTime();
  let difference = now - listing.created_datetime_ms;
  let more_than_24hrs = difference / (1000 * 60 * 60) >= 24;
  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={listing.code}>
      {columns.map((column) => {
        const value = listing[column.id];
        const formattedValue =
          column.format && typeof value === "number"
            ? column.format(value)
            : clsx({ [value]:value , " --- ":!value});

        const action = more_than_24hrs ? (
          <>
            No Activity in the Last 24-Hrs, Contact the client <br />{" "}
            <strong>{listing.email}</strong>{" "}
          </>
        ) : (
          "No Actions"
        );
        return (
          <TableCell
            className={clsx({
              [classes.error]: more_than_24hrs && column.id === "actions",
            })}
            key={column.id}
            align={column.align}
            style={{ maxWidth: column.maxWidth }}
          >
            {column.id !== "actions" ? formattedValue : action}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
