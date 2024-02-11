import React, { useState } from "react";

const Numbers = () => {
  const API_URL = "http://localhost:20954";

  const getAllNumbers = () => {
    fetch(API_URL + "/api/Numbers/GetNumbers")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setnumbersSorted(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmitNumbers = (e) => {
    e.preventDefault();
    setNumberValidationMessage("");

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    console.log(formData.getAll("addedNumbers"));

    const re = /^(?!.* {2})[0-9 ]*$/gm;
    const found = formData.getAll("addedNumbers")[0].match(re);

    console.log(found, " match");

    if (found === null) {
      setNumberValidationMessage("You must only uses numbers and spaces");
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
      });
  };

  const [numbersSorted, setnumbersSorted] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [numberValidationMessage, setNumberValidationMessage] = useState("");
  return (
    <div>
      {numberValidationMessage}
      <form method="post" onSubmit={handleSubmitNumbers}>
        <label>
          Enter space separated series of numbers: <input name="addedNumbers" />
        </label>
        <p>
          Order:
          <label>
            <input
              type="radio"
              name="ascending"
              value={true}
              defaultChecked={true}
            />
            Ascending
          </label>
          <label>
            <input type="radio" name="ascending" value={false} />
            Descending
          </label>
        </p>
        <button type="submit">Sort</button>
      </form>
      <p>{validationMessage}</p>
      <button onClick={getAllNumbers}>Get numbers</button>
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
                <td>{numberSequence.ascending ? "Ascending" : "Descending"}</td>
              </tr>
            );
          })}
        </table>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Numbers;
