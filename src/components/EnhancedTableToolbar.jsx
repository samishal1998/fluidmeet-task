import React from "react";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";
import {
  Divider,
  ListItem,
  ListItemText,
  FormControlLabel,
  Menu,
  MenuItem,
  InputAdornment,
  TextField,
  Tooltip,
  IconButton,
  Checkbox,
  Toolbar,
} from "@material-ui/core";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  textField: {
    margin: theme.spacing(2),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 65%",
    textAlign: "start",
  },
}));

export const EnhancedTableToolbar = ({
  requestFilter,
  requestQuery,
  filters,
}) => {
  const classes = useToolbarStyles();
  const [query, setQuery] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event) => {
    setQuery(event.target.value);
  };
  React.useEffect(() => {
    if (!query.trim()) requestQuery("");
  }, [query]);
  return (
    <Toolbar className={classes.root}>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Listings
      </Typography>

      <TextField
        className={classes.textField}
        id="outlined-basic"
        label="Search"
        variant="outlined"
        value={query}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {" "}
              <IconButton
                aria-label="search"
                onClick={() => requestQuery(query)}
                edge="end"
              >
                {" "}
                <SearchIcon />{" "}
              </IconButton>{" "}
            </InputAdornment>
          ),
        }}
      />

      <div>
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list" onClick={handleClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {filters.map((filter, index) => {
            return (
              <div>
                <ListItem>
                  <ListItemText primary={filter.label} />
                </ListItem>
                <Divider />
                {filter.values.map((value, j) => {
                  return (
                    <StyledMenuItem>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={value.checked}
                            name={value.id}
                            color="primary"
                            onChange={(event) => {
                              let newFilters = filters;
                              newFilters[index].values[j].checked =
                                event.target.checked;
                              handleClose();
                              requestFilter(newFilters);
                            }}
                          />
                        }
                        label={value.id}
                      />
                    </StyledMenuItem>
                  );
                })}
              </div>
            );
          })}
        </StyledMenu>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {};

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);
