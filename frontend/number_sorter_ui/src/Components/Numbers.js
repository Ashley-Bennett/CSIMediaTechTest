import React, { useState } from "react";

const Numbers = () => {
  const API_URL = "http://localhost:20954";
  const inputValidationRegex = /^(?!.* {2})[0-9 ]*(?<! )$/gm;

  const getAllNumbers = () => {
    fetch(API_URL + "/api/Numbers/GetNumbers")
      .then((res) => res.json())
      .then((data) => {
        setnumbersSorted(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmitNumbers = (e) => {
    e.preventDefault();
    setNumberValidationMessage("");
    setInputValidation("");
    setSubmitButtonDisabled(true);
    if (inputValidation !== "valid") {
      setNumberValidationMessage(
        "Input not valid, check your numbers and try again"
      );
      setSubmitButtonDisabled(false);
      return;
    }

    const form = e.target;
    const formData = new FormData(form);

    const addedNumbers = formData.getAll("addedNumbers")[0];
    const match = addedNumbers.match(inputValidationRegex);

    if (match === null) {
      setNumberValidationMessage(
        "You must only uses numbers and single spaces"
      );
      return;
    } else if (match[0] === "") {
      setNumberValidationMessage("This cannot be empty");
      return;
    }
    fetch(
      API_URL +
        `/api/Numbers/AddNumbers?ascending=${formData.getAll("ascending")[0]}`,
      {
        method: form.method,
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setValidationMessage(data.SuccessResult);
        setInputValidation("valid");
        setSubmitButtonDisabled(false);
      });
  };

  const checkValidation = (e) => {
    e.preventDefault();
    const input = e.target.value;
    const match = input.match(inputValidationRegex);

    if (match === null) {
      setNumberValidationMessage(
        "You must only uses numbers and single spaces"
      );
      setInputValidation("invalid");
      return;
    } else if (match[0] === "") {
      setNumberValidationMessage("");
      setInputValidation("");
      return;
    } else {
      setNumberValidationMessage("");
      setInputValidation("valid");
    }
  };

  const [numbersSorted, setnumbersSorted] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [numberValidationMessage, setNumberValidationMessage] = useState("");
  const [inputValidation, setInputValidation] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  return (
    <div>
      <form method="post" onSubmit={handleSubmitNumbers}>
        Enter single space separated series of numbers:{" "}
        <label className="inputControl" onInput={checkValidation}>
          <input
            name="addedNumbers"
            className={`inputNumbers ${inputValidation}`}
          />{" "}
        </label>
        {numberValidationMessage}
        <p>
          Order:
          <label class="radioControl">
            <input
              type="radio"
              name="ascending"
              value={true}
              defaultChecked={true}
            />
            Ascending
          </label>
          <label class="radioControl">
            <input type="radio" name="ascending" value={false} />
            Descending
          </label>
        </p>
        <button
          className="buttonMain"
          type="submit"
          disabled={submitButtonDisabled}
        >
          Sort
        </button>
      </form>
      <div className="result">
        <p>{validationMessage}</p>
        <p>These are your numbers sorted {}:</p>
      </div>
      <div className="tableContainer">
        <button onClick={getAllNumbers} className="buttonMain">
          Get numbers
        </button>
        {numbersSorted.length > 0 ? (
          <table>
            <tr>
              <th>Numbers</th>
              <th>Order</th>
            </tr>
            {numbersSorted.map((numberSequence) => {
              return (
                <tr>
                  <td>{numberSequence.numbers}</td>
                  <td>
                    {numberSequence.ascending ? "Ascending" : "Descending"}
                  </td>
                </tr>
              );
            })}
          </table>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Numbers;
