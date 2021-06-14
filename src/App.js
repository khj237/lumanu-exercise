import { Octokit } from "@octokit/core";
import { Button, Form, Container, Alert } from "react-bootstrap";
import Table from "./components/Table";
import auth from "./auth.json"
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [repoName, setRepoName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [repoList, setRepoList] = useState({});
  const [error, setError] = useState(false);

  const octokit = new Octokit({
    auth: auth.auth,
  });

  /**
   * @description - Adds repo to the list of repos.
   */
  const handleAddRepo = async (ownerName, repoName) => {
    try {
      setError(false);
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/releases/latest",
        {
          owner: ownerName,
          repo: repoName,
        }
      );
      const latestReleaseDate = response["data"]["published_at"].split("T")[0];
      if (!(repoName in repoList)) {
        const newRepoList = Object.assign({}, repoList);
        newRepoList[repoName] = {
          latestReleaseDate: latestReleaseDate,
          seen: false,
          ownerName: ownerName,
        };
        setRepoList(newRepoList);
      }
    } catch (error) {
      setError(true);
    }
  };

  /**
   * @description - Updates release dates of all the repos in the list.
   */
  const handleUpdateRepositories = async (repoList) => {
    const newRepoList = Object.assign({}, repoList);
    for (const repoName in repoList) {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/releases/latest",
        {
          owner: newRepoList[repoName]["ownerName"],
          repo: repoName,
        }
      );
      const latestReleaseDate = response["data"]["published_at"].split("T")[0];
      if (newRepoList[repoName]["latestReleaseDate"] !== latestReleaseDate) {
        newRepoList[repoName]["latestReleaseDate"] = latestReleaseDate;
        newRepoList[repoName]["seen"] = false;
      }
    }
    setRepoList(newRepoList);
  };

  /**
   * @description - Delete the repo from the repo list.
   */
  const deleteRepo = (repoName) => {
    const newRepoList = Object.assign({}, repoList);
    delete newRepoList[repoName];
    setRepoList(newRepoList);
  };

  /**
   * @description - Update the repo as seen.
   */
  const updateSeen = (repoName) => {
    const newRepoList = Object.assign({}, repoList);
    newRepoList[repoName]["seen"] = true;
    setRepoList(newRepoList);
  };

  /**
   * @description - Sort list of repo. Repos that have not been seen will be at the top of the list.
   */
  const sortBySeen = (repoList) => {
    const newRepoList = Object.assign({}, repoList);
    const sortable = Object.fromEntries(
      Object.entries(newRepoList).sort(([, a], [, b]) => a["seen"] - b["seen"])
    );
    setRepoList(sortable);
  };

  return (
    <Container>
      <h1>Git Repositories</h1>
      <div className="App">
        <Form>
          <Form.Group controlId="ownerName">
            <Form.Label>Owner Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Owner Name"
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="repoName">
            <Form.Label>Repository Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Git Repository"
              onChange={(e) => setRepoName(e.target.value)}
            />
          </Form.Group>
          {error ? (
            <Alert key="errorMessage" variant="danger">
              Repository doesn't exist!
            </Alert>
          ) : null}
          <Button
            id="addRepoButton"
            variant="primary"
            onClick={(e) => handleAddRepo(ownerName, repoName)}
          >
            Add Repo
          </Button>
          <Button
            id="updateButton"
            variant="light"
            onClick={(e) => handleUpdateRepositories(repoList)}
          >
            Update Release Dates
          </Button>
          <Button
            id="sortBySeen"
            variant="light"
            onClick={(e) => sortBySeen(repoList)}
          >
            Sort
          </Button>
        </Form>

        <br></br>
        <div>
          <Table
            repoList={repoList}
            headers={["Repository Name", "Release Date", "Seen", "Delete"]}
            onClickSeen={updateSeen}
            onClickDelete={deleteRepo}
          ></Table>
        </div>
      </div>
    </Container>
  );
}

export default App;
