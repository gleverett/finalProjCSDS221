import {React, useEffect, useState} from "react";

export default function Message({children, avatar, username, description}) {

    return(
        <div className={`p-8 border b-2`}>
            <div className="flex items-center gap-2">
                <img src={avatar} className="w-10 rounded-full"/>
                <h2>{username}</h2>
            </div>
            <div className="py-4">
                <p>{description}</p>
            </div>
            {children}
        </div>
    );
}