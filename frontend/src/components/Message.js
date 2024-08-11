import React, { useState } from "react";

function Message() {
    const [dispatch,setDispatch] = useState("Open ClipHop on another device to sync your clipboards")
    return (
        <div className="mt-[3rem]">
        <h2 className="text-[#0094C2] text-center text-xl md:text-3xl font-lato">
            {dispatch}
        </h2>
        </div>
    )
}

export default Message;