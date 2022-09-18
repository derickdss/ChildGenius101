import React, {useState, useEffect} from 'react'

const StopWatch = ({showControlButtons = true, autostart=true}) => {
    const [time, setTime] = useState(0);
    const [start, setStart] = useState(autostart);

    console.log('derd, show controle button', showControlButtons)
    useEffect(()=> {
        let interval = null;

        if(start) {
            interval = setInterval(()=> {
                setTime(prevTime => prevTime + 10)
            }, 10)
        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval);

    }, [start])

    const getMinutes = () => ("0" + Math.floor((time / 60000) % 60)).slice(-2)
    const getSeconds = () => ("0" + Math.floor((time / 1000) % 60)).slice(-2)
    const getMilliseconds = () => ("0" + ((time / 10) % 1000)).slice(-2)

    return (
        <div>
            {/* <h1>Time:</h1> */}
            <span style={{fontSize: 50, color: 'rgb(57, 61, 241)'}}><b>{`${getMinutes()}:${getSeconds()}:${getMilliseconds()}`}</b></span>
            {showControlButtons &&<div>
                <button onClick={() => setStart(true)}>Start</button>
                <button onClick={() => setStart(false)}>Stop</button>
                <button onClick={() => {setTime(0); setStart(false);}}>Reset</button>
            </div>}
        </div>
    )
}

export default StopWatch;