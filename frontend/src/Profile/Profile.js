import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import { useEffect, useRef, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import IconImage from "../Images/userIcon.png";
import Footer from "../Footer/Footer.js";
import { toast } from "react-toastify";
import ProjectCard from "../Dashboard/ProjectCard";
import PropTypes from "prop-types";

function Profile(props) {
  let loggedIn = useRef(null);
  const [isLoggedIn, setLoggedIn] = useState(loggedIn);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [userData, setUserData] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [userProjects, setProjectsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setIsDataLoading(true);
      const result = await fetch("/auth/isLoggedIn", { method: "GET" });
      const parsedResult = await result.json();
      loggedIn.current = parsedResult.isLoggedIn;
      setLoggedInUser(parsedResult.user);
      setLoggedIn(loggedIn.current);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (loggedInUser && loggedInUser._id) {
        const userDataResult = await fetch(`/userData/${loggedInUser._id}`, {
          method: "GET",
        });
        const parsedUserDataResult = await userDataResult.json();
        setUserData(parsedUserDataResult);
        setIsDataLoading(false);
      }
    }
    fetchUserData();
  }, [loggedInUser]);

  // this use effect will generate the 5 most recent projects of the user
  useEffect(() => {
    async function fetchProjectData() {
      if (loggedInUser) {
        const dataResult = await fetch(
          `/projects/${loggedInUser._id}/profile`,
          {
            method: "GET",
          }
        );
        const parsedProjectsData = await dataResult.json();
        setProjectsData(parsedProjectsData);
      } else {
        toast.error("Please sign in!");
        setLoggedIn(false);
      }
    }
    fetchProjectData();
  }, [loggedInUser]);

  // this handles the logoutbutton pressing and we call the props.logoutpressed too to let the main App component know the state has changed.
  const logoutPressed = () => {
    setLoggedIn(false);
    setLoggedInUser(null);
    props.logoutPressed();
  };

  if (isLoggedIn) {
    return (
      <div className="profile-cont">
        <Navbar logoutPressed={logoutPressed} />
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/dashboard">
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
                <Link className="nav-link active" to="profile">
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
          <div className="profile-container">
            <h1 className="mt-3">Profile:</h1>
            <div className="main-body">
              {isDataLoading && (
                <div className="container">
                  <Loader
                    type="Puff"
                    color="#005252"
                    height={500}
                    width={500}
                  />{" "}
                </div>
              )}
              {!isDataLoading && (
                <div className="row gutters-sm">
                  <div className="col-md-4 mb-3">
                    <div className="profile-card">
                      <div className="p-card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                          <img
                            src={IconImage}
                            alt="Admin"
                            className="rounded-circle"
                            width="120"
                          />
                          <h2 className="card-title mb-0">
                            {userData.fullname}
                          </h2>
                          <div className="mt-3">
                            <Link className="btn editBtn" to="/profile/update">
                              Edit Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="profile-card mb-3">
                      <div className="p-card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 descriptor-p">Full Name</p>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {userData.fullname}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 descriptor-p">Job</p>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {userData.job}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 descriptor-p">Institution</p>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {userData.institution}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 descriptor-p">Email</p>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {userData.username}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 descriptor-p">Location</p>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {userData.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-4" style={{ color: "#005252" }}>
                    Most Recent Projects
                  </h3>
                </div>
              )}
              <div className="row row-cols-1 row-cols-md-2 g-4 mb-3">
                {!isDataLoading &&
                  userProjects.map((project) => {
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
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="#005252"
                  fillOpacity="1"
                  d="M0,0L48,5.3C96,11,192,21,288,69.3C384,117,480,203,576,208C672,213,768,139,864,133.3C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
}

Profile.propTypes = {
  logoutPressed: PropTypes.func.isRequired,
};

export default Profile;
