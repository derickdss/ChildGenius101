import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";

const StopWatch = ({ initialTime = 60, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const firedRef = useRef(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (!firedRef.current) {
                firedRef.current = true;
                onTimeUp && onTimeUp();
            }
            return;
        }
        // one tick per second; cleanup cancels the pending tick on unmount
        const timeout = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timeout);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isLow = timeLeft <= 10;

    return (
        <Text style={{ width: 300, paddingLeft: 80, paddingTop: 30 }}>
            <Text
                style={{
                    fontSize: 50,
                    fontWeight: "bold",
                    color: isLow ? "red" : "rgb(57, 61, 241)",
                }}
            >
                {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
            </Text>
        </Text>
    );
};

export default StopWatch;
