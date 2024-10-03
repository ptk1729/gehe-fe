"use client";

import { useRef } from "react";
import { useState } from "react";
function Homev2() {
  const [urls, setUrls] = useState([
    {
      id: "7bfb8e7f-0962-4594-8ac7-a0569324818f",
      originalUrl: "https://youtu.be/S1DvEdR0iUo",
      shortUrl: "ghb12",
      clicks: 0,
      archived: false,
      userId: "0459e464-7361-401d-92b1-7face8ea97a3",
      createdAt: "2024-09-24T21:05:43.664Z",
      updatedAt: "2024-09-27T12:51:34.470Z"
    },
    {
      id: "319ed6c0-1ddf-4beb-87d1-fdd83b4a0175",
      originalUrl: "https://www.instagram.com/",
      shortUrl: "instagramcom",
      clicks: 0,
      archived: false,
      userId: "0459e464-7361-401d-92b1-7face8ea97a3",
      createdAt: "2024-10-02T13:41:37.015Z",
      updatedAt: "2024-10-02T13:41:37.015Z"
    },
    {
      id: "bea1d6f2-beeb-41a1-8dd9-a26e7366e74b",
      originalUrl: "https://app.daily.dev/posts/Xly21E7vF",
      shortUrl: "appdailydev",
      clicks: 1,
      archived: false,
      userId: "0459e464-7361-401d-92b1-7face8ea97a3",
      createdAt: "2024-10-02T15:09:22.419Z",
      updatedAt: "2024-10-02T15:10:20.874Z"
    }
  ]);
  return (
    <div className='font-mono bg-gray-100'>
      {/* heading that says "Urls" in the middle */}
      <h1 className='text-4xl font-bold text-center mt-8'>Urls</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {urls.map(
          (
            {
              id,
              originalUrl,
              shortUrl,
              clicks,
              archived,
              userId,
              createdAt,
              updatedAt
            },
            i
          ) => (
            <div
              key={id}
              className={`ovreflow-hidden min-w-[350px] hover:border-2 border-2 
              hover:border-gray-400 rounded-xl h-[150px] 
              opacity-0 bg-white-100/30 mx-8 mt-6 p-4 shadow-base hover:shadow-md
              transition-all duration-200 hover:bg-white/20 animate-pop smooth`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* <textarea type="text" value={shortUrl} className="w-full h-fulls outline-none bg-transparent rounded-md hover:bg-slate-200" /> */}
              {/* <a href={`https://gehe.fyi/${shortUrl}`} target='_blank' className='underline'>gehe.fyi/{shortUrl}</a>
            <a href="#" className='underline block pt-4'>{originalUrl}</a> */}
              <div className='ml-4 mt-4'>
                gehe.fyi/
                <EditableDiv className='mt-2 py-2 pr-2 pl-0'>
                  {shortUrl}
                </EditableDiv>
              </div>
              <div className='mt-2 py-2 pr-2 pl-2'>
                <EditableDiv className='mb-4 mt-2 py-2 pr-2 pl-2'>
                  {originalUrl}
                </EditableDiv>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
export default Homev2;

const EditableDiv = ({ className, children }) => {
  const divRef = useRef(null);
  const [canEdit, setCanEdit] = useState(false);

  const handleBlur = () => {
    const content = divRef.current.textContent;
    console.log("Content after blur:", content);
    setCanEdit(false);
    // Perform any actions with 'content' here
  };

  return (
    <span className='inline'>
      <span
        ref={divRef}
        contentEditable={canEdit}
        onBlur={handleBlur}
        onMouseEnter={() => {
          setCanEdit(true);
          divRef.current.focus();
        }}
        onMouseLeave={() => setCanEdit(false)}
        suppressContentEditableWarning={true}
        className={` rounded-md overflow-ellipsis transition-all underline-offset-4 duration-100 outline-none hover:underline border-1 hover:border-gray-400 hover:border-1 ${className} ${
          canEdit ? "bg-white" : ""
        }`}
        // style={{ padding: "10px" }}
      >
        {children}
      </span>
    </span>
  );
};
