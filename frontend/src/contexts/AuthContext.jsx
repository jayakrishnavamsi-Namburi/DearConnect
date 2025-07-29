// // src/context/AuthProvider.jsx
// import axios from "axios";
// import httpStatus from "http-status";
// import { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import server from "../utils/environment";

// console.log("Using backend:", server);

// export const AuthContext = createContext({});

// const client = axios.create({
//   baseURL: `${server}/api/v1/users`,
//   withCredentials: true
// });

// export const AuthProvider = ({ children }) => {
//   const authContext = useContext(AuthContext);
//   const [userData, setUserData] = useState(authContext);
//   const router = useNavigate();

//   const handleRegister = async (name, username, password) => {
//     try {
//       const response = await client.post("/register", {
//         name,
//         username,
//         password,
//       });

//       if (response.status === httpStatus.CREATED) {
//         return response.data.message;
//       }
//     } catch (err) {
//       console.error("Registration error:", err);
//       throw err;
//     }
//   };

//   const handleLogin = async (username, password) => {
//     try {
//       const response = await client.post("/login", {
//         username,
//         password,
//       });

//       if (response.status === httpStatus.OK) {
//         localStorage.setItem("token", response.data.token);
        
//         router("/home");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       throw err;
//     }
//   };

//   const getHistoryOfUser = async () => {
//     try {
//       const response = await client.get("/get_all_activity", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       return response.data;
//     } catch (err) {
//       console.error("Fetching history error:", err);
//       throw err;
//     }
//   };

//   const addToUserHistory = async (meetingCode) => {
//     try {
//       const response = await client.post(
//         "/add_to_activity",
//         { meeting_code: meetingCode },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (err) {
//       console.error("Adding to history error:", err);
//       throw err;
//     }
//   };

//   const data = {
//     userData,
//     setUserData,
//     handleRegister,
//     handleLogin,
//     getHistoryOfUser,
//     addToUserHistory,
//   };

//   return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
// };




// import axios from "axios";
// import httpStatus from "http-status";
// import { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import server from "../utils/environment";

// console.log("Using backend:", server);

// // Axios client for API calls
// const client = axios.create({
//   baseURL: `${server}/api/v1/users`,
//   withCredentials: true, // Send cookies with requests
// });

// export const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const authContext = useContext(AuthContext);
//   const [userData, setUserData] = useState(authContext);
//   const router = useNavigate();

//   // Register a new user
//   const handleRegister = async (name, username, password) => {
//     try {
//       const response = await client.post("/register", {
//         name,
//         username,
//         password,
//       });

//       if (response.status === httpStatus.CREATED) {
//         return response.data.message;
//       }
//     } catch (err) {
//       console.error("Registration error:", err.response?.data || err.message);
//       throw err;
//     }
//   };

//   // Login user
//   const handleLogin = async (username, password) => {
//     try {
//       const response = await client.post("/login", {
//         username,
//         password,
//       });

//       if (response.status === httpStatus.OK) {
//         // No need to manually store token, it's in cookie
//         setUserData({ username });
//         router("/home");
//       }
//     } catch (err) {
//       console.error("Login error:", err.response?.data || err.message);
//       throw err;
//     }
//   };

//   // Get all activity history of the user
//   const getHistoryOfUser = async () => {
//     try {
//       const response = await client.get("/get_all_activity");
//       return response.data;
//     } catch (err) {
//       console.error("Fetching history error:", err.response?.data || err.message);
//       throw err;
//     }
//   };

//   // Add a meeting code to user history
//   const addToUserHistory = async (meetingCode) => {
//     try {
//       const response = await client.post("/add_to_activity", {
//         meeting_code: meetingCode,
//       });
//       return response.data;
//     } catch (err) {
//       console.error("Adding to history error:", err.response?.data || err.message);
//       throw err;
//     }
//   };

//   const data = {
//     userData,
//     setUserData,
//     handleRegister,
//     handleLogin,
//     getHistoryOfUser,
//     addToUserHistory,
//   };

//   return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
// };




import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../utils/environment";


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
})


export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);


    const [userData, setUserData] = useState(authContext);


    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })


            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            console.log(username, password)
            console.log(request.data)

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }


    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}