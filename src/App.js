import "./App.css";
import React from "react";
import { DataTable } from "./components/DataTable";
import _ from "lodash";
import { DoughnutChart } from "./components/DoughnutChart";
import { CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: "80vw",
    paddingBottom: theme.spacing(1),
    margin: theme.spacing(3),
  },
  paper: {
    // padding: theme.spacing(1),
    textAlign: "center",
    flexGrow: 1,
    color: theme.palette.text.secondary,
  },
});

class App extends React.Component {
  state = {
    data: [],
    byUserType: [],
    byProposalStatus: [],
  };

  componentDidMount() {
    let headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "http://localhost:3000");

    fetch("http://backend-task.local/")
      .then((response) => response.json())
      .then(({ listings }) => {
        let byProposalStatus = _.groupBy(
          listings,
          (item) => item.proposal_status
        );
        byProposalStatus = Object.keys(byProposalStatus).map((key) => [
          key,
          Math.floor((100 * byProposalStatus[key].length) / listings.length),
        ]);
        let byUserType = _.groupBy(listings, (item) => item.user_type);
        byUserType = Object.keys(byUserType).map((key) => [
          key,
          Math.floor((100 * byUserType[key].length) / listings.length),
        ]);
        console.log(byUserType);
        console.log(byProposalStatus);
        // this.setState({byUserType,byProposalStatus})
        this.setState({
          byUserType,
          byProposalStatus,
          data: listings.map((item) => ({
            ...item,
            user_name: item.first_name + " " + item.last_name,
            created_datetime_ms: Date.parse(item.created_datetime),
            proposal_datetime_ms: Date.parse(item.proposal_datetime),
          })),
        });
      })
      .catch(console.log);
  }
  render() {
    const { data, byUserType, byProposalStatus } = this.state;
    const { classes } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          {data.length ? (
            <>
              <div className={classes.root}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <DoughnutChart
                        data={[["User Type", "Percentage"], ...byUserType]}
                        title={"Distribution of Listings by user Type"}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <DoughnutChart
                        data={[["Status", "Percentage"], ...byProposalStatus]}
                        title={"Distribution of Listings by Status"}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </div>
              
              <DataTable data={data} />
            </>
          ) : (
            <CircularProgress />
          )}
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(App);
