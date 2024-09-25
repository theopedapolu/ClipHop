import React from "react";

function Message({dispatch}) {
    return (
        <div className="mt-[3rem]">
        <h2 className="text-[#0094C2] text-center text-xl md:text-3xl font-lato">
            {dispatch}
        </h2>
        </div>
    )
}

export default Message;