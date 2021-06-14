import React from "react";

/**
 * @description - Row component of the table that contains information about each repo.
 */
const Repository = (props) => {
  return (
    <tr>
      <td>{props.keyName}</td>
      {props.seen ? (
        <td>{props.latestReleaseDate}</td>
      ) : (
        <td class="text-success">{props.latestReleaseDate}</td>
      )}
      <td>
        {!props.seen ? (
          <button
            id={`${props.keyName}NewButton`}
            onClick={(e) => props.onClickSeen(props.keyName)}
            variant="light"
          >
            New!
          </button>
        ) : null}
      </td>
      <td>
        <button
          id={`${props.keyName}DeleteButton`}
          onClick={(e) => props.onClickDelete(props.keyName)}
          variant="danger"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Repository;
