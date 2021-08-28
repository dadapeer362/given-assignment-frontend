import React, { useState, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Cookie from "js-cookie";
import Header from "../Header";
import "./index.css";

class Home extends Component {
  state = { uploadedFileData: [], fetchedDataUsers: [] };

  componentDidMount() {
    this.onGetUsersData();
  }

  onGetUsersData = async () => {
    const jwtToken = Cookie.get("jwt_token");
    const usersDetailsApiUrl = `http://localhost:3001/get/`;
    const optionsUsersData = {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET",
    };
    const responseUsersData = await fetch(usersDetailsApiUrl, optionsUsersData);
    const fetchedUsersData = await responseUsersData.json();
    const updatedData = fetchedUsersData.map((eachItem) => ({
      userId: eachItem.user_id,
      id: eachItem.id,
      title: eachItem.title,
      body: eachItem.body,
    }));
    this.setState({ fetchedDataUsers: updatedData });
  };

  handleChange = (e) => {
    try {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0]);
      fileReader.onload = (e) => {
        this.setState({ uploadedFileData: e.target.result });
      };
    } catch (error) {
      console.log(error);
    }
  };

  onSubmitUploadedFile = async (event) => {
    event.preventDefault();
    const { uploadedFileData } = this.state;
    console.log(uploadedFileData);
    const fileData = { uploadedFileData };
    const tokenJwt = Cookie.get("jwt_token");
    const postApiUrl = "http://localhost:3001/post/";
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenJwt}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(fileData),
    };
    const response = await fetch(postApiUrl, options);
    const data = await response.json();
    console.log(data);
    this.onGetUsersData();
  };

  onShowFetchedUsersData = () => {
    const { fetchedDataUsers } = this.state;
    console.log(fetchedDataUsers);
    return (
      <ul className="users-ul-container">
        {fetchedDataUsers.map((eachItem) => (
          <li key={eachItem.id} className="users-li-container">
            <h1>{eachItem.title}</h1>
            <p>{eachItem.body}</p>
          </li>
        ))}
      </ul>
    );
  };

  render() {
    return (
      <>
        <Header />
        <div className="home-container">
          <h1 className="home-upload-heading">Upload Json file</h1>
          <form onSubmit={this.onSubmitUploadedFile}>
            <input
              className="home-upload-button"
              type="file"
              onChange={this.handleChange}
              accept="application/json"
            />
            <button type="submit" className="save-button">
              Save
            </button>
          </form>
          {this.onShowFetchedUsersData()}
        </div>
      </>
    );
  }
}

export default Home;
