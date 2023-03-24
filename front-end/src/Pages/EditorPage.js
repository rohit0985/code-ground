import React, { useEffect, useRef, useState } from "react";
import Clint from "../Components/Clint";
import Editor from "../Components/Editor";
import { initSocket } from "../socket";
import { actions } from "../actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const codeRef = useRef(null);

  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));

      function handleError(err) {
        console.log("socket error", err);
        toast.error("Socket connection failed, try agin later");
        reactNavigator("/");
      }

      socketRef.current.emit(actions.JOIN, {
        roomId,
        userName: location.state?.userName,
      });

      //listening for joined

      socketRef.current.on(
        actions.JOINED,
        ({ clients, userName, socketId }) => {
          if (userName !== location.state?.userName) {
            toast.success(`${userName} joined the room`);
          }
          setClientList(clients);
          socketRef.current.emit(actions.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // listening for disconnected
      socketRef.current.on(actions.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left the room`);
        setClientList((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(actions.JOINED);
      socketRef.current.off(actions.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("ROOM ID has been copied to clipboard");
    } catch (error) {
      toast.error("Could not copy ROOM ID");
      console.log(error);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mainWrapper">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img
              className="logoImage"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6slgwtlb0Xd6ngvc7WM2r91uFKIxbs3GS1A&usqp=CAU"
              alt="logo"
            />
          </div>
          <h3>Connected...</h3>

          <div className="clintsList">
            {clientList.length > 0 &&
              clientList.map((currClint, idx) => (
                <Clint key={currClint.socketId} userName={currClint.userName} />
              ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
