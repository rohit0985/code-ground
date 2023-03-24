import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate()

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Created new room");
  };

  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("Room ID & UserName is required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      }
    })
  };

  const handleInputEnter = (e) => {
if(e.code === "Enter"){
  joinRoom()
}
  }

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          className="homePageLogo"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6slgwtlb0Xd6ngvc7WM2r91uFKIxbs3GS1A&usqp=CAU"
          alt="logo"
        />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>

        <div className="inputGroup">
          <input
            type="text"
            className="inputbox"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputbox"
            placeholder="USER NAME"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyUp={handleInputEnter}
          />

          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>

          <span className="createInfo">
            If you don't have an invite then create&nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>

      <footer>
        <h4>Built with ❤️, by Rohit Kumar</h4>
      </footer>
    </div>
  );
};

export default HomePage;
