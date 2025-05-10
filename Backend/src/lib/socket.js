const { io } = require("../config/server.config");
const ChatSession = require("../models/chat-session.model");
const moment = require("moment");

let connectedUser = [];
let connectedAdmins = [];

const getConnectedAdmins = () => {
  return connectedAdmins;
};

const getConnectedUsers = () => {
  return connectedUser;
};

const getSocketIdBySessionId = (sessionId) => {
  const session = connectedUser.find(
    (session) => session?.sessionId === sessionId
  );
  return session?.socketId || null;
};

const notifyAdminsAboutNewUser = async (sessionId, newUserConnectedAt) => {
  try {
    const session = await ChatSession.findOne({ where: { id: sessionId } });
    session.setDataValue("connectedAt", newUserConnectedAt);

    connectedAdmins.forEach((admin) => {
      io.to(admin.socketId).emit("user_connected", {
        connectedUser: connectedUser.map(({ sessionId, connectedAt }) => ({
          sessionId,
          connectedAt,
        })),
        session: session || null,
      });
    });
  } catch (error) {
    console.error("Error in fetching newly connected user", error);
  }
};

io.on("connect", (socket) => {
  const { sessionId, userType } = socket.handshake.query;
  console.log(`${userType} connected - `, socket.id);

  if (sessionId && userType === "user") {
    const newUser = {
      sessionId: sessionId ? parseInt(sessionId) : null,
      socketId: socket.id,
      userType: userType,
      connectedAt: moment(),
    };
    connectedUser = [...connectedUser, newUser];

    // notify admins when either a new user connected or existing user came online
    notifyAdminsAboutNewUser(sessionId, newUser.connectedAt);
  }

  if (userType === "admin") {
    connectedAdmins = [
      ...connectedAdmins,
      {
        sessionId: null,
        socketId: socket.id,
        userType: userType,
        connectedAt: moment(),
      },
    ];
  }

  // to send data to the every connected user except the sender
  // socket.on("send_message", (data) => {
  //     socket.broadcast.emit("new_message", data)
  // })

  socket.on("disconnect", () => {
    console.log(`A ${userType} disconnected- `, socket.id);
    connectedUser = connectedUser.filter((user) => user.socketId !== socket.id);
    const admins = getConnectedAdmins();
    admins.forEach((admin) => {
      io.to(admin.socketId).emit("user_disconnected", connectedUser);
    });
  });
});


module.exports = {
  getConnectedAdmins,
  getConnectedUsers,
  getSocketIdBySessionId,
};
