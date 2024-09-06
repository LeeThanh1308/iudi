import Header3 from "../../../../components/Header/Header3";
import GroupDetail from "../GroupDetail/GroupDetail";
import GroupImages from "../GroupImages/GroupImages";

function PostDetailGroup() {

  return ( <div>
    <Header3 onGetHeight={() => 100} />
      <div className=" mt-[100px]">
      <div className="text-white p-5">
            <div className="grid 2xl:grid-cols-2 grid-cols-1 py-5 gap-3">
              <GroupDetail />
              <GroupImages />
            </div>
          </div>
      </div>
  </div> );
}

export default PostDetailGroup;