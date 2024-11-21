"use client";

import { useRef } from "react";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
function Homev2() {
  
  const [urls, setUrls] = useState([

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
              transition-all duration-200  animate-pop smooth`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* <textarea type="text" value={shortUrl} className="w-full h-fulls outline-none bg-transparent rounded-md hover:bg-slate-200" /> */}
              {/* <a href={`https://gehe.fyi/${shortUrl}`} target='_blank' className='underline'>gehe.fyi/{shortUrl}</a>
            <a href="#" className='underline block pt-4'>{originalUrl}</a> */}
              <div className='flex items-center'>
                gehe.fyi/
                <EditableDiv className='translate-x-[-10px]'>
                  {shortUrl}
                </EditableDiv>
              </div>
              <div className='mt-2 overflow-hidden flex items-center'>
                <EditableDiv className='mb-4 text-black mt-6'>
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
  let TO = null;
  const handleBlur = () => {
    const content = divRef.current.textContent;
    console.log("Content after blur:", content);
    setCanEdit(false);
    // Perform any actions with 'content' here
  };

  return (
    <>
      <span
        ref={divRef}
        contentEditable={canEdit}
        onBlur={handleBlur}
        onMouseEnter={() => {
          setCanEdit(true);
          clearTimeout(TO);
          divRef.current.focus();
        }}
        onMouseLeave={() => {
          TO = setTimeout(() => {
            setCanEdit(false);
          }, 1000);
        }}
        suppressContentEditableWarning={true}
        className={`px-2 py-1 rounded-md overflow-ellipsis transition-all underline-offset-4 
          duration-100 outline-none hover:underline border-2 border-transparent 
          hover:border-gray-400 ${className} ${canEdit ? "border-2 bg-white" : ""}`}
        // style={{ padding: "10px" }}
      >
        {children}
      </span>
      {/* <MdEdit /> */}
    </>
  );
};
