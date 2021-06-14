import React from "react";
import Repository from "./Repository";

/**
 * @description - Table component that contains information of the repos.
 */
const Table = (props) => {
  return (
    <div>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark" key="header-1">
          <tr key="header-0">
            {props.headers.map((value, index) => (
              <th key={index}>
                <div>{value}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.repoList).map((keyName, i) => {
            return (
              <Repository
                key={keyName}
                seen={props.repoList[keyName]["seen"]}
                latestReleaseDate={props.repoList[keyName]["latestReleaseDate"]}
                ownerName={props.repoList[keyName]["ownerName"]}
                keyName={keyName}
                onClickSeen={props.onClickSeen}
                onClickDelete={props.onClickDelete}
              ></Repository>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
