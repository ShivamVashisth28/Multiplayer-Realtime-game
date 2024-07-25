import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import { userAtom } from "../store/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		const socket = io("http://localhost:3000", {
			query: {
				userId: user.userId,
			},
		});

		setSocket(socket);

		
		return () => socket && socket.close();
	}, [user]);

	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};