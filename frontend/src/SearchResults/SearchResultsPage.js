import Navbar from "../Navbar/Navbar";
import ProjectCard from "../Dashboard/ProjectCard";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import Loader from "react-loader-spinner";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Footer from "../Footer/Footer.js";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function SearchResultsPage(props) {
  let loggedIn = useRef(null);
  const [isLoggedIn, setLoggedIn] = useState(loggedIn);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [userProjects, setProjectsData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const { query } = useParams();
  const [databaseQueried, setDataQueried] = useState(false);

  // pagination handling
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const handlePaginationChange = (event, value) => {
    setProjectsData([]);
    setIsDataLoading(true);
    setPage(value);
  };

  useEffect(() => {
    async function fetchData() {
      const result = await fetch("/auth/isLoggedIn", { method: "GET" });
      const parsedResult = await result.json();
      loggedIn.current = parsedResult.isLoggedIn;
      setLoggedInUser(parsedResult.user);
      setLoggedIn(loggedIn.current);
      setIsDataLoading(true);
    }
    fetchData();
  }, []);

  useEffect(() => {
    // get the user's project count to implement pagination
    async function fetchProjectCount() {
      if (loggedInUser) {
        const projectCountResult = await fetch(
          `/searchProjects/${loggedInUser._id}/count/${query}`,
          {
            method: "GET",
          }
        );
        const parsedProjectsData = await projectCountResult.json();
        setProjectCount(parsedProjectsData.count);
        setIsDataLoading(false);
      }
    }
    fetchProjectCount();
  }, [loggedInUser, query]);

  // use effect that pulls projects based on the page that was selected
  useEffect(() => {
    async function fetchProjectData() {
      if (loggedInUser && loggedInUser._id && query) {
        const dataResult = await fetch(
          `/searchProjects/${loggedInUser._id}/${query}/page/${page}`,
          {
            method: "GET",
          }
        );
        const parsedProjectsData = await dataResult.json();
        setProjectsData(parsedProjectsData);
        setIsDataLoading(false);
        setDataQueried(true);
      }
    }
    fetchProjectData();
  }, [loggedInUser, page, query]);

  // this handles the logoutbutton pressing and we call the props.logoutpressed too to let the main App component know the state has changed.
  const logoutPressed = () => {
    setLoggedIn(false);
    setLoggedInUser(null);
    props.logoutPressed();
  };

  if (isLoggedIn && loggedInUser) {
    return (
      <div>
        <Navbar logoutPressed={logoutPressed} />
        <div className="container-fluid">
          <div className="row">
            <nav
              id="sidebarMenu"
              className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
            >
              <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      to="/dashboard"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-home"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-users"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>

            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Search Results: {query}</h1>
              </div>
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {isDataLoading && (
                  <Loader
                    type="Puff"
                    color="#005252"
                    height={500}
                    width={500}
                  />
                )}
                {userProjects.map((project) => {
                  return (
                    <Link
                      key={project._id}
                      className="projectLink"
                      to={"/projects/" + project._id}
                    >
                      <ProjectCard
                        key={project._id}
                        name={project.projectName}
                        description={project.projectDescription}
                      />
                    </Link>
                  );
                })}
                {(databaseQueried && userProjects.length) === 0 && (
                  <h3> Results not found.</h3>
                )}
              </div>
              <div className="d-flex justify-content-center mt-2">
                <div className={classes.root}>
                  <Typography>Page: {page}</Typography>
                  <Pagination
                    count={Math.floor(projectCount / 14) + 1}
                    page={page}
                    onChange={handlePaginationChange}
                  />
                </div>
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
}

SearchResultsPage.propTypes = {
  logoutPressed: PropTypes.func.isRequired,
};

export default SearchResultsPage;
