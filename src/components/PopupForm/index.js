import React from "react";
import { IoMdClose } from "react-icons/io";
function PopupForm({
  isShowForm,
  position = "center",
  title,
  setIsShowForm = () => null,
  children,
  ...props
}) {
  return (
    <React.Fragment>
      {isShowForm && (
        <div
          className={`" fixed top-0 right-0 left-0 bottom-0 flex justify-center items-${position} z-50 text-white backdrop-blur-md bg-black/50"`}
          onKeyDown={(e) => console.log(e)}
        >
          <div className=" w-3/4 backdrop-blur-md shadow-sm shadow-black relative px-8 pt-4 pb-12 rounded-lg overflow-hidden">
            <div className=" relative w-full py-2 flex justify-between items-baseline">
              <div>
                <h2 className="text-2xl font-semibold">{title}</h2>
              </div>
              <div
                onClick={() => setIsShowForm(false)}
                className=" w-7 h-7 rounded-full bg-red-500 cursor-pointer text-xl font-bold text-red-900 hover:text-white flex justify-center items-center"
              >
                <IoMdClose />
              </div>
            </div>
            <div className=" pt-3 ">{children}</div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default PopupForm;
