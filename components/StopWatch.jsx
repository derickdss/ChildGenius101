import React, { useState, useEffect } from "react";
import { Text } from "react-native";

const StopWatch = ({autostart=true, stop=false, saveTimerValue}) => {
    const [time, setTime] = useState(0);
    const [start, setStart] = useState(autostart);

    const getMinutes = () => ("0" + Math.floor((time / 60000) % 60)).slice(-2)
    const getSeconds = () => ("0" + Math.floor((time / 1000) % 60)).slice(-2)
    const getMilliseconds = () => ("0" + ((time / 10) % 1000)).slice(-2)


    useEffect(()=> {
        let interval = null;

        if(stop) {
            saveTimerValue(`${getMinutes()}:${getSeconds()}:${getMilliseconds()}`);
            clearInterval(interval);
        }

        if(start) {
            interval = setInterval(()=> {
                setTime(prevTime => prevTime + 10)
            }, 10)
        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval);

    }, [start, stop])

    
  return (
    <Text>
        <Text style={{fontSize: 50, fontWeight: 'bold', color: 'rgb(57, 61, 241)'}}>
            {`${getMinutes()}:${getSeconds()}:${getMilliseconds()}`}
        </Text>
        <Text numberOfLines={5}>body</Text>
    </Text>
  );
};

export default StopWatch;